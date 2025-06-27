import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import type { MutationCtx } from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";
import { internal } from "../../_generated/api";
import { 
  BOOKING_STATUS, 
  PAYMENT_STATUS,
  createActivityBookingValidator,
  createEventBookingValidator,
  createRestaurantReservationValidator,
  createVehicleBookingValidator,
  updateActivityBookingValidator,
  updateEventBookingValidator,
  updateRestaurantReservationValidator,
  updateVehicleBookingValidator,
} from "./types";
import { 
  generateConfirmationCode, 
  calculateActivityBookingPrice,
  calculateEventBookingPrice,
  calculateVehicleBookingPrice,
  hasDateConflict,
  isValidEmail,
  isValidPhone,
} from "./utils";
import { checkRateLimit, recordRateLimitAttempt } from "../../shared/rateLimiting";

/**
 * Create activity booking
 */
export const createActivityBooking = mutation({
  args: createActivityBookingValidator,
  returns: v.object({
    bookingId: v.id("activityBookings"),
    confirmationCode: v.string(),
    totalPrice: v.number(),
  }),
  handler: async (ctx, args) => {
    // Get current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Check rate limit for booking creation
    const rateLimitCheck = await checkRateLimit(ctx, user._id, "CREATE_BOOKING");
    if (!rateLimitCheck.allowed) {
      throw new Error(
        `Limite de reservas excedido. ${rateLimitCheck.remainingAttempts} tentativas restantes. ` +
        `Limite será resetado em ${new Date(rateLimitCheck.resetTime).toLocaleString()}`
      );
    }

    // Definir informações do cliente usando dados do usuário caso não fornecidas
    const customerInfo = args.customerInfo ?? {
      name: user.name || identity.name || "",
      email: user.email || identity.email || "",
      phone: user.phone || "",
    };

    // Validar informações do cliente
    if (!isValidEmail(customerInfo.email)) {
      throw new Error("Email inválido");
    }
    if (!isValidPhone(customerInfo.phone)) {
      throw new Error("Telefone inválido");
    }

    // Substituir args.customerInfo
    args.customerInfo = customerInfo as any;

    // Get activity
    const activity = await ctx.db.get(args.activityId);
    if (!activity) {
      throw new Error("Atividade não encontrada");
    }

    // Check if activity is active
    if (!activity.isActive) {
      throw new Error("Atividade não está disponível");
    }

    // Check participant limits
    if (args.participants < activity.minParticipants) {
      throw new Error(`Mínimo de ${activity.minParticipants} participantes`);
    }
    if (args.participants > activity.maxParticipants) {
      throw new Error(`Máximo de ${activity.maxParticipants} participantes`);
    }

    // Calculate price
    let totalPrice = activity.price;
    if (args.ticketId) {
      const ticket = await ctx.db.get(args.ticketId);
      if (!ticket || !ticket.isActive) {
        throw new Error("Tipo de ingresso não disponível");
      }
      totalPrice = ticket.price;
    }

    const finalPrice = calculateActivityBookingPrice(totalPrice, args.participants);
    const confirmationCode = generateConfirmationCode();

    // Create booking
    const bookingId = await ctx.db.insert("activityBookings", {
      activityId: args.activityId,
      userId: user._id,
      ticketId: args.ticketId,
      date: args.date,
      time: args.time,
      participants: args.participants,
      totalPrice: finalPrice,
      status: BOOKING_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      confirmationCode,
      customerInfo,
      specialRequests: args.specialRequests,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Record successful booking attempt for rate limiting
    await recordRateLimitAttempt(ctx, user._id, "CREATE_BOOKING");

    // Send email confirmation to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingConfirmationEmail, {
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      assetName: activity.title,
      bookingType: "activity",
      confirmationCode,
      bookingDate: args.date,
      totalPrice: finalPrice,
      bookingDetails: {
        activityId: activity._id,
        participants: args.participants,
        date: args.date,
        specialRequests: args.specialRequests,
      },
    });

    // Send notification to partner about new booking
    const partner = await ctx.db.get(activity.partnerId);
    if (partner && partner.email) {
      await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendPartnerNewBookingEmail, {
        partnerEmail: partner.email,
        partnerName: partner.name || "Parceiro",
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        assetName: activity.title,
        bookingType: "activity",
        confirmationCode,
        bookingDate: args.date,
        totalPrice: finalPrice,
        bookingDetails: {
          activityId: activity._id,
          participants: args.participants,
          date: args.date,
          specialRequests: args.specialRequests,
        },
      });
    }

    return {
      bookingId,
      confirmationCode,
      totalPrice: finalPrice,
    };
  },
});

/**
 * Create event booking
 */
export const createEventBooking = mutation({
  args: createEventBookingValidator,
  returns: v.object({
    bookingId: v.id("eventBookings"),
    confirmationCode: v.string(),
    totalPrice: v.number(),
  }),
  handler: async (ctx, args) => {
    // Get current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Definir informações do cliente usando dados do usuário caso não fornecidas
    const customerInfo = args.customerInfo ?? {
      name: user.name || identity.name || "",
      email: user.email || identity.email || "",
      phone: user.phone || "",
    };

    // Validar informações do cliente
    if (!isValidEmail(customerInfo.email)) {
      throw new Error("Email inválido");
    }
    if (!isValidPhone(customerInfo.phone)) {
      throw new Error("Telefone inválido");
    }

    // Substituir args.customerInfo por customerInfo consolidado
    args.customerInfo = customerInfo as any;

    // Get event
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    if (!event.isActive) {
      throw new Error("Evento não está disponível");
    }

    // Calculate price
    let totalPrice = event.price;
    if (args.ticketId) {
      const ticket = await ctx.db.get(args.ticketId);
      if (!ticket || !ticket.isActive) {
        throw new Error("Tipo de ingresso não disponível");
      }
      totalPrice = ticket.price;
    }

    const finalPrice = calculateEventBookingPrice(totalPrice, args.quantity);
    const confirmationCode = generateConfirmationCode();

    // Create booking
    const bookingId = await ctx.db.insert("eventBookings", {
      eventId: args.eventId,
      userId: user._id,
      ticketId: args.ticketId,
      quantity: args.quantity,
      totalPrice: finalPrice,
      status: BOOKING_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      confirmationCode,
      customerInfo,
      specialRequests: args.specialRequests,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Send email confirmation to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingConfirmationEmail, {
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      assetName: event.title,
      bookingType: "event",
      confirmationCode,
      bookingDate: `${event.date} às ${event.time}`,
      totalPrice: finalPrice,
      bookingDetails: {
        eventId: event._id,
        quantity: args.quantity,
        ticketId: args.ticketId,
        location: event.location,
        specialRequests: args.specialRequests,
      },
    });

    // Send notification to partner about new booking
    const partner = await ctx.db.get(event.partnerId);
    if (partner && partner.email) {
      await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendPartnerNewBookingEmail, {
        partnerEmail: partner.email,
        partnerName: partner.name || "Parceiro",
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        assetName: event.title,
        bookingType: "event",
        confirmationCode,
        bookingDate: `${event.date} às ${event.time}`,
        totalPrice: finalPrice,
        bookingDetails: {
          eventId: event._id,
          quantity: args.quantity,
          ticketId: args.ticketId,
          location: event.location,
          specialRequests: args.specialRequests,
        },
      });
    }

    return {
      bookingId,
      confirmationCode,
      totalPrice: finalPrice,
    };
  },
});

/**
 * Create restaurant reservation
 */
export const createRestaurantReservation = mutation({
  args: createRestaurantReservationValidator,
  returns: v.object({
    reservationId: v.id("restaurantReservations"),
    confirmationCode: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Definir informações do cliente usando dados do usuário caso não fornecidas
    const customerInfo = args.customerInfo ?? {
      name: user.name || identity.name || "",
      email: user.email || identity.email || "",
      phone: user.phone || "",
    };

    // Validar informações do cliente
    if (!isValidEmail(customerInfo.email)) {
      throw new Error("Email inválido");
    }
    if (!isValidPhone(customerInfo.phone)) {
      throw new Error("Telefone inválido");
    }

    // Substituir args.customerInfo por customerInfo consolidado
    args.customerInfo = customerInfo as any;

    // Get restaurant
    const restaurant = await ctx.db.get(args.restaurantId);
    if (!restaurant) {
      throw new Error("Restaurante não encontrado");
    }

    if (!restaurant.isActive) {
      throw new Error("Restaurante não está disponível");
    }

    if (!restaurant.acceptsReservations) {
      throw new Error("Restaurante não aceita reservas");
    }

    if (args.partySize > restaurant.maximumPartySize) {
      throw new Error(`Máximo de ${restaurant.maximumPartySize} pessoas por reserva`);
    }

    const confirmationCode = generateConfirmationCode();

    // Create reservation
    const reservationId = await ctx.db.insert("restaurantReservations", {
      restaurantId: args.restaurantId,
      userId: user._id,
      date: args.date,
      time: args.time,
      partySize: args.partySize,
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      specialRequests: args.specialRequests,
      status: BOOKING_STATUS.PENDING,
      confirmationCode,
    });

    // Send email confirmation to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingConfirmationEmail, {
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      assetName: restaurant.name,
      bookingType: "restaurant",
      confirmationCode,
      bookingDate: `${args.date} às ${args.time}`,
      bookingDetails: {
        restaurantId: restaurant._id,
        partySize: args.partySize,
        date: args.date,
        time: args.time,
        specialRequests: args.specialRequests,
      },
    });

    // Send notification to partner about new booking
    const partner = await ctx.db.get(restaurant.partnerId);
    if (partner && partner.email) {
      await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendPartnerNewBookingEmail, {
        partnerEmail: partner.email,
        partnerName: partner.name || "Parceiro",
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        assetName: restaurant.name,
        bookingType: "restaurant",
        confirmationCode,
        bookingDate: `${args.date} às ${args.time}`,
        bookingDetails: {
          restaurantId: restaurant._id,
          partySize: args.partySize,
          date: args.date,
          time: args.time,
          specialRequests: args.specialRequests,
        },
      });
    }

    return {
      reservationId,
      confirmationCode,
    };
  },
});

/**
 * Create vehicle booking
 */
export const createVehicleBooking = mutation({
  args: createVehicleBookingValidator,
  returns: v.object({
    bookingId: v.id("vehicleBookings"),
    totalPrice: v.number(),
  }),
  handler: async (ctx, args) => {
    // Get current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Definir informações do cliente usando dados do usuário caso não fornecidas
    const customerInfo = args.customerInfo ?? {
      name: user.name || identity.name || "",
      email: user.email || identity.email || "",
      phone: user.phone || "",
    };

    // Validar informações do cliente
    if (!isValidEmail(customerInfo.email)) {
      throw new Error("Email inválido");
    }
    if (!isValidPhone(customerInfo.phone)) {
      throw new Error("Telefone inválido");
    }

    // Substituir args.customerInfo por customerInfo consolidado
    args.customerInfo = customerInfo as any;

    // Get vehicle
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Veículo não encontrado");
    }

    if (vehicle.status !== "available") {
      throw new Error("Veículo não está disponível");
    }

    // Check for date conflicts
    const existingBookings = await ctx.db
      .query("vehicleBookings")
      .withIndex("by_vehicleId_status", (q) => 
        q.eq("vehicleId", args.vehicleId).eq("status", "confirmed")
      )
      .collect();

    for (const booking of existingBookings) {
      if (hasDateConflict(booking.startDate, booking.endDate, args.startDate, args.endDate)) {
        throw new Error("Veículo não está disponível nas datas selecionadas");
      }
    }

    // Calculate total price
    const totalPrice = calculateVehicleBookingPrice(
      vehicle.pricePerDay,
      args.startDate,
      args.endDate,
      args.additionalDrivers
    );

    // Create booking
    const bookingId = await ctx.db.insert("vehicleBookings", {
      vehicleId: args.vehicleId,
      userId: user._id,
      startDate: args.startDate,
      endDate: args.endDate,
      totalPrice,
      status: BOOKING_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      pickupLocation: args.pickupLocation,
      returnLocation: args.returnLocation,
      additionalDrivers: args.additionalDrivers,
      additionalOptions: args.additionalOptions,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      bookingId,
      totalPrice,
    };
  },
});

/**
 * Update activity booking status
 */
export const updateActivityBooking = mutation({
  args: updateActivityBookingValidator,
  returns: v.null(),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    await ctx.db.patch(args.bookingId, {
      ...(args.status && { status: args.status }),
      ...(args.paymentStatus && { paymentStatus: args.paymentStatus }),
      ...(args.paymentMethod && { paymentMethod: args.paymentMethod }),
      ...(args.specialRequests && { specialRequests: args.specialRequests }),
      updatedAt: Date.now(),
    });

    return null;
  },
});

/**
 * Cancel activity booking
 */
export const cancelActivityBooking = mutation({
  args: { 
    bookingId: v.id("activityBookings"),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já foi cancelada");
    }

    const activity = await ctx.db.get(booking.activityId);
    if (!activity) {
      throw new Error("Atividade não encontrada");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CANCELED,
      updatedAt: Date.now(),
    });

    // Schedule cancellation notification
    await ctx.scheduler.runAfter(0, internal.domains.notifications.actions.sendBookingCancellationNotification, {
      userId: booking.userId,
      bookingId: booking._id,
      bookingType: "activity",
      assetName: activity.title,
      confirmationCode: booking.confirmationCode,
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      reason: args.reason,
    });

    // Send cancellation email to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingCancelledEmail, {
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      assetName: activity.title,
      bookingType: "activity",
      confirmationCode: booking.confirmationCode,
      reason: args.reason,
    });

    return null;
  },
});

/**
 * Cancel event booking
 */
export const cancelEventBooking = mutation({
  args: { 
    bookingId: v.id("eventBookings"),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já foi cancelada");
    }

    const event = await ctx.db.get(booking.eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CANCELED,
      updatedAt: Date.now(),
    });

    // Schedule cancellation notification
    await ctx.scheduler.runAfter(0, internal.domains.notifications.actions.sendBookingCancellationNotification, {
      userId: booking.userId,
      bookingId: booking._id,
      bookingType: "event",
      assetName: event.title,
      confirmationCode: booking.confirmationCode,
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      reason: args.reason,
    });

    // Send cancellation email to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingCancelledEmail, {
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      assetName: event.title,
      bookingType: "event",
      confirmationCode: booking.confirmationCode,
      reason: args.reason,
    });

    return null;
  },
});

/**
 * Cancel restaurant reservation
 */
export const cancelRestaurantReservation = mutation({
  args: { 
    reservationId: v.id("restaurantReservations"),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);
    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    if (reservation.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já foi cancelada");
    }

    const restaurant = await ctx.db.get(reservation.restaurantId);
    if (!restaurant) {
      throw new Error("Restaurante não encontrado");
    }

    await ctx.db.patch(args.reservationId, {
      status: BOOKING_STATUS.CANCELED,
    });

    // Schedule cancellation notification
    await ctx.runMutation(internal.domains.notifications.mutations.createNotification, {
      userId: reservation.userId,
      type: "booking_canceled",
      title: "Reserva de Restaurante Cancelada ❌",
      message: `Sua reserva no "${restaurant.name}" foi cancelada.${args.reason ? ` Motivo: ${args.reason}` : ''}`,
      relatedId: reservation._id,
      relatedType: "restaurant_booking",
      data: {
        confirmationCode: reservation.confirmationCode,
        bookingType: "restaurant",
        assetName: restaurant.name,
      },
    });

    return null;
  },
});

/**
 * Cancel vehicle booking
 */
export const cancelVehicleBooking = mutation({
  args: { 
    bookingId: v.id("vehicleBookings"),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já foi cancelada");
    }

    const vehicle = await ctx.db.get(booking.vehicleId);
    if (!vehicle) {
      throw new Error("Veículo não encontrado");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CANCELED,
      updatedAt: Date.now(),
    });

    // Schedule cancellation notification
    await ctx.runMutation(internal.domains.notifications.mutations.createNotification, {
      userId: booking.userId,
      type: "booking_canceled",
      title: "Reserva de Veículo Cancelada ❌",
      message: `Sua reserva para "${vehicle.name}" foi cancelada.${args.reason ? ` Motivo: ${args.reason}` : ''}`,
      relatedId: booking._id,
      relatedType: "vehicle_booking",
      data: {
        bookingType: "vehicle",
        assetName: vehicle.name,
      },
    });

    return null;
  },
});

/**
 * Confirm activity booking (Partner only)
 */
export const confirmActivityBooking = mutation({
  args: { 
    bookingId: v.id("activityBookings"),
    partnerNotes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    // Get activity to verify ownership
    const activity = await ctx.db.get(booking.activityId);
    if (!activity) {
      throw new Error("Atividade não encontrada");
    }

    // Check if user has permission to confirm this booking
    const canConfirm = user.role === "master" || 
      (user.role === "partner" && activity.partnerId === user._id) ||
      (user.role === "employee" && await hasEmployeePermission(ctx, user._id, activity._id, "canManageBookings"));

    if (!canConfirm) {
      throw new Error("Sem permissão para confirmar esta reserva");
    }

    if (booking.status === BOOKING_STATUS.CONFIRMED) {
      throw new Error("Reserva já está confirmada");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Não é possível confirmar uma reserva cancelada");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CONFIRMED,
      ...(args.partnerNotes && { partnerNotes: args.partnerNotes }),
      updatedAt: Date.now(),
    });

    // Schedule notification sending action
    await ctx.scheduler.runAfter(0, internal.domains.notifications.actions.sendBookingConfirmationNotification, {
      userId: booking.userId,
      bookingId: booking._id,
      bookingType: "activity",
      assetName: activity.title,
      confirmationCode: booking.confirmationCode,
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      partnerName: user.name,
    });

    return null;
  },
});

/**
 * Confirm event booking (Partner only)
 */
export const confirmEventBooking = mutation({
  args: { 
    bookingId: v.id("eventBookings"),
    partnerNotes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    // Get event to verify ownership
    const event = await ctx.db.get(booking.eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    // Check if user has permission to confirm this booking
    const canConfirm = user.role === "master" || 
      (user.role === "partner" && event.partnerId === user._id) ||
      (user.role === "employee" && await hasEmployeePermission(ctx, user._id, event._id, "canManageBookings"));

    if (!canConfirm) {
      throw new Error("Sem permissão para confirmar esta reserva");
    }

    if (booking.status === BOOKING_STATUS.CONFIRMED) {
      throw new Error("Reserva já está confirmada");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Não é possível confirmar uma reserva cancelada");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CONFIRMED,
      ...(args.partnerNotes && { partnerNotes: args.partnerNotes }),
      updatedAt: Date.now(),
    });

    // Schedule notification sending action
    await ctx.scheduler.runAfter(0, internal.domains.notifications.actions.sendBookingConfirmationNotification, {
      userId: booking.userId,
      bookingId: booking._id,
      bookingType: "event",
      assetName: event.title,
      confirmationCode: booking.confirmationCode,
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      partnerName: user.name,
    });

    return null;
  },
});

/**
 * Confirm restaurant reservation (Partner only)
 */
export const confirmRestaurantReservation = mutation({
  args: { 
    reservationId: v.id("restaurantReservations"),
    partnerNotes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const reservation = await ctx.db.get(args.reservationId);
    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    // Get restaurant to verify ownership
    const restaurant = await ctx.db.get(reservation.restaurantId);
    if (!restaurant) {
      throw new Error("Restaurante não encontrado");
    }

    // Check if user has permission to confirm this reservation
    const canConfirm = user.role === "master" || 
      (user.role === "partner" && restaurant.partnerId === user._id) ||
      (user.role === "employee" && await hasEmployeePermission(ctx, user._id, restaurant._id, "canManageBookings"));

    if (!canConfirm) {
      throw new Error("Sem permissão para confirmar esta reserva");
    }

    if (reservation.status === BOOKING_STATUS.CONFIRMED) {
      throw new Error("Reserva já está confirmada");
    }

    if (reservation.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Não é possível confirmar uma reserva cancelada");
    }

    await ctx.db.patch(args.reservationId, {
      status: BOOKING_STATUS.CONFIRMED,
      ...(args.partnerNotes && { partnerNotes: args.partnerNotes }),
    });

    // Schedule notification sending action
    await ctx.scheduler.runAfter(0, internal.domains.notifications.actions.sendBookingConfirmationNotification, {
      userId: reservation.userId,
      bookingId: reservation._id,
      bookingType: "restaurant",
      assetName: restaurant.name,
      confirmationCode: reservation.confirmationCode,
      customerEmail: reservation.email,
      customerName: reservation.name,
      partnerName: user.name,
    });

    return null;
  },
});

/**
 * Confirm vehicle booking (Partner only)
 */
export const confirmVehicleBooking = mutation({
  args: { 
    bookingId: v.id("vehicleBookings"),
    partnerNotes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    // Get vehicle to verify ownership
    const vehicle = await ctx.db.get(booking.vehicleId);
    if (!vehicle) {
      throw new Error("Veículo não encontrado");
    }

    // Check if user has permission to confirm this booking
    const canConfirm = user.role === "master" || 
      (user.role === "partner" && vehicle.ownerId === user._id) ||
      (user.role === "employee" && await hasEmployeePermission(ctx, user._id, vehicle._id, "canManageBookings"));

    if (!canConfirm) {
      throw new Error("Sem permissão para confirmar esta reserva");
    }

    if (booking.status === BOOKING_STATUS.CONFIRMED) {
      throw new Error("Reserva já está confirmada");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Não é possível confirmar uma reserva cancelada");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CONFIRMED,
      ...(args.partnerNotes && { partnerNotes: args.partnerNotes }),
      updatedAt: Date.now(),
    });

    // Create basic notification for vehicle bookings since they don't have confirmation codes or customer info fields
    await ctx.runMutation(internal.domains.notifications.mutations.createNotification, {
      userId: booking.userId,
      type: "booking_confirmed",
      title: "Reserva de Veículo Confirmada! 🎉",
      message: `Sua reserva para "${vehicle.name}" foi confirmada!`,
      relatedId: booking._id,
      relatedType: "vehicle_booking",
      data: {
        bookingType: "vehicle",
        assetName: vehicle.name,
        partnerName: user.name,
      },
    });

    return null;
  },
});

// Helper function to check employee permissions
async function hasEmployeePermission(
  ctx: MutationCtx, 
  userId: Id<"users">, 
  assetId: Id<"activities"> | Id<"events"> | Id<"restaurants"> | Id<"vehicles">, 
  permission: string
): Promise<boolean> {
  // Check if the user is an employee
  const employee = await ctx.db.get(userId);
  if (!employee || employee.role !== "employee") {
    return false;
  }
  
  // Determine asset type based on the asset ID structure
  let assetType: string;
  const assetIdStr = assetId.toString();
  if (assetIdStr.includes("activities")) {
    assetType = "activities";
  } else if (assetIdStr.includes("events")) {
    assetType = "events";
  } else if (assetIdStr.includes("restaurants")) {
    assetType = "restaurants";
  } else if (assetIdStr.includes("vehicles")) {
    assetType = "vehicles";
  } else {
    return false;
  }
  
  // Check if employee has explicit permission for this asset
  const assetPermissions = await ctx.db
    .query("assetPermissions")
    .withIndex("by_employee_asset_type", (q) => 
      q.eq("employeeId", userId).eq("assetType", assetType)
    )
    .filter((q) => q.eq(q.field("assetId"), assetIdStr))
    .collect();
  
  // If no permissions found, employee doesn't have access
  if (assetPermissions.length === 0) {
    return false;
  }
  
  // If no specific permission required, having any permission is enough
  if (!permission) {
    return true;
  }
  
  // Check if employee has the specific permission
  return assetPermissions.some(p => p.permissions.includes(permission));
}

/**
 * Seed test data for traveler user - only for development/testing
 */
export const seedTestReservations = mutation({
  args: {
    travelerEmail: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    reservationsCreated: v.number(),
  }),
  handler: async (ctx, args) => {
    // Get current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== "master") {
      throw new Error("Apenas usuários master podem executar esta operação");
    }

    // Find traveler user by email
    const travelerUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.travelerEmail))
      .unique();

    if (!travelerUser) {
      throw new Error("Usuário traveler não encontrado");
    }

    const now = Date.now();
    const tomorrow = now + 24 * 60 * 60 * 1000; // Tomorrow
    const nextWeek = now + 7 * 24 * 60 * 60 * 1000; // Next week
    const nextMonth = now + 30 * 24 * 60 * 60 * 1000; // Next month

    let reservationsCreated = 0;

    try {
      // Create test activity booking
      const activityId = await ctx.db.insert("activities", {
        title: "Passeio de Barco - Baía dos Golfinhos",
        description: "Explore a vida marinha em um dos melhores pontos de Fernando de Noronha",
        shortDescription: "Tour pela famosa Baía dos Golfinhos",
        price: 150.0,
        category: "adventure",
        duration: "4 horas",
        maxParticipants: BigInt(10),
        minParticipants: BigInt(2),
        difficulty: "easy",
        rating: 4.8,
        imageUrl: "/images/activity-dolphins.jpg",
        galleryImages: ["/images/activity-dolphins-1.jpg", "/images/activity-dolphins-2.jpg"],
        highlights: ["Observação de golfinhos", "Mergulho livre", "Lanche incluído"],
        includes: ["Equipamento de mergulho", "Guia especializado", "Seguro"],
        itineraries: ["9:00 - Embarque", "10:00 - Chegada na Baía", "12:00 - Retorno"],
        excludes: ["Transporte terrestre"],
        additionalInfo: ["Necessário saber nadar"],
        cancelationPolicy: ["Cancelamento gratuito até 24h antes"],
        isFeatured: true,
        isActive: true,
        hasMultipleTickets: false,
        partnerId: currentUser._id,
      });

      await ctx.db.insert("activityBookings", {
        activityId,
        userId: travelerUser._id,
        date: new Date(nextWeek).toISOString().split('T')[0],
        participants: 2,
        totalPrice: 300.0,
        status: "confirmed",
        confirmationCode: "ACT001",
        customerInfo: {
          name: travelerUser.name || "Usuário",
          email: travelerUser.email || args.travelerEmail,
          phone: travelerUser.phone || "+55 00 00000-0000",
        },
        createdAt: now,
        updatedAt: now,
      });
      reservationsCreated++;

      // Create test restaurant reservation
      const restaurantId = await ctx.db.insert("restaurants", {
        name: "Sol & Mar Noronha",
        slug: "sol-e-mar-noronha",
        description: "Restaurante de frutos do mar com vista panorâmica para o oceano",
        description_long: "Localizado na Vila dos Remédios, oferece pratos da culinária regional com ingredientes frescos locais",
        address: {
          street: "Vila dos Remédios, s/n",
          city: "Fernando de Noronha",
          state: "PE",
          zipCode: "53990-000",
          neighborhood: "Vila dos Remédios",
          coordinates: { latitude: -3.8536, longitude: -32.4297 },
        },
        phone: "+55 81 3619-1234",
        cuisine: ["frutos do mar", "regional"],
        priceRange: "moderate",
        diningStyle: "Casual",
        hours: {
          Monday: ["11:30-15:00", "18:00-22:00"],
          Tuesday: ["11:30-15:00", "18:00-22:00"],
          Wednesday: ["11:30-15:00", "18:00-22:00"],
          Thursday: ["11:30-15:00", "18:00-22:00"],
          Friday: ["11:30-15:00", "18:00-23:00"],
          Saturday: ["11:30-15:00", "18:00-23:00"],
          Sunday: ["11:30-15:00", "18:00-22:00"],
        },
        paymentOptions: ["dinheiro", "cartao", "pix"],
        acceptsReservations: true,
        maximumPartySize: BigInt(8),
        mainImage: "/images/restaurant-sol-mar.jpg",
        galleryImages: ["/images/restaurant-sol-mar-1.jpg"],
        rating: {
          overall: 4.7,
          food: 4.8,
          service: 4.6,
          ambience: 4.7,
          value: 4.5,
          noiseLevel: "moderate",
          totalReviews: BigInt(156),
        },
        features: ["vista-mar", "ar-condicionado", "wifi"],
        isFeatured: true,
        isActive: true,
        tags: ["frutos-do-mar", "vista-mar", "romantico"],
        partnerId: currentUser._id,
      });

      await ctx.db.insert("restaurantReservations", {
        restaurantId,
        userId: travelerUser._id,
        date: new Date(tomorrow).toISOString().split('T')[0],
        time: "19:30",
        partySize: 2,
        name: travelerUser.name || "Usuário",
        email: travelerUser.email || args.travelerEmail,
        phone: travelerUser.phone || "+55 00 00000-0000",
        status: "confirmed",
        confirmationCode: "REST001",
      });
      reservationsCreated++;

      // Create test accommodation booking
      const accommodationId = await ctx.db.insert("accommodations", {
        name: "Pousada Mar Azul",
        slug: "pousada-mar-azul",
        description: "Pousada aconchegante com vista para o mar",
        description_long: "Localizada na Praia do Sueste, oferece quartos confortáveis com vista panorâmica para o oceano",
        address: {
          street: "Estrada da Praia do Sueste, 100",
          city: "Fernando de Noronha",
          state: "PE",
          zipCode: "53990-000",
          neighborhood: "Praia do Sueste",
          coordinates: { latitude: -3.8536, longitude: -32.4297 },
        },
        phone: "+55 81 3619-5678",
        type: "pousada",
        checkInTime: "14:00",
        checkOutTime: "12:00",
        pricePerNight: 320.0,
        currency: "BRL",
        totalRooms: BigInt(12),
        maxGuests: BigInt(4),
        bedrooms: BigInt(2),
        bathrooms: BigInt(1),
        beds: { single: BigInt(0), double: BigInt(2), queen: BigInt(0), king: BigInt(0) },
        area: 45,
        amenities: ["wifi", "ar-condicionado", "cafe-da-manha", "vista-mar"],
        houseRules: ["Não permitido fumar", "Não permitido festas"],
        cancellationPolicy: "Cancelamento gratuito até 24h antes",
        petsAllowed: false,
        smokingAllowed: false,
        eventsAllowed: false,
        minimumStay: BigInt(2),
        mainImage: "/images/pousada-mar-azul.jpg",
        galleryImages: ["/images/pousada-mar-azul-1.jpg"],
        rating: {
          overall: 4.6,
          cleanliness: 4.7,
          location: 4.8,
          checkin: 4.5,
          value: 4.4,
          accuracy: 4.6,
          communication: 4.5,
          totalReviews: BigInt(89),
        },
        tags: ["vista-mar", "aconchegante", "cafe-da-manha"],
        isActive: true,
        isFeatured: true,
        partnerId: currentUser._id,
      });

      const checkInDate = new Date(nextMonth);
      const checkOutDate = new Date(nextMonth + 3 * 24 * 60 * 60 * 1000); // 3 days later

      await ctx.db.insert("accommodationBookings", {
        accommodationId,
        userId: travelerUser._id,
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0],
        guests: BigInt(2),
        totalPrice: 960.0, // 3 nights * 320
        status: "confirmed",
        confirmationCode: "HOTEL001",
        customerInfo: {
          name: travelerUser.name || "Usuário",
          email: travelerUser.email || args.travelerEmail,
          phone: travelerUser.phone || "+55 00 00000-0000",
        },
        createdAt: now,
        updatedAt: now,
      });
      reservationsCreated++;

      return {
        success: true,
        message: `${reservationsCreated} reservas de teste criadas com sucesso para ${args.travelerEmail}`,
        reservationsCreated,
      };

    } catch (error) {
      console.error("Erro ao criar dados de teste:", error);
      return {
        success: false,
        message: `Erro ao criar dados de teste: ${error}`,
        reservationsCreated,
      };
    }
  },
});

/**
 * Generic booking cancellation function for travelers
 * Determines the type of booking and calls the appropriate specific cancel function
 */
export const cancelBooking = mutation({
  args: {
    reservationId: v.string(),
    reservationType: v.union(
      v.literal("activity"),
      v.literal("event"),
      v.literal("restaurant"),
      v.literal("vehicle"),
      v.literal("accommodation")
    ),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Check if user is a traveler (only travelers can cancel their own bookings through this function)
    if (user.role !== "traveler") {
      throw new Error("Apenas viajantes podem cancelar suas próprias reservas através desta função");
    }

    try {
      // Call the appropriate specific cancel function based on reservation type
      switch (args.reservationType) {
        case "activity":
          await ctx.runMutation(internal.domains.bookings.mutations.cancelActivityBookingInternal, {
            bookingId: args.reservationId as Id<"activityBookings">,
            userId: user._id,
            reason: args.reason,
          });
          break;

        case "event":
          await ctx.runMutation(internal.domains.bookings.mutations.cancelEventBookingInternal, {
            bookingId: args.reservationId as Id<"eventBookings">,
            userId: user._id,
            reason: args.reason,
          });
          break;

        case "restaurant":
          await ctx.runMutation(internal.domains.bookings.mutations.cancelRestaurantReservationInternal, {
            reservationId: args.reservationId as Id<"restaurantReservations">,
            userId: user._id,
            reason: args.reason,
          });
          break;

        case "vehicle":
          await ctx.runMutation(internal.domains.bookings.mutations.cancelVehicleBookingInternal, {
            bookingId: args.reservationId as Id<"vehicleBookings">,
            userId: user._id,
            reason: args.reason,
          });
          break;

        case "accommodation":
          await ctx.runMutation(internal.domains.bookings.mutations.cancelAccommodationBookingInternal, {
            bookingId: args.reservationId as Id<"accommodationBookings">,
            userId: user._id,
            reason: args.reason,
          });
          break;

        default:
          throw new Error("Tipo de reserva não reconhecido");
      }
    } catch (error) {
      throw new Error(`Erro ao cancelar reserva: ${error}`);
    }

    return null;
  },
});

/**
 * Internal function to cancel activity booking with user permission validation
 */
export const cancelActivityBookingInternal = mutation({
  args: {
    bookingId: v.id("activityBookings"),
    userId: v.id("users"),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    // Verify that the user owns this booking
    if (booking.userId !== args.userId) {
      throw new Error("Você não tem permissão para cancelar esta reserva");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já foi cancelada");
    }

    const activity = await ctx.db.get(booking.activityId);
    if (!activity) {
      throw new Error("Atividade não encontrada");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CANCELED,
      updatedAt: Date.now(),
    });

    // Schedule cancellation notification
    await ctx.scheduler.runAfter(0, internal.domains.notifications.actions.sendBookingCancellationNotification, {
      userId: booking.userId,
      bookingId: booking._id,
      bookingType: "activity",
      assetName: activity.title,
      confirmationCode: booking.confirmationCode,
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      reason: args.reason,
    });

    // Send cancellation email to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingCancelledEmail, {
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      assetName: activity.title,
      bookingType: "activity",
      confirmationCode: booking.confirmationCode,
      reason: args.reason,
    });

    return null;
  },
});

/**
 * Internal function to cancel event booking with user permission validation
 */
export const cancelEventBookingInternal = mutation({
  args: {
    bookingId: v.id("eventBookings"),
    userId: v.id("users"),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    // Verify that the user owns this booking
    if (booking.userId !== args.userId) {
      throw new Error("Você não tem permissão para cancelar esta reserva");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já foi cancelada");
    }

    const event = await ctx.db.get(booking.eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CANCELED,
      updatedAt: Date.now(),
    });

    // Schedule cancellation notification
    await ctx.scheduler.runAfter(0, internal.domains.notifications.actions.sendBookingCancellationNotification, {
      userId: booking.userId,
      bookingId: booking._id,
      bookingType: "event",
      assetName: event.title,
      confirmationCode: booking.confirmationCode,
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      reason: args.reason,
    });

    // Send cancellation email to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingCancelledEmail, {
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      assetName: event.title,
      bookingType: "event",
      confirmationCode: booking.confirmationCode,
      reason: args.reason,
    });

    return null;
  },
});

/**
 * Internal function to cancel restaurant reservation with user permission validation
 */
export const cancelRestaurantReservationInternal = mutation({
  args: {
    reservationId: v.id("restaurantReservations"),
    userId: v.id("users"),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);
    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    // Verify that the user owns this reservation
    if (reservation.userId !== args.userId) {
      throw new Error("Você não tem permissão para cancelar esta reserva");
    }

    if (reservation.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já foi cancelada");
    }

    const restaurant = await ctx.db.get(reservation.restaurantId);
    if (!restaurant) {
      throw new Error("Restaurante não encontrado");
    }

    await ctx.db.patch(args.reservationId, {
      status: BOOKING_STATUS.CANCELED,
    });

    // Schedule cancellation notification
    await ctx.runMutation(internal.domains.notifications.mutations.createNotification, {
      userId: reservation.userId,
      type: "booking_canceled",
      title: "Reserva de Restaurante Cancelada ❌",
      message: `Sua reserva no "${restaurant.name}" foi cancelada.${args.reason ? ` Motivo: ${args.reason}` : ''}`,
      relatedId: reservation._id,
      relatedType: "restaurant_booking",
      data: {
        confirmationCode: reservation.confirmationCode,
        bookingType: "restaurant",
        assetName: restaurant.name,
      },
    });

    return null;
  },
});

/**
 * Internal function to cancel vehicle booking with user permission validation
 */
export const cancelVehicleBookingInternal = mutation({
  args: {
    bookingId: v.id("vehicleBookings"),
    userId: v.id("users"),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    // Verify that the user owns this booking
    if (booking.userId !== args.userId) {
      throw new Error("Você não tem permissão para cancelar esta reserva");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já foi cancelada");
    }

    const vehicle = await ctx.db.get(booking.vehicleId);
    if (!vehicle) {
      throw new Error("Veículo não encontrado");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CANCELED,
      updatedAt: Date.now(),
    });

    // Schedule cancellation notification
    await ctx.runMutation(internal.domains.notifications.mutations.createNotification, {
      userId: booking.userId,
      type: "booking_canceled",
      title: "Reserva de Veículo Cancelada ❌",
      message: `Sua reserva para "${vehicle.name}" foi cancelada.${args.reason ? ` Motivo: ${args.reason}` : ''}`,
      relatedId: booking._id,
      relatedType: "vehicle_booking",
      data: {
        bookingType: "vehicle",
        assetName: vehicle.name,
      },
    });

    return null;
  },
});

/**
 * Internal function to cancel accommodation booking with user permission validation
 */
export const cancelAccommodationBookingInternal = mutation({
  args: {
    bookingId: v.id("accommodationBookings"),
    userId: v.id("users"),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    // Verify that the user owns this booking
    if (booking.userId !== args.userId) {
      throw new Error("Você não tem permissão para cancelar esta reserva");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já foi cancelada");
    }

    const accommodation = await ctx.db.get(booking.accommodationId);
    if (!accommodation) {
      throw new Error("Hospedagem não encontrada");
    }

    await ctx.db.patch(args.bookingId, {
      status: BOOKING_STATUS.CANCELED,
      updatedAt: Date.now(),
    });

    // Schedule cancellation notification
    await ctx.scheduler.runAfter(0, internal.domains.notifications.actions.sendBookingCancellationNotification, {
      userId: booking.userId,
      bookingId: booking._id,
      bookingType: "accommodation",
      assetName: accommodation.name,
      confirmationCode: booking.confirmationCode,
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      reason: args.reason,
    });

    // Send cancellation email to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingCancelledEmail, {
      customerEmail: booking.customerInfo.email,
      customerName: booking.customerInfo.name,
      assetName: accommodation.name,
      bookingType: "accommodation",
      confirmationCode: booking.confirmationCode,
      reason: args.reason,
    });

    return null;
  },
});

/**
 * Update booking payment status after Stripe authorization
 */
export const updateBookingPaymentStatus = mutation({
  args: v.object({
    bookingId: v.string(),
    bookingType: v.string(),
    paymentIntentId: v.string(),
    paymentStatus: v.string(),
    paymentCaptured: v.optional(v.boolean()),
  }),
  returns: v.null(),
  handler: async (ctx, args) => {
    const updateData: any = {
      paymentIntentId: args.paymentIntentId,
      paymentStatus: args.paymentStatus,
      paymentCaptured: args.paymentCaptured || false,
      updatedAt: Date.now(),
    };

    // Update the appropriate booking table based on type
    switch (args.bookingType) {
      case "activity":
        await ctx.db.patch(args.bookingId as Id<"activityBookings">, updateData);
        break;
      case "event":
        await ctx.db.patch(args.bookingId as Id<"eventBookings">, updateData);
        break;
      case "vehicle":
        await ctx.db.patch(args.bookingId as Id<"vehicleBookings">, updateData);
        break;
      case "accommodation":
        await ctx.db.patch(args.bookingId as Id<"accommodationBookings">, updateData);
        break;
      case "restaurant":
        await ctx.db.patch(args.bookingId as Id<"restaurantReservations">, updateData);
        break;
      default:
        throw new Error(`Tipo de booking inválido: ${args.bookingType}`);
    }

    return null;
  },
});

/**
 * Capture payment and confirm booking (Partner confirms reservation)
 */
export const capturePaymentAndConfirmBooking = mutation({
  args: v.object({
    bookingId: v.string(),
    bookingType: v.string(),
    partnerId: v.id("users"),
    partnerNotes: v.optional(v.string()),
  }),
  returns: v.object({
    success: v.boolean(),
    paymentIntentId: v.optional(v.string()),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get current user and validate it's the partner
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db.get(args.partnerId);
    if (!user || user.clerkId !== identity.subject) {
      throw new Error("Não autorizado");
    }

    // Get the booking based on type
    let booking: any = null;
    switch (args.bookingType) {
      case "activity":
        booking = await ctx.db.get(args.bookingId as Id<"activityBookings">);
        break;
      case "event":
        booking = await ctx.db.get(args.bookingId as Id<"eventBookings">);
        break;
      case "vehicle":
        booking = await ctx.db.get(args.bookingId as Id<"vehicleBookings">);
        break;
      case "accommodation":
        booking = await ctx.db.get(args.bookingId as Id<"accommodationBookings">);
        break;
      case "restaurant":
        booking = await ctx.db.get(args.bookingId as Id<"restaurantReservations">);
        break;
      default:
        throw new Error(`Tipo de booking inválido: ${args.bookingType}`);
    }

    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new Error("Reserva não está pendente");
    }

    if (!booking.paymentIntentId) {
      throw new Error("PaymentIntent não encontrado");
    }

    // Schedule capture payment action
    await ctx.scheduler.runAfter(0, internal.domains.payments.actions.captureStripePayment, {
      paymentIntentId: booking.paymentIntentId,
      bookingId: args.bookingId,
      bookingType: args.bookingType,
    });

    // Update booking status
    const updateData: any = {
      status: BOOKING_STATUS.CONFIRMED,
      paymentCaptured: true,
      partnerNotes: args.partnerNotes,
      updatedAt: Date.now(),
    };

    switch (args.bookingType) {
      case "activity":
        await ctx.db.patch(args.bookingId as Id<"activityBookings">, updateData);
        break;
      case "event":
        await ctx.db.patch(args.bookingId as Id<"eventBookings">, updateData);
        break;
      case "vehicle":
        await ctx.db.patch(args.bookingId as Id<"vehicleBookings">, updateData);
        break;
      case "accommodation":
        await ctx.db.patch(args.bookingId as Id<"accommodationBookings">, updateData);
        break;
      case "restaurant":
        await ctx.db.patch(args.bookingId as Id<"restaurantReservations">, updateData);
        break;
    }

    return {
      success: true,
      paymentIntentId: booking.paymentIntentId,
      message: "Reserva confirmada e pagamento capturado",
    };
  },
});

/**
 * Cancel booking and refund payment (Partner cancels reservation)
 */
export const cancelBookingAndRefundPayment = mutation({
  args: v.object({
    bookingId: v.string(),
    bookingType: v.string(),
    partnerId: v.id("users"),
    cancellationReason: v.string(),
    partnerNotes: v.optional(v.string()),
  }),
  returns: v.object({
    success: v.boolean(),
    paymentIntentId: v.optional(v.string()),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get current user and validate it's the partner
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db.get(args.partnerId);
    if (!user || user.clerkId !== identity.subject) {
      throw new Error("Não autorizado");
    }

    // Get the booking based on type
    let booking: any = null;
    switch (args.bookingType) {
      case "activity":
        booking = await ctx.db.get(args.bookingId as Id<"activityBookings">);
        break;
      case "event":
        booking = await ctx.db.get(args.bookingId as Id<"eventBookings">);
        break;
      case "vehicle":
        booking = await ctx.db.get(args.bookingId as Id<"vehicleBookings">);
        break;
      case "accommodation":
        booking = await ctx.db.get(args.bookingId as Id<"accommodationBookings">);
        break;
      case "restaurant":
        booking = await ctx.db.get(args.bookingId as Id<"restaurantReservations">);
        break;
      default:
        throw new Error(`Tipo de booking inválido: ${args.bookingType}`);
    }

    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já está cancelada");
    }

    if (!booking.paymentIntentId) {
      throw new Error("PaymentIntent não encontrado");
    }

    // Schedule refund/cancel action based on payment status
    if (booking.paymentCaptured) {
      // Payment was captured, need to create refund
      await ctx.scheduler.runAfter(0, internal.domains.payments.actions.refundStripePayment, {
        paymentIntentId: booking.paymentIntentId,
        bookingId: args.bookingId,
        bookingType: args.bookingType,
        reason: args.cancellationReason,
      });
    } else {
      // Payment was only authorized, can cancel without fees
      await ctx.scheduler.runAfter(0, internal.domains.payments.actions.cancelStripePayment, {
        paymentIntentId: booking.paymentIntentId,
        bookingId: args.bookingId,
        bookingType: args.bookingType,
      });
    }

    // Update booking status
    const updateData: any = {
      status: BOOKING_STATUS.CANCELED,
      cancellationReason: args.cancellationReason,
      partnerNotes: args.partnerNotes,
      updatedAt: Date.now(),
    };

    switch (args.bookingType) {
      case "activity":
        await ctx.db.patch(args.bookingId as Id<"activityBookings">, updateData);
        break;
      case "event":
        await ctx.db.patch(args.bookingId as Id<"eventBookings">, updateData);
        break;
      case "vehicle":
        await ctx.db.patch(args.bookingId as Id<"vehicleBookings">, updateData);
        break;
      case "accommodation":
        await ctx.db.patch(args.bookingId as Id<"accommodationBookings">, updateData);
        break;
      case "restaurant":
        await ctx.db.patch(args.bookingId as Id<"restaurantReservations">, updateData);
        break;
    }

    return {
      success: true,
      paymentIntentId: booking.paymentIntentId,
      message: booking.paymentCaptured ? "Reserva cancelada e reembolso processado" : "Reserva cancelada e autorização cancelada",
    };
  },
});

/**
 * Update booking refund status
 */
export const updateBookingRefundStatus = mutation({
  args: v.object({
    bookingId: v.string(),
    bookingType: v.string(),
    refundId: v.string(),
    refundStatus: v.string(),
  }),
  returns: v.null(),
  handler: async (ctx, args) => {
    const updateData: any = {
      refundId: args.refundId,
      refundStatus: args.refundStatus,
      updatedAt: Date.now(),
    };

    // Update the appropriate booking table based on type
    switch (args.bookingType) {
      case "activity":
        await ctx.db.patch(args.bookingId as Id<"activityBookings">, updateData);
        break;
      case "event":
        await ctx.db.patch(args.bookingId as Id<"eventBookings">, updateData);
        break;
      case "vehicle":
        await ctx.db.patch(args.bookingId as Id<"vehicleBookings">, updateData);
        break;
      case "accommodation":
        await ctx.db.patch(args.bookingId as Id<"accommodationBookings">, updateData);
        break;
      case "restaurant":
        await ctx.db.patch(args.bookingId as Id<"restaurantReservations">, updateData);
        break;
      default:
        throw new Error(`Tipo de booking inválido: ${args.bookingType}`);
    }

    return null;
  },
});

/**
 * Create activity booking with payment (called by webhook)
 */
export const createActivityBookingWithPayment = mutation({
  args: v.object({
    activityId: v.id("activities"),
    userId: v.id("users"),
    ticketId: v.optional(v.id("activityTickets")),
    date: v.string(),
    time: v.string(),
    participants: v.number(),
    paymentIntentId: v.string(),
    paymentCaptured: v.boolean(),
    totalPrice: v.number(),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    specialRequests: v.optional(v.string()),
  }),
  returns: v.object({
    bookingId: v.id("activityBookings"),
    confirmationCode: v.string(),
  }),
  handler: async (ctx, args) => {
    const confirmationCode = generateConfirmationCode();

    // Create booking with payment info
    const bookingId = await ctx.db.insert("activityBookings", {
      activityId: args.activityId,
      userId: args.userId,
      ticketId: args.ticketId,
      date: args.date,
      time: args.time,
      participants: args.participants,
      totalPrice: args.totalPrice,
      status: BOOKING_STATUS.PENDING, // Partner ainda precisa confirmar
      paymentStatus: PAYMENT_STATUS.AUTHORIZED, // Pagamento autorizado, não capturado
      paymentIntentId: args.paymentIntentId,
      paymentCaptured: args.paymentCaptured,
      confirmationCode,
      customerInfo: args.customerInfo,
      specialRequests: args.specialRequests,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Get activity for email notifications
    const activity = await ctx.db.get(args.activityId);
    if (!activity) {
      throw new Error("Atividade não encontrada");
    }

    // Send confirmation email to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingConfirmationEmail, {
      customerEmail: args.customerInfo.email,
      customerName: args.customerInfo.name,
      assetName: activity.title,
      bookingType: "activity",
      confirmationCode,
      bookingDate: args.date,
      totalPrice: args.totalPrice,
      bookingDetails: {
        activityId: activity._id,
        participants: args.participants,
        date: args.date,
        time: args.time,
        specialRequests: args.specialRequests,
      },
    });

    // Send notification to partner
    const partner = await ctx.db.get(activity.partnerId);
    if (partner && partner.email) {
      await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendPartnerNewBookingEmail, {
        partnerEmail: partner.email,
        partnerName: partner.name || "Parceiro",
        customerName: args.customerInfo.name,
        customerEmail: args.customerInfo.email,
        customerPhone: args.customerInfo.phone,
        assetName: activity.title,
        bookingType: "activity",
        confirmationCode,
        bookingDate: args.date,
        totalPrice: args.totalPrice,
        bookingDetails: {
          activityId: activity._id,
          participants: args.participants,
          date: args.date,
          time: args.time,
          specialRequests: args.specialRequests,
        },
      });
    }

    return { bookingId, confirmationCode };
  },
});

/**
 * Create event booking with payment (called by webhook)
 */
export const createEventBookingWithPayment = mutation({
  args: v.object({
    eventId: v.id("events"),
    userId: v.id("users"),
    ticketId: v.optional(v.id("eventTickets")),
    quantity: v.number(),
    paymentIntentId: v.string(),
    paymentCaptured: v.boolean(),
    totalPrice: v.number(),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    specialRequests: v.optional(v.string()),
  }),
  returns: v.object({
    bookingId: v.id("eventBookings"),
    confirmationCode: v.string(),
  }),
  handler: async (ctx, args) => {
    const confirmationCode = generateConfirmationCode();

    const bookingId = await ctx.db.insert("eventBookings", {
      eventId: args.eventId,
      userId: args.userId,
      ticketId: args.ticketId,
      quantity: args.quantity,
      totalPrice: args.totalPrice,
      status: BOOKING_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.AUTHORIZED,
      paymentIntentId: args.paymentIntentId,
      paymentCaptured: args.paymentCaptured,
      confirmationCode,
      customerInfo: args.customerInfo,
      specialRequests: args.specialRequests,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    // Send confirmation emails (similar pattern)
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingConfirmationEmail, {
      customerEmail: args.customerInfo.email,
      customerName: args.customerInfo.name,
      assetName: event.title,
      bookingType: "event",
      confirmationCode,
      bookingDate: `${event.date} às ${event.time}`,
      totalPrice: args.totalPrice,
      bookingDetails: {
        eventId: event._id,
        quantity: args.quantity,
        ticketId: args.ticketId,
        location: event.location,
        specialRequests: args.specialRequests,
      },
    });

    return { bookingId, confirmationCode };
  },
});

/**
 * Partner confirms booking (captures payment)
 */
export const confirmBookingByPartner = mutation({
  args: v.object({
    bookingId: v.string(),
    bookingType: v.string(), // "activity" | "event" | "vehicle" | "accommodation" | "restaurant"
    partnerId: v.id("users"), // Partners são users com role específico
  }),
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get booking based on type
    let booking: any;
    switch (args.bookingType) {
      case "activity":
        booking = await ctx.db.get(args.bookingId as Id<"activityBookings">);
        break;
      case "event":
        booking = await ctx.db.get(args.bookingId as Id<"eventBookings">);
        break;
      case "vehicle":
        booking = await ctx.db.get(args.bookingId as Id<"vehicleBookings">);
        break;
      case "accommodation":
        booking = await ctx.db.get(args.bookingId as Id<"accommodationBookings">);
        break;
      case "restaurant":
        booking = await ctx.db.get(args.bookingId as Id<"restaurantReservations">);
        break;
      default:
        throw new Error("Tipo de booking inválido");
    }

    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new Error("Reserva não está pendente");
    }

    // Verify partner permission
    const asset = await getAssetFromBooking(ctx, booking, args.bookingType);
    if (!asset || (asset.partnerId && asset.partnerId !== args.partnerId)) {
      throw new Error("Você não tem permissão para confirmar esta reserva");
    }

    // Update booking status
    const updateData = {
      status: BOOKING_STATUS.CONFIRMED,
      paymentStatus: PAYMENT_STATUS.PAID, // Will be updated by the capture action
      updatedAt: Date.now(),
    };

    await updateBookingByType(ctx, args.bookingId, args.bookingType, updateData);

    // Capture payment if there's a paymentIntentId
    if (booking.paymentIntentId) {
      await ctx.scheduler.runAfter(0, internal.domains.payments.actions.captureStripePayment, {
        paymentIntentId: booking.paymentIntentId,
        bookingId: args.bookingId,
        bookingType: args.bookingType,
      });
    }

    // Send confirmation email to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingStatusUpdateEmail, {
      customerEmail: booking.customerInfo?.email || booking.email,
      customerName: booking.customerInfo?.name || booking.name,
      assetName: asset?.title || asset?.name || "Asset",
      bookingType: args.bookingType,
      confirmationCode: booking.confirmationCode,
      newStatus: "confirmed",
      message: "Sua reserva foi confirmada pelo parceiro! O pagamento foi processado com sucesso.",
    });

    return {
      success: true,
      message: "Reserva confirmada com sucesso!",
    };
  },
});

/**
 * Partner cancels booking (refunds payment)
 */
export const cancelBookingByPartner = mutation({
  args: v.object({
    bookingId: v.string(),
    bookingType: v.string(),
    partnerId: v.id("users"), // Partners são users com role específico
    cancellationReason: v.string(),
  }),
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get booking
    let booking: any;
    switch (args.bookingType) {
      case "activity":
        booking = await ctx.db.get(args.bookingId as Id<"activityBookings">);
        break;
      case "event":
        booking = await ctx.db.get(args.bookingId as Id<"eventBookings">);
        break;
      case "vehicle":
        booking = await ctx.db.get(args.bookingId as Id<"vehicleBookings">);
        break;
      case "accommodation":
        booking = await ctx.db.get(args.bookingId as Id<"accommodationBookings">);
        break;
      case "restaurant":
        booking = await ctx.db.get(args.bookingId as Id<"restaurantReservations">);
        break;
      default:
        throw new Error("Tipo de booking inválido");
    }

    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      throw new Error("Reserva já está cancelada");
    }

    // Verify partner permission
    const asset = await getAssetFromBooking(ctx, booking, args.bookingType);
    if (!asset || (asset.partnerId && asset.partnerId !== args.partnerId)) {
      throw new Error("Você não tem permissão para cancelar esta reserva");
    }

    // Update booking status
    const updateData = {
      status: BOOKING_STATUS.CANCELED,
      cancellationReason: args.cancellationReason,
      updatedAt: Date.now(),
    };

    await updateBookingByType(ctx, args.bookingId, args.bookingType, updateData);

    // Process refund if there's a payment
    if (booking.paymentIntentId) {
      if (booking.paymentCaptured) {
        // Payment was already captured, need to refund
        await ctx.scheduler.runAfter(0, internal.domains.payments.actions.refundStripePayment, {
          paymentIntentId: booking.paymentIntentId,
          bookingId: args.bookingId,
          bookingType: args.bookingType,
          reason: args.cancellationReason,
        });
      } else {
        // Payment was only authorized, just cancel it
        await ctx.scheduler.runAfter(0, internal.domains.payments.actions.cancelStripePayment, {
          paymentIntentId: booking.paymentIntentId,
          bookingId: args.bookingId,
          bookingType: args.bookingType,
        });
      }
    }

    // Send cancellation email to customer
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingStatusUpdateEmail, {
      customerEmail: booking.customerInfo?.email || booking.email,
      customerName: booking.customerInfo?.name || booking.name,
      assetName: asset?.title || asset?.name || "Asset",
      bookingType: args.bookingType,
      confirmationCode: booking.confirmationCode,
      newStatus: "cancelled",
      message: `Sua reserva foi cancelada pelo parceiro. Motivo: ${args.cancellationReason}. O reembolso será processado automaticamente.`,
    });

    return {
      success: true,
      message: "Reserva cancelada com sucesso!",
    };
  },
});

// Helper functions
async function getAssetFromBooking(ctx: MutationCtx, booking: any, bookingType: string): Promise<any> {
  let asset: any = null;
  
  switch (bookingType) {
    case "activity":
      asset = await ctx.db.get(booking.activityId);
      break;
    case "event":
      asset = await ctx.db.get(booking.eventId);
      break;
    case "vehicle":
      asset = await ctx.db.get(booking.vehicleId);
      break;
    case "accommodation":
      asset = await ctx.db.get(booking.accommodationId);
      break;
    case "restaurant":
      asset = await ctx.db.get(booking.restaurantId);
      break;
    default:
      return null;
  }
  
  return asset;
}

async function updateBookingByType(ctx: MutationCtx, bookingId: string, bookingType: string, updateData: any) {
  switch (bookingType) {
    case "activity":
      await ctx.db.patch(bookingId as Id<"activityBookings">, updateData);
      break;
    case "event":
      await ctx.db.patch(bookingId as Id<"eventBookings">, updateData);
      break;
    case "vehicle":
      await ctx.db.patch(bookingId as Id<"vehicleBookings">, updateData);
      break;
    case "accommodation":
      await ctx.db.patch(bookingId as Id<"accommodationBookings">, updateData);
      break;
    case "restaurant":
      await ctx.db.patch(bookingId as Id<"restaurantReservations">, updateData);
      break;
  }
}

// ============================================================
// PAYMENT LINK BOOKING MUTATIONS
// ============================================================

/**
 * Create activity booking from payment link
 * Called after successful payment via Stripe Payment Link
 */
export const createActivityBookingFromPaymentLink = mutation({
  args: v.object({
    activityId: v.string(),
    sessionId: v.string(),
    status: v.string(),
    paymentStatus: v.string(),
    paymentMethod: v.string(),
    totalPrice: v.number(),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    confirmationCode: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  returns: v.object({
    bookingId: v.id("activityBookings"),
    confirmationCode: v.string(),
  }),
  handler: async (ctx, args) => {
    const activity = await ctx.db.get(args.activityId as Id<"activities">);
    if (!activity) {
      throw new Error("Atividade não encontrada");
    }

    // Create a generic user for payment link reservations if needed
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.customerInfo.email))
      .first();

    let userId: Id<"users">;
    if (existingUser) {
      userId = existingUser._id;
    } else {
      // Create a temporary user account for the reservation
      userId = await ctx.db.insert("users", {
        name: args.customerInfo.name,
        email: args.customerInfo.email,
        phone: args.customerInfo.phone,
        role: "traveler",
        isActive: true,
        onboardingCompleted: false,
      });
    }

    // Create the booking
    const bookingId = await ctx.db.insert("activityBookings", {
      activityId: args.activityId as Id<"activities">,
      userId,
      date: new Date().toISOString().split('T')[0], // Today as default, should be customizable
      participants: 1, // Default to 1, should be customizable
      totalPrice: args.totalPrice,
      status: args.status,
      paymentStatus: args.paymentStatus,
      paymentMethod: args.paymentMethod,
      confirmationCode: args.confirmationCode,
      customerInfo: args.customerInfo,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
      // Store session ID for reference
      paymentIntentId: args.sessionId,
      paymentCaptured: true,
    });

    // Send confirmation emails
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingConfirmationEmail, {
      customerEmail: args.customerInfo.email,
      customerName: args.customerInfo.name,
      assetName: activity.title,
      bookingType: "activity",
      confirmationCode: args.confirmationCode,
      bookingDate: new Date().toISOString().split('T')[0],
      totalPrice: args.totalPrice,
    });

    return {
      bookingId,
      confirmationCode: args.confirmationCode,
    };
  },
});

/**
 * Create event booking from payment link
 */
export const createEventBookingFromPaymentLink = mutation({
  args: v.object({
    eventId: v.string(),
    sessionId: v.string(),
    status: v.string(),
    paymentStatus: v.string(),
    paymentMethod: v.string(),
    totalPrice: v.number(),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    confirmationCode: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  returns: v.object({
    bookingId: v.id("eventBookings"),
    confirmationCode: v.string(),
  }),
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId as Id<"events">);
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    // Find or create user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.customerInfo.email))
      .first();

    let userId: Id<"users">;
    if (existingUser) {
      userId = existingUser._id;
    } else {
      userId = await ctx.db.insert("users", {
        name: args.customerInfo.name,
        email: args.customerInfo.email,
        phone: args.customerInfo.phone,
        role: "traveler",
        isActive: true,
        onboardingCompleted: false,
      });
    }

    // Create the booking
    const bookingId = await ctx.db.insert("eventBookings", {
      eventId: args.eventId as Id<"events">,
      userId,
      quantity: 1, // Default to 1, should be customizable
      totalPrice: args.totalPrice,
      status: args.status,
      paymentStatus: args.paymentStatus,
      paymentMethod: args.paymentMethod,
      confirmationCode: args.confirmationCode,
      customerInfo: args.customerInfo,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
      paymentIntentId: args.sessionId,
      paymentCaptured: true,
    });

    // Send confirmation emails
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingConfirmationEmail, {
      customerEmail: args.customerInfo.email,
      customerName: args.customerInfo.name,
      assetName: event.title,
      bookingType: "event",
      confirmationCode: args.confirmationCode,
      bookingDate: `${event.date} às ${event.time}`,
      totalPrice: args.totalPrice,
    });

    return {
      bookingId,
      confirmationCode: args.confirmationCode,
    };
  },
});

/**
 * Create restaurant reservation from payment link
 */
export const createRestaurantReservationFromPaymentLink = mutation({
  args: v.object({
    restaurantId: v.string(),
    sessionId: v.string(),
    status: v.string(),
    paymentStatus: v.string(),
    paymentMethod: v.string(),
    totalPrice: v.number(),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    confirmationCode: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  returns: v.object({
    reservationId: v.id("restaurantReservations"),
    confirmationCode: v.string(),
  }),
  handler: async (ctx, args) => {
    const restaurant = await ctx.db.get(args.restaurantId as Id<"restaurants">);
    if (!restaurant) {
      throw new Error("Restaurante não encontrado");
    }

    // Find or create user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.customerInfo.email))
      .first();

    let userId: Id<"users">;
    if (existingUser) {
      userId = existingUser._id;
    } else {
      userId = await ctx.db.insert("users", {
        name: args.customerInfo.name,
        email: args.customerInfo.email,
        phone: args.customerInfo.phone,
        role: "traveler",
        isActive: true,
        onboardingCompleted: false,
      });
    }

    // Create the reservation
    const reservationId = await ctx.db.insert("restaurantReservations", {
      restaurantId: args.restaurantId as Id<"restaurants">,
      userId,
      date: new Date().toISOString().split('T')[0], // Today as default
      time: "19:00", // Default time, should be customizable
      partySize: 2, // Default party size, should be customizable
      name: args.customerInfo.name,
      email: args.customerInfo.email,
      phone: args.customerInfo.phone,
      status: args.status,
      confirmationCode: args.confirmationCode,
      paymentIntentId: args.sessionId,
      paymentCaptured: true,
      totalPrice: args.totalPrice,
      paymentStatus: args.paymentStatus,
      paymentMethod: args.paymentMethod,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });

    // Send confirmation emails
    await ctx.scheduler.runAfter(0, internal.domains.email.actions.sendBookingConfirmationEmail, {
      customerEmail: args.customerInfo.email,
      customerName: args.customerInfo.name,
      assetName: restaurant.name,
      bookingType: "restaurant",
      confirmationCode: args.confirmationCode,
      bookingDate: new Date().toISOString().split('T')[0],
      totalPrice: args.totalPrice,
    });

    return {
      reservationId,
      confirmationCode: args.confirmationCode,
    };
  },
});