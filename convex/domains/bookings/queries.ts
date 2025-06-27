import { v } from "convex/values";
import { query } from "../../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "../../_generated/dataModel";
import { mutation } from "../../_generated/server";

/**
 * Get user's activity bookings
 */
export const getUserActivityBookings = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
  },
  returns: v.object({
    page: v.array(v.object({
      _id: v.id("activityBookings"),
      _creationTime: v.number(),
      activityId: v.id("activities"),
      activityTitle: v.string(),
      activityImageUrl: v.string(),
      date: v.string(),
      time: v.optional(v.string()),
      participants: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      paymentStatus: v.optional(v.string()),
      confirmationCode: v.string(),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
      specialRequests: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      userId: v.id("users"),
    })),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
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

    let query = ctx.db
      .query("activityBookings")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    if (args.status && typeof args.status === "string") {
      query = ctx.db
        .query("activityBookings")
        .withIndex("by_status", (q) => q.eq("status", args.status as string))
        .filter((q) => q.eq(q.field("userId"), user._id));
    }

    const result = await query.paginate(args.paginationOpts);

    const bookingsWithDetails = await Promise.all(
      result.page.map(async (booking) => {
        const activity = await ctx.db.get(booking.activityId);
        return {
          ...booking,
          activityTitle: activity?.title || "Atividade não encontrada",
          activityImageUrl: activity?.imageUrl || "",
        };
      })
    );

    return {
      page: bookingsWithDetails,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

/**
 * Get user's event bookings
 */
export const getUserEventBookings = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
  },
  returns: v.object({
    page: v.array(v.object({
      _id: v.id("eventBookings"),
      _creationTime: v.number(),
      eventId: v.id("events"),
      eventTitle: v.string(),
      eventImageUrl: v.string(),
      eventDate: v.string(),
      eventTime: v.string(),
      eventLocation: v.string(),
      quantity: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      paymentStatus: v.optional(v.string()),
      confirmationCode: v.string(),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
      specialRequests: v.optional(v.string()),
    })),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
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

    let query = ctx.db
      .query("eventBookings")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    if (args.status && typeof args.status === "string") {
      query = ctx.db
        .query("eventBookings")
        .withIndex("by_status", (q) => q.eq("status", args.status as string))
        .filter((q) => q.eq(q.field("userId"), user._id));
    }

    const result = await query.paginate(args.paginationOpts);

    const bookingsWithDetails = await Promise.all(
      result.page.map(async (booking) => {
        const event = await ctx.db.get(booking.eventId);
        return {
          ...booking,
          eventTitle: event?.title || "Evento não encontrado",
          eventImageUrl: event?.imageUrl || "",
          eventDate: event?.date || "",
          eventTime: event?.time || "",
          eventLocation: event?.location || "",
        };
      })
    );

    return {
      page: bookingsWithDetails,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

/**
 * Get user's restaurant reservations
 */
export const getUserRestaurantReservations = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
  },
  returns: v.object({
    page: v.array(v.object({
      _id: v.id("restaurantReservations"),
      _creationTime: v.number(),
      restaurantId: v.id("restaurants"),
      restaurantName: v.string(),
      restaurantImageUrl: v.string(),
      restaurantAddress: v.string(),
      date: v.string(),
      time: v.string(),
      partySize: v.number(),
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      status: v.string(),
      confirmationCode: v.string(),
      specialRequests: v.optional(v.string()),
    })),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
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

    let query = ctx.db
      .query("restaurantReservations")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    if (args.status && typeof args.status === "string") {
      query = ctx.db
        .query("restaurantReservations")
        .withIndex("by_status", (q) => q.eq("status", args.status as string))
        .filter((q) => q.eq(q.field("userId"), user._id));
    }

    const result = await query.paginate(args.paginationOpts);

    const reservationsWithDetails = await Promise.all(
      result.page.map(async (reservation) => {
        const restaurant = await ctx.db.get(reservation.restaurantId);
        return {
          ...reservation,
          restaurantName: restaurant?.name || "Restaurante não encontrado",
          restaurantImageUrl: restaurant?.mainImage || "",
          restaurantAddress: restaurant?.address ? 
            `${restaurant.address.street}, ${restaurant.address.neighborhood}` : "",
        };
      })
    );

    return {
      page: reservationsWithDetails,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

/**
 * Get user's vehicle bookings
 */
export const getUserVehicleBookings = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
  },
  returns: v.object({
    page: v.array(v.object({
      _id: v.id("vehicleBookings"),
      _creationTime: v.number(),
      vehicleId: v.id("vehicles"),
      vehicleName: v.string(),
      vehicleBrand: v.string(),
      vehicleModel: v.string(),
      vehicleImageUrl: v.optional(v.string()),
      startDate: v.number(),
      endDate: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      paymentStatus: v.optional(v.string()),
      pickupLocation: v.optional(v.string()),
      returnLocation: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
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

    let query = ctx.db
      .query("vehicleBookings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id));

    if (args.status && typeof args.status === "string") {
      query = ctx.db
        .query("vehicleBookings")
        .withIndex("by_status", (q) => q.eq("status", args.status as string))
        .filter((q) => q.eq(q.field("userId"), user._id));
    }

    const result = await query.paginate(args.paginationOpts);

    const bookingsWithDetails = await Promise.all(
      result.page.map(async (booking) => {
        const vehicle = await ctx.db.get(booking.vehicleId);
        return {
          ...booking,
          vehicleName: vehicle?.name || "Veículo não encontrado",
          vehicleBrand: vehicle?.brand || "",
          vehicleModel: vehicle?.model || "",
          vehicleImageUrl: vehicle?.imageUrl || undefined,
        };
      })
    );

    return {
      page: bookingsWithDetails,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

/**
 * Get booking by confirmation code
 */
export const getBookingByConfirmationCode = query({
  args: { 
    confirmationCode: v.string(),
    type: v.union(v.literal("activity"), v.literal("event"), v.literal("restaurant")),
  },
  returns: v.union(
    v.object({
      type: v.literal("activity"),
      booking: v.object({
        _id: v.id("activityBookings"),
        _creationTime: v.number(),
        activityTitle: v.string(),
        date: v.string(),
        time: v.optional(v.string()),
        participants: v.number(),
        totalPrice: v.number(),
        status: v.string(),
        confirmationCode: v.string(),
        customerInfo: v.object({
          name: v.string(),
          email: v.string(),
          phone: v.string(),
        }),
      }),
    }),
    v.object({
      type: v.literal("event"),
      booking: v.object({
        _id: v.id("eventBookings"),
        _creationTime: v.number(),
        eventTitle: v.string(),
        eventDate: v.string(),
        eventTime: v.string(),
        quantity: v.number(),
        totalPrice: v.number(),
        status: v.string(),
        confirmationCode: v.string(),
        customerInfo: v.object({
          name: v.string(),
          email: v.string(),
          phone: v.string(),
        }),
      }),
    }),
    v.object({
      type: v.literal("restaurant"),
      booking: v.object({
        _id: v.id("restaurantReservations"),
        _creationTime: v.number(),
        restaurantName: v.string(),
        date: v.string(),
        time: v.string(),
        partySize: v.number(),
        status: v.string(),
        confirmationCode: v.string(),
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    if (args.type === "activity") {
      const booking = await ctx.db
        .query("activityBookings")
        .withIndex("by_confirmation_code", (q) => q.eq("confirmationCode", args.confirmationCode))
        .unique();

      if (!booking) return null;

      const activity = await ctx.db.get(booking.activityId);
      
      return {
        type: "activity" as const,
        booking: {
          _id: booking._id,
          _creationTime: booking._creationTime,
          activityTitle: activity?.title || "Atividade não encontrada",
          date: booking.date,
          time: booking.time,
          participants: booking.participants,
          totalPrice: booking.totalPrice,
          status: booking.status,
          confirmationCode: booking.confirmationCode,
          customerInfo: booking.customerInfo,
        },
      };
    }

    if (args.type === "event") {
      const booking = await ctx.db
        .query("eventBookings")
        .withIndex("by_confirmation_code", (q) => q.eq("confirmationCode", args.confirmationCode))
        .unique();

      if (!booking) return null;

      const event = await ctx.db.get(booking.eventId);
      
      return {
        type: "event" as const,
        booking: {
          _id: booking._id,
          _creationTime: booking._creationTime,
          eventTitle: event?.title || "Evento não encontrado",
          eventDate: event?.date || "",
          eventTime: event?.time || "",
          quantity: booking.quantity,
          totalPrice: booking.totalPrice,
          status: booking.status,
          confirmationCode: booking.confirmationCode,
          customerInfo: booking.customerInfo,
        },
      };
    }

    if (args.type === "restaurant") {
      const reservation = await ctx.db
        .query("restaurantReservations")
        .filter((q) => q.eq(q.field("confirmationCode"), args.confirmationCode))
        .unique();

      if (!reservation) return null;

      const restaurant = await ctx.db.get(reservation.restaurantId);
      
      return {
        type: "restaurant" as const,
        booking: {
          _id: reservation._id,
          _creationTime: reservation._creationTime,
          restaurantName: restaurant?.name || "Restaurante não encontrado",
          date: reservation.date,
          time: reservation.time,
          partySize: reservation.partySize,
          status: reservation.status,
          confirmationCode: reservation.confirmationCode,
          name: reservation.name,
          email: reservation.email,
          phone: reservation.phone,
        },
      };
    }

    return null;
  },
});

/**
 * Get partner's bookings for their assets
 */
export const getPartnerBookings = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    assetType: v.optional(v.union(v.literal("activities"), v.literal("events"), v.literal("restaurants"), v.literal("vehicles"))),
    status: v.optional(v.string()),
  },
  returns: v.object({
    activities: v.array(v.object({
      _id: v.id("activityBookings"),
      activityTitle: v.string(),
      date: v.string(),
      participants: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
    })),
    events: v.array(v.object({
      _id: v.id("eventBookings"),
      eventTitle: v.string(),
      eventDate: v.string(),
      quantity: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
    })),
    restaurants: v.array(v.object({
      _id: v.id("restaurantReservations"),
      restaurantName: v.string(),
      date: v.string(),
      time: v.string(),
      partySize: v.number(),
      status: v.string(),
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    })),
    vehicles: v.array(v.object({
      _id: v.id("vehicleBookings"),
      vehicleName: v.string(),
      vehicleBrand: v.string(),
      vehicleModel: v.string(),
      startDate: v.number(),
      endDate: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      pickupLocation: v.optional(v.string()),
      returnLocation: v.optional(v.string()),
      notes: v.optional(v.string()),
      partnerNotes: v.optional(v.string()),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
      userId: v.id("users"),
    })),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || (user.role !== "partner" && user.role !== "employee" && user.role !== "master")) {
      throw new Error("Acesso negado - apenas partners, employees e masters");
    }

    const result = {
      activities: [] as Array<{
        _id: any;
        activityTitle: string;
        date: string;
        participants: number;
        totalPrice: number;
        status: string;
        customerInfo: any;
      }>,
      events: [] as Array<{
        _id: any;
        eventTitle: string;
        eventDate: string;
        quantity: number;
        totalPrice: number;
        status: string;
        customerInfo: any;
      }>,
      restaurants: [] as Array<{
        _id: any;
        restaurantName: string;
        date: string;
        time: string;
        partySize: number;
        status: string;
        name: string;
        email: string;
        phone: string;
      }>,
      vehicles: [] as Array<{
        _id: any;
        vehicleName: string;
        vehicleBrand: string;
        vehicleModel: string;
        startDate: number;
        endDate: number;
        totalPrice: number;
        status: string;
        pickupLocation?: string;
        returnLocation?: string;
        notes?: string;
        partnerNotes?: string;
        customerInfo: any;
        userId: any;
      }>,
    };

    // Get partner's activities bookings
    if (!args.assetType || args.assetType === "activities") {
      const activities = await ctx.db
        .query("activities")
        .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
        .collect();

      for (const activity of activities) {
        let query = ctx.db
          .query("activityBookings")
          .withIndex("by_activity", (q) => q.eq("activityId", activity._id));

        if (args.status) {
          query = query.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await query.collect();
        
        result.activities.push(...bookings.map(booking => ({
          _id: booking._id,
          activityTitle: activity.title,
          date: booking.date,
          participants: booking.participants,
          totalPrice: booking.totalPrice,
          status: booking.status,
          customerInfo: booking.customerInfo,
        })));
      }
    }

    // Get partner's events bookings
    if (!args.assetType || args.assetType === "events") {
      const events = await ctx.db
        .query("events")
        .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
        .collect();

      for (const event of events) {
        let query = ctx.db
          .query("eventBookings")
          .withIndex("by_event", (q) => q.eq("eventId", event._id));

        if (args.status) {
          query = query.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await query.collect();
        
        result.events.push(...bookings.map(booking => ({
          _id: booking._id,
          eventTitle: event.title,
          eventDate: event.date,
          quantity: booking.quantity,
          totalPrice: booking.totalPrice,
          status: booking.status,
          customerInfo: booking.customerInfo,
        })));
      }
    }

    // Get partner's restaurants reservations
    if (!args.assetType || args.assetType === "restaurants") {
      const restaurants = await ctx.db
        .query("restaurants")
        .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
        .collect();

      for (const restaurant of restaurants) {
        let query = ctx.db
          .query("restaurantReservations")
          .withIndex("by_restaurant", (q) => q.eq("restaurantId", restaurant._id));

        if (args.status) {
          query = query.filter((q) => q.eq(q.field("status"), args.status));
        }

        const reservations = await query.collect();
        
        result.restaurants.push(...reservations.map(reservation => ({
          _id: reservation._id,
          restaurantName: restaurant.name,
          date: reservation.date,
          time: reservation.time,
          partySize: reservation.partySize,
          status: reservation.status,
          name: reservation.name,
          email: reservation.email,
          phone: reservation.phone,
        })));
      }
    }

    // Get partner's vehicles reservations
    if (!args.assetType || args.assetType === "vehicles") {
      let vehicles;
      
      if (user.role === "master") {
        // Masters see ALL vehicles in the system
        vehicles = await ctx.db.query("vehicles").collect();
      } else if (user.role === "partner") {
        // Partners see only their own vehicles
        vehicles = await ctx.db
          .query("vehicles")
          .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
          .collect();
      } else if (user.role === "employee") {
        // Employees see vehicles they have permission to manage
        let accessibleVehicleIds: string[] = [];
        
        // 1. Check direct vehicle permissions
        const assetPermissions = await ctx.db
          .query("assetPermissions")
          .withIndex("by_employee_asset_type", (q) => q.eq("employeeId", user._id).eq("assetType", "vehicles"))
          .collect();
        
        const directVehicleIds = assetPermissions.map(p => p.assetId);
        accessibleVehicleIds.push(...directVehicleIds);
        
        // 2. Check organization permissions and get vehicles from those organizations
        const organizationPermissions = await ctx.db
          .query("organizationPermissions")
          .withIndex("by_employee", (q) => q.eq("employeeId", user._id))
          .collect();
        
                 for (const orgPermission of organizationPermissions) {
           // Check if employee has any meaningful permission for the organization
           const hasAnyPermission = orgPermission.permissions && orgPermission.permissions.length > 0;
           const hasSpecificPermission = orgPermission.permissions.some(p => 
             ["view", "edit", "manage", "full_access"].includes(p)
           );
           
           if (hasAnyPermission && hasSpecificPermission) {
             // Get all vehicles from this organization
             const organizationVehicles = await ctx.db
               .query("partnerAssets")
               .withIndex("by_organization_type", (q) => 
                 q.eq("organizationId", orgPermission.organizationId).eq("assetType", "vehicles")
               )
               .collect();
             
             const orgVehicleIds = organizationVehicles.map(asset => asset.assetId);
             accessibleVehicleIds.push(...orgVehicleIds);
           }
         }
        
        // Remove duplicates
        accessibleVehicleIds = [...new Set(accessibleVehicleIds)];
        
        vehicles = [];
        for (const vehicleId of accessibleVehicleIds) {
          const vehicle = await ctx.db.get(vehicleId as any);
          if (vehicle) {
            vehicles.push(vehicle);
          }
        }
      } else {
        vehicles = [];
      }

      for (const vehicle of vehicles) {
        let query = ctx.db
          .query("vehicleBookings")
          .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicle._id));

        if (args.status) {
          query = query.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await query.collect();
        
        for (const booking of bookings) {
          // Get user information for customerInfo
          const user = await ctx.db.get(booking.userId);
          
          result.vehicles.push({
            _id: booking._id,
            vehicleName: vehicle.name,
            vehicleBrand: vehicle.brand,
            vehicleModel: vehicle.model,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalPrice,
            status: booking.status,
            pickupLocation: booking.pickupLocation,
            returnLocation: booking.returnLocation,
            notes: booking.notes,
            partnerNotes: booking.partnerNotes,
            customerInfo: {
              name: user?.name || "Nome não disponível",
              email: user?.email || "Email não disponível",
              phone: user?.phone || "Telefone não disponível",
            },
            userId: booking.userId,
          });
        }
      }
    }

    return result;
  },
});

/**
 * Get all activity bookings (admin only)
 */
export const getActivityBookings = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
    organizationId: v.optional(v.id("partnerOrganizations")),
    activityId: v.optional(v.id("activities")),
  },
  returns: v.object({
    page: v.array(v.object({
      _id: v.id("activityBookings"),
      _creationTime: v.number(),
      activityId: v.id("activities"),
      activityTitle: v.string(),
      date: v.string(),
      time: v.optional(v.string()),
      participants: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      paymentStatus: v.optional(v.string()),
      confirmationCode: v.string(),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
      specialRequests: v.optional(v.string()),
      partnerNotes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      userId: v.id("users"),
    })),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || (user.role !== "admin" && user.role !== "partner" && user.role !== "master" && user.role !== "employee")) {
      throw new Error("Acesso negado - apenas admins, masters, partners e employees");
    }

    // For partners, only show bookings for their activities
    if (user.role === "partner") {
      // If specific activity is requested, check ownership first
      if (args.activityId) {
        const activity = await ctx.db.get(args.activityId);
        if (!activity || activity.partnerId.toString() !== user._id.toString()) {
          throw new Error("Você não tem permissão para ver as reservas desta atividade");
        }

        let activityQuery = ctx.db
          .query("activityBookings")
          .withIndex("by_activity", (q) => q.eq("activityId", args.activityId!));

        if (args.status && typeof args.status === "string") {
          activityQuery = activityQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await activityQuery.collect();
        const bookingsWithDetails = await Promise.all(
          bookings.map(async (booking) => {
            return {
              ...booking,
              activityTitle: activity.title,
            };
          })
        );

        return {
          page: bookingsWithDetails,
          isDone: true,
          continueCursor: "",
        };
      }

      // Get partner's activities, filtered by organization if specified
      let partnerActivities;
      
      if (args.organizationId) {
        // Busca assets da organização específica
        const organizationAssets = await ctx.db
          .query("partnerAssets")
          .withIndex("by_organization_type", (q) => 
            q.eq("organizationId", args.organizationId!).eq("assetType", "activities")
          )
          .collect();
        
        const assetIds = organizationAssets.map(asset => asset.assetId);
        
        // Filtra atividades que pertencem à organização
        const allPartnerActivities = await ctx.db
          .query("activities")
          .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
          .collect();
        
        partnerActivities = allPartnerActivities.filter(activity => 
          assetIds.includes(activity._id)
        );
        
        // Se não encontrar atividades na organização, mas a organização existe,
        // mostra todas as atividades do partner (fallback)
        if (partnerActivities.length === 0) {
          const organization = await ctx.db.get(args.organizationId);
          if (organization && organization.partnerId.toString() === user._id.toString()) {
            partnerActivities = await ctx.db
              .query("activities")
              .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
              .collect();
          }
        }
      } else {
        // Sem filtro de organização, busca todas as atividades do partner
        partnerActivities = await ctx.db
          .query("activities")
          .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
          .collect();
      }
      const activityIds = partnerActivities.map(a => a._id);

      let filteredBookings: any[] = [];
      for (const activityId of activityIds) {
        let activityQuery = ctx.db
          .query("activityBookings")
          .withIndex("by_activity", (q) => q.eq("activityId", activityId));

        if (args.status && typeof args.status === "string") {
          activityQuery = activityQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await activityQuery.collect();
        filteredBookings.push(...bookings);
      }

      // Sort by creation time
      filteredBookings.sort((a, b) => b._creationTime - a._creationTime);

      const bookingsWithDetails = await Promise.all(
        filteredBookings.map(async (booking) => {
          const activity = await ctx.db.get(booking.activityId) as any;
          return {
            ...booking,
            activityTitle: activity?.title || "Atividade não encontrada",
          };
        })
      );

      return {
        page: bookingsWithDetails,
        isDone: true,
        continueCursor: "",
      };
    }

    // Admin and master see all bookings, filtered by organization if specified
    if (args.organizationId) {
      // Busca assets da organização específica
      const organizationAssets = await ctx.db
        .query("partnerAssets")
        .withIndex("by_organization_type", (q) => 
          q.eq("organizationId", args.organizationId!).eq("assetType", "activities")
        )
        .collect();
      
      const assetIds = organizationAssets.map(asset => asset.assetId);
      
      if (assetIds.length === 0) {
        return {
          page: [],
          isDone: true,
          continueCursor: "",
        };
      }
      
      let filteredBookings: any[] = [];
      for (const activityId of assetIds) {
        let activityQuery = ctx.db
          .query("activityBookings")
          .withIndex("by_activity", (q) => q.eq("activityId", activityId as any));

        if (args.status && typeof args.status === "string") {
          activityQuery = activityQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await activityQuery.collect();
        filteredBookings.push(...bookings);
      }
      
      // Sort by creation time
      filteredBookings.sort((a, b) => b._creationTime - a._creationTime);

      const bookingsWithDetails = await Promise.all(
        filteredBookings.map(async (booking) => {
          const activity = await ctx.db.get(booking.activityId) as any;
          return {
            ...booking,
            activityTitle: activity?.title || "Atividade não encontrada",
          };
        })
      );

      return {
        page: bookingsWithDetails,
        isDone: true,
        continueCursor: "",
      };
    } else {
      // Sem filtro de organização, busca todas as reservas
      let query = ctx.db.query("activityBookings").order("desc");

      if (args.status && typeof args.status === "string") {
        query = ctx.db
          .query("activityBookings")
          .withIndex("by_status", (q) => q.eq("status", args.status as string))
          .order("desc");
      }

      const result = await query.paginate(args.paginationOpts);

      const bookingsWithDetails = await Promise.all(
        result.page.map(async (booking) => {
          const activity = await ctx.db.get(booking.activityId) as any;
          return {
            ...booking,
            activityTitle: activity?.title || "Atividade não encontrada",
          };
        })
      );
      
      return {
        page: bookingsWithDetails,
        isDone: result.isDone,
        continueCursor: result.continueCursor,
      };
    }
  },
});

/**
 * Get all event bookings (admin only)
 */
export const getEventBookings = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
    organizationId: v.optional(v.id("partnerOrganizations")),
    eventId: v.optional(v.id("events")),
  },
  returns: v.object({
    page: v.array(v.object({
      _id: v.id("eventBookings"),
      _creationTime: v.number(),
      eventId: v.id("events"),
      eventTitle: v.string(),
      quantity: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      paymentStatus: v.optional(v.string()),
      confirmationCode: v.string(),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
      specialRequests: v.optional(v.string()),
      partnerNotes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      userId: v.id("users"),
    })),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || (user.role !== "admin" && user.role !== "partner" && user.role !== "master" && user.role !== "employee")) {
      throw new Error("Acesso negado - apenas admins, masters, partners e employees");
    }

    // For partners, only show bookings for their events
    if (user.role === "partner") {
      // If specific event is requested, check ownership first
      if (args.eventId) {
        const event = await ctx.db.get(args.eventId);
        if (!event || event.partnerId.toString() !== user._id.toString()) {
          throw new Error("Você não tem permissão para ver as reservas deste evento");
        }

        let eventQuery = ctx.db
          .query("eventBookings")
          .withIndex("by_event", (q) => q.eq("eventId", args.eventId!));

        if (args.status && typeof args.status === "string") {
          eventQuery = eventQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await eventQuery.collect();
        const bookingsWithDetails = await Promise.all(
          bookings.map(async (booking) => {
            return {
              ...booking,
              eventTitle: event.title,
            };
          })
        );

        return {
          page: bookingsWithDetails,
          isDone: true,
          continueCursor: "",
        };
      }

      // Get partner's events, filtered by organization if specified
      let partnerEvents;
      
      if (args.organizationId) {
        // Busca assets da organização específica
        const organizationAssets = await ctx.db
          .query("partnerAssets")
          .withIndex("by_organization_type", (q) => 
            q.eq("organizationId", args.organizationId!).eq("assetType", "events")
          )
          .collect();
        
        const assetIds = organizationAssets.map(asset => asset.assetId);
        
        // Filtra eventos que pertencem à organização
        const allPartnerEvents = await ctx.db
          .query("events")
          .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
          .collect();
        
        partnerEvents = allPartnerEvents.filter(event => 
          assetIds.includes(event._id)
        );
        
        // Se não encontrar eventos na organização, mas a organização existe,
        // mostra todos os eventos do partner (fallback)
        if (partnerEvents.length === 0) {
          const organization = await ctx.db.get(args.organizationId);
          if (organization && organization.partnerId.toString() === user._id.toString()) {
            partnerEvents = await ctx.db
              .query("events")
              .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
              .collect();
          }
        }
      } else {
        // Sem filtro de organização, busca todos os eventos do partner
        partnerEvents = await ctx.db
          .query("events")
          .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
          .collect();
      }
      const eventIds = partnerEvents.map(e => e._id);

      let filteredBookings: any[] = [];
      for (const eventId of eventIds) {
        let eventQuery = ctx.db
          .query("eventBookings")
          .withIndex("by_event", (q) => q.eq("eventId", eventId));

        if (args.status && typeof args.status === "string") {
          eventQuery = eventQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await eventQuery.collect();
        filteredBookings.push(...bookings);
      }

      // Sort by creation time
      filteredBookings.sort((a, b) => b._creationTime - a._creationTime);

      const bookingsWithDetails = await Promise.all(
        filteredBookings.map(async (booking) => {
          const event = await ctx.db.get(booking.eventId) as any;
          return {
            ...booking,
            eventTitle: event?.title || "Evento não encontrado",
          };
        })
      );

      return {
        page: bookingsWithDetails,
        isDone: true,
        continueCursor: "",
      };
    }

    // Admin and master see all bookings, filtered by organization if specified
    if (args.organizationId) {
      // Busca assets da organização específica
      const organizationAssets = await ctx.db
        .query("partnerAssets")
        .withIndex("by_organization_type", (q) => 
          q.eq("organizationId", args.organizationId!).eq("assetType", "events")
        )
        .collect();
      
      const assetIds = organizationAssets.map(asset => asset.assetId);
      
      if (assetIds.length === 0) {
        return {
          page: [],
          isDone: true,
          continueCursor: "",
        };
      }
      
      let filteredBookings: any[] = [];
      for (const eventId of assetIds) {
        let eventQuery = ctx.db
          .query("eventBookings")
          .withIndex("by_event", (q) => q.eq("eventId", eventId as any));

        if (args.status && typeof args.status === "string") {
          eventQuery = eventQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await eventQuery.collect();
        filteredBookings.push(...bookings);
      }
      
      // Sort by creation time
      filteredBookings.sort((a, b) => b._creationTime - a._creationTime);

      const bookingsWithDetails = await Promise.all(
        filteredBookings.map(async (booking) => {
          const event = await ctx.db.get(booking.eventId) as any;
          return {
            ...booking,
            eventTitle: event?.title || "Evento não encontrado",
          };
        })
      );

      return {
        page: bookingsWithDetails,
        isDone: true,
        continueCursor: "",
      };
    } else {
      // Sem filtro de organização, busca todas as reservas
      let query = ctx.db.query("eventBookings").order("desc");

      if (args.status && typeof args.status === "string") {
        query = ctx.db
          .query("eventBookings")
          .withIndex("by_status", (q) => q.eq("status", args.status as string))
          .order("desc");
      }

      const result = await query.paginate(args.paginationOpts);

      const bookingsWithDetails = await Promise.all(
        result.page.map(async (booking) => {
          const event = await ctx.db.get(booking.eventId);
          return {
            ...booking,
            eventTitle: event?.title || "Evento não encontrado",
          };
        })
      );
      
      return {
        page: bookingsWithDetails,
        isDone: result.isDone,
        continueCursor: result.continueCursor,
      };
    }
  },
});

/**
 * Get all restaurant reservations (admin only)
 */
export const getRestaurantReservations = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
    organizationId: v.optional(v.id("partnerOrganizations")),
    restaurantId: v.optional(v.id("restaurants")),
  },
  returns: v.object({
    page: v.array(v.object({
      _id: v.id("restaurantReservations"),
      _creationTime: v.number(),
      restaurantId: v.id("restaurants"),
      restaurantName: v.string(),
      userId: v.id("users"),
      date: v.string(),
      time: v.string(),
      partySize: v.number(),
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      status: v.string(),
      confirmationCode: v.string(),
      specialRequests: v.optional(v.string()),
      partnerNotes: v.optional(v.string()),
      tableId: v.optional(v.id("restaurantTables")),
    })),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || (user.role !== "admin" && user.role !== "partner" && user.role !== "master" && user.role !== "employee")) {
      throw new Error("Acesso negado - apenas admins, masters, partners e employees");
    }

    // For partners, only show reservations for their restaurants
    if (user.role === "partner") {
      // If specific restaurant is requested, check ownership first
      if (args.restaurantId) {
        const restaurant = await ctx.db.get(args.restaurantId);
        if (!restaurant || restaurant.partnerId.toString() !== user._id.toString()) {
          throw new Error("Você não tem permissão para ver as reservas deste restaurante");
        }

        let restaurantQuery = ctx.db
          .query("restaurantReservations")
          .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId!));

        if (args.status && typeof args.status === "string") {
          restaurantQuery = restaurantQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const reservations = await restaurantQuery.collect();
        const reservationsWithDetails = await Promise.all(
          reservations.map(async (reservation) => {
            return {
              ...reservation,
              restaurantName: restaurant.name,
            };
          })
        );

        return {
          page: reservationsWithDetails,
          isDone: true,
          continueCursor: "",
        };
      }

      // Get partner's restaurants
      let partnerRestaurants;
      
      if (args.organizationId) {
        // Busca assets da organização específica
        const organizationAssets = await ctx.db
          .query("partnerAssets")
          .withIndex("by_organization_type", (q) => 
            q.eq("organizationId", args.organizationId!).eq("assetType", "restaurants")
          )
          .collect();
        
        const assetIds = organizationAssets.map(asset => asset.assetId);
        
        // Filtra restaurantes que pertencem à organização
        const allPartnerRestaurants = await ctx.db
          .query("restaurants")
          .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
          .collect();
        
        partnerRestaurants = allPartnerRestaurants.filter(restaurant => 
          assetIds.includes(restaurant._id)
        );
      } else {
        // Get all partner restaurants if no organizationId is provided
        partnerRestaurants = await ctx.db
          .query("restaurants")
          .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
          .collect();
      }

      const restaurantIds = partnerRestaurants.map(r => r._id);

      if (restaurantIds.length === 0) {
        return {
          page: [],
          isDone: true,
          continueCursor: "",
        };
      }

      let filteredReservations: any[] = [];
      for (const restaurantId of restaurantIds) {
        let restaurantQuery = ctx.db
          .query("restaurantReservations")
          .withIndex("by_restaurant", (q) => q.eq("restaurantId", restaurantId));

        if (args.status && typeof args.status === "string") {
          restaurantQuery = restaurantQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const reservations = await restaurantQuery.collect();
        filteredReservations.push(...reservations);
      }

      // Sort by creation time
      filteredReservations.sort((a, b) => b._creationTime - a._creationTime);

      const reservationsWithDetails = await Promise.all(
        filteredReservations.map(async (reservation) => {
          const restaurant = await ctx.db.get(reservation.restaurantId) as any;
          return {
            ...reservation,
            restaurantName: restaurant?.name || "Restaurante não encontrado",
          };
        })
      );

      return {
        page: reservationsWithDetails,
        isDone: true,
        continueCursor: "",
      };
    }

    // Admin and master see all reservations
    let restaurantIds: any[] = [];
    
    // If organizationId is provided, filter by organization
    if (args.organizationId) {
      const organizationAssets = await ctx.db
        .query("partnerAssets")
        .withIndex("by_organization_type", (q) => 
          q.eq("organizationId", args.organizationId!).eq("assetType", "restaurants")
        )
        .collect();
        
      restaurantIds = organizationAssets.map(asset => asset.assetId);
      
      if (restaurantIds.length === 0) {
        return {
          page: [],
          isDone: true,
          continueCursor: "",
        };
      }
    }
    
    let query;
    
    if (args.organizationId && restaurantIds.length > 0) {
      // If filtering by organization, we need to query each restaurant separately
      let filteredReservations: any[] = [];
      
      for (const restaurantId of restaurantIds) {
        let restaurantQuery = ctx.db
          .query("restaurantReservations")
          .withIndex("by_restaurant", (q) => q.eq("restaurantId", restaurantId));

        if (args.status && typeof args.status === "string") {
          restaurantQuery = restaurantQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const reservations = await restaurantQuery.collect();
        filteredReservations.push(...reservations);
      }
      
      // Sort by creation time
      filteredReservations.sort((a, b) => b._creationTime - a._creationTime);
      
      // Apply pagination manually
      const startIndex = 0;
      const endIndex = Math.min(startIndex + args.paginationOpts.numItems, filteredReservations.length);
      const paginatedReservations = filteredReservations.slice(startIndex, endIndex);
      
      const reservationsWithDetails = await Promise.all(
        paginatedReservations.map(async (reservation) => {
          const restaurant = await ctx.db.get(reservation.restaurantId) as any;
          return {
            ...reservation,
            restaurantName: restaurant?.name || "Restaurante não encontrado",
          };
        })
      );
      
      return {
        page: reservationsWithDetails,
        isDone: endIndex >= filteredReservations.length,
        continueCursor: endIndex >= filteredReservations.length ? "" : endIndex.toString(),
      };
    } else {
      // Use standard query if not filtering by organization
      query = ctx.db.query("restaurantReservations").order("desc");

      if (args.status && typeof args.status === "string") {
        query = ctx.db
          .query("restaurantReservations")
          .withIndex("by_status", (q) => q.eq("status", args.status as string))
          .order("desc");
      }

      const result = await query.paginate(args.paginationOpts);

      const reservationsWithDetails = await Promise.all(
        result.page.map(async (reservation) => {
          const restaurant = await ctx.db.get(reservation.restaurantId) as any;
          return {
            ...reservation,
            restaurantName: restaurant?.name || "Restaurante não encontrado",
          };
        })
      );

      return {
        page: reservationsWithDetails,
        isDone: result.isDone,
        continueCursor: result.continueCursor,
      };
    }
  },
});

/**
 * Get all vehicle bookings (admin only)
 */
export const getVehicleBookings = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
    organizationId: v.optional(v.id("partnerOrganizations")),
    vehicleId: v.optional(v.id("vehicles")),
  },
  returns: v.object({
    page: v.array(v.object({
      _id: v.id("vehicleBookings"),
      _creationTime: v.number(),
      vehicleId: v.id("vehicles"),
      userId: v.id("users"),
      vehicleName: v.string(),
      vehicleBrand: v.string(),
      vehicleModel: v.string(),
      startDate: v.number(),
      endDate: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      paymentStatus: v.optional(v.string()),
      pickupLocation: v.optional(v.string()),
      returnLocation: v.optional(v.string()),
      notes: v.optional(v.string()),
      partnerNotes: v.optional(v.string()),
      additionalDrivers: v.optional(v.number()),
      additionalOptions: v.optional(v.array(v.string())),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
      createdAt: v.number(),
      updatedAt: v.number(),
    })),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || (user.role !== "admin" && user.role !== "partner" && user.role !== "master" && user.role !== "employee")) {
      throw new Error("Acesso negado - apenas admins, masters, partners e employees");
    }

    // For partners, only show bookings for their vehicles
    if (user.role === "partner") {
      // If specific vehicle is requested, check ownership first
      if (args.vehicleId) {
        const vehicle = await ctx.db.get(args.vehicleId);
        if (!vehicle || !vehicle.ownerId || vehicle.ownerId.toString() !== user._id.toString()) {
          throw new Error("Você não tem permissão para ver as reservas deste veículo");
        }

        let vehicleQuery = ctx.db
          .query("vehicleBookings")
          .withIndex("by_vehicleId", (q) => q.eq("vehicleId", args.vehicleId!));

        if (args.status && typeof args.status === "string") {
          vehicleQuery = vehicleQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await vehicleQuery.collect();
        const bookingsWithDetails = await Promise.all(
          bookings.map(async (booking) => {
            const user = await ctx.db.get(booking.userId);
            return {
              ...booking,
              vehicleName: vehicle.name,
              vehicleBrand: vehicle.brand,
              vehicleModel: vehicle.model,
              customerInfo: {
                name: user?.name || "Nome não disponível",
                email: user?.email || "Email não disponível", 
                phone: user?.phone || "Telefone não disponível",
              },
            };
          })
        );

        return {
          page: bookingsWithDetails,
          isDone: true,
          continueCursor: "",
        };
      }

      // Get partner's vehicles
      let partnerVehicles;
      
      if (args.organizationId) {
        // Busca assets da organização específica
        const organizationAssets = await ctx.db
          .query("partnerAssets")
          .withIndex("by_organization_type", (q) => 
            q.eq("organizationId", args.organizationId!).eq("assetType", "vehicles")
          )
          .collect();
        
        const assetIds = organizationAssets.map(asset => asset.assetId);
        
        // Filtra veículos que pertencem à organização
        const allPartnerVehicles = await ctx.db
          .query("vehicles")
          .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
          .collect();
        
        partnerVehicles = allPartnerVehicles.filter(vehicle => 
          assetIds.includes(vehicle._id)
        );
      } else {
        // Get all partner vehicles if no organizationId is provided
        partnerVehicles = await ctx.db
          .query("vehicles")
          .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
          .collect();
      }

      const vehicleIds = partnerVehicles.map(v => v._id);
      
      if (vehicleIds.length === 0) {
        return {
          page: [],
          isDone: true,
          continueCursor: "",
        };
      }

      let filteredBookings: any[] = [];
      for (const vehicleId of vehicleIds) {
        let vehicleQuery = ctx.db
          .query("vehicleBookings")
          .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicleId));

        if (args.status && typeof args.status === "string") {
          vehicleQuery = vehicleQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await vehicleQuery.collect();
        filteredBookings.push(...bookings);
      }

      // Sort by creation time
      filteredBookings.sort((a, b) => b._creationTime - a._creationTime);

      const bookingsWithDetails = await Promise.all(
        filteredBookings.map(async (booking) => {
          const vehicle = await ctx.db.get(booking.vehicleId) as any;
          const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), booking.userId))
            .unique();
          return {
            ...booking,
            vehicleName: vehicle?.name || "Veículo não encontrado",
            vehicleBrand: vehicle?.brand || "",
            vehicleModel: vehicle?.model || "",
            customerInfo: {
              name: user?.name || "Nome não disponível",
              email: user?.email || "Email não disponível", 
              phone: user?.phone || "Telefone não disponível",
            },
          };
        })
      );

      return {
        page: bookingsWithDetails,
        isDone: true,
        continueCursor: "",
      };
    }

    // For employees, show bookings for vehicles they have permission to access
    if (user.role === "employee") {
      let accessibleVehicleIds: string[] = [];
      
      // 1. Check direct vehicle permissions
      const assetPermissions = await ctx.db
        .query("assetPermissions")
        .withIndex("by_employee_asset_type", (q) => 
          q.eq("employeeId", user._id).eq("assetType", "vehicles")
        )
        .collect();
      
      const directVehicleIds = assetPermissions
        .filter(p => p.permissions.includes("view") || p.permissions.includes("manage"))
        .map(p => p.assetId);
      
      accessibleVehicleIds.push(...directVehicleIds);
      
      // 2. Check organization permissions and get vehicles from those organizations
      const organizationPermissions = await ctx.db
        .query("organizationPermissions")
        .withIndex("by_employee", (q) => q.eq("employeeId", user._id))
        .collect();
      
      for (const orgPermission of organizationPermissions) {
        // Check if employee has any meaningful permission for the organization
        const hasAnyPermission = orgPermission.permissions && orgPermission.permissions.length > 0;
        const hasSpecificPermission = orgPermission.permissions.some(p => 
          ["view", "edit", "manage", "full_access"].includes(p)
        );
        
        if (hasAnyPermission && hasSpecificPermission) {
          // Get all vehicles from this organization
          const organizationVehicles = await ctx.db
            .query("partnerAssets")
            .withIndex("by_organization_type", (q) => 
              q.eq("organizationId", orgPermission.organizationId).eq("assetType", "vehicles")
            )
            .collect();
          
          const orgVehicleIds = organizationVehicles.map(asset => asset.assetId);
          accessibleVehicleIds.push(...orgVehicleIds);
        }
      }
      
      // Remove duplicates
      accessibleVehicleIds = [...new Set(accessibleVehicleIds)];
      
      if (accessibleVehicleIds.length === 0) {
        return {
          page: [],
          isDone: true,
          continueCursor: "",
        };
      }

      let filteredBookings: any[] = [];
      for (const vehicleId of accessibleVehicleIds) {
        let vehicleQuery = ctx.db
          .query("vehicleBookings")
          .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicleId as any));

        if (args.status && typeof args.status === "string") {
          vehicleQuery = vehicleQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await vehicleQuery.collect();
        filteredBookings.push(...bookings);
      }

      // Sort by creation time
      filteredBookings.sort((a, b) => b._creationTime - a._creationTime);

      const bookingsWithDetails = await Promise.all(
        filteredBookings.map(async (booking) => {
          const vehicle = await ctx.db.get(booking.vehicleId) as any;
          const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), booking.userId))
            .unique();
          return {
            ...booking,
            vehicleName: vehicle?.name || "Veículo não encontrado",
            vehicleBrand: vehicle?.brand || "",
            vehicleModel: vehicle?.model || "",
            customerInfo: {
              name: user?.name || "Nome não disponível",
              email: user?.email || "Email não disponível", 
              phone: user?.phone || "Telefone não disponível",
            },
          };
        })
      );

      return {
        page: bookingsWithDetails,
        isDone: true,
        continueCursor: "",
      };
    }

    // Admin and master see all bookings
    let vehicleIds: any[] = [];
    
    // If organizationId is provided, filter by organization
    if (args.organizationId) {
      const organizationAssets = await ctx.db
        .query("partnerAssets")
        .withIndex("by_organization_type", (q) => 
          q.eq("organizationId", args.organizationId!).eq("assetType", "vehicles")
        )
        .collect();
        
      vehicleIds = organizationAssets.map(asset => asset.assetId);
      
      if (vehicleIds.length === 0) {
        return {
          page: [],
          isDone: true,
          continueCursor: "",
        };
      }
    }
    
    let query;
    
    if (args.organizationId && vehicleIds.length > 0) {
      // If filtering by organization, we need to query each vehicle separately
      let filteredBookings: any[] = [];
      
      for (const vehicleId of vehicleIds) {
        let vehicleQuery = ctx.db
          .query("vehicleBookings")
          .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicleId));

        if (args.status && typeof args.status === "string") {
          vehicleQuery = vehicleQuery.filter((q) => q.eq(q.field("status"), args.status));
        }

        const bookings = await vehicleQuery.collect();
        filteredBookings.push(...bookings);
      }
      
      // Sort by creation time
      filteredBookings.sort((a, b) => b._creationTime - a._creationTime);
      
      // Apply pagination manually
      const startIndex = 0;
      const endIndex = Math.min(startIndex + args.paginationOpts.numItems, filteredBookings.length);
      const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
      
      const bookingsWithDetails = await Promise.all(
        paginatedBookings.map(async (booking) => {
          const vehicle = await ctx.db.get(booking.vehicleId) as any;
          const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), booking.userId))
            .unique();
          return {
            ...booking,
            vehicleName: vehicle?.name || "Veículo não encontrado",
            vehicleBrand: vehicle?.brand || "",
            vehicleModel: vehicle?.model || "",
            customerInfo: {
              name: user?.name || "Nome não disponível",
              email: user?.email || "Email não disponível", 
              phone: user?.phone || "Telefone não disponível",
            },
          };
        })
      );
      
      return {
        page: bookingsWithDetails,
        isDone: endIndex >= filteredBookings.length,
        continueCursor: endIndex >= filteredBookings.length ? "" : endIndex.toString(),
      };
    } else {
      // Use standard query if not filtering by organization
      query = ctx.db.query("vehicleBookings").order("desc");

      if (args.status && typeof args.status === "string") {
        query = ctx.db
          .query("vehicleBookings")
          .withIndex("by_status", (q) => q.eq("status", args.status as string))
          .order("desc");
      }

      const result = await query.paginate(args.paginationOpts);

      const bookingsWithDetails = await Promise.all(
        result.page.map(async (booking) => {
          const vehicle = await ctx.db.get(booking.vehicleId) as any;
          const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), booking.userId))
            .unique();
          return {
            ...booking,
            vehicleName: vehicle?.name || "Veículo não encontrado",
            vehicleBrand: vehicle?.brand || "",
            vehicleModel: vehicle?.model || "",
            customerInfo: {
              name: user?.name || "Nome não disponível",
              email: user?.email || "Email não disponível", 
              phone: user?.phone || "Telefone não disponível",
            },
          };
        })
      );

      return {
        page: bookingsWithDetails,
        isDone: result.isDone,
        continueCursor: result.continueCursor,
      };
    }
  },
});

/**
 * Get activity booking by ID
 */
export const getActivityBookingById = query({
  args: {
    bookingId: v.id("activityBookings"),
  },
  returns: v.union(
    v.object({
      _id: v.id("activityBookings"),
      _creationTime: v.number(),
      activityId: v.id("activities"),
      userId: v.id("users"),
      date: v.string(),
      time: v.optional(v.string()),
      participants: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      paymentStatus: v.optional(v.string()),
      confirmationCode: v.string(),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
      specialRequests: v.optional(v.string()),
      partnerNotes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    return booking || null;
  },
});

/**
 * Get event booking by ID
 */
export const getEventBookingById = query({
  args: {
    bookingId: v.id("eventBookings"),
  },
  returns: v.union(
    v.object({
      _id: v.id("eventBookings"),
      _creationTime: v.number(),
      eventId: v.id("events"),
      userId: v.id("users"),
      quantity: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      paymentStatus: v.optional(v.string()),
      confirmationCode: v.string(),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
      }),
      specialRequests: v.optional(v.string()),
      partnerNotes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    return booking || null;
  },
});

/**
 * Get restaurant reservation by ID
 */
export const getRestaurantReservationById = query({
  args: {
    reservationId: v.id("restaurantReservations"),
  },
  returns: v.union(
    v.object({
      _id: v.id("restaurantReservations"),
      _creationTime: v.number(),
      restaurantId: v.id("restaurants"),
      userId: v.id("users"),
      date: v.string(),
      time: v.string(),
      partySize: v.number(),
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      status: v.string(),
      confirmationCode: v.string(),
      specialRequests: v.optional(v.string()),
      partnerNotes: v.optional(v.string()),
      tableId: v.optional(v.id("restaurantTables")),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);
    return reservation || null;
  },
});

/**
 * Get vehicle booking by ID
 */
export const getVehicleBookingById = query({
  args: {
    bookingId: v.id("vehicleBookings"),
  },
  returns: v.union(
    v.object({
      _id: v.id("vehicleBookings"),
      _creationTime: v.number(),
      vehicleId: v.id("vehicles"),
      userId: v.id("users"),
      startDate: v.number(),
      endDate: v.number(),
      totalPrice: v.number(),
      status: v.string(),
      paymentStatus: v.optional(v.string()),
      pickupLocation: v.optional(v.string()),
      returnLocation: v.optional(v.string()),
      additionalDrivers: v.optional(v.number()),
      additionalOptions: v.optional(v.array(v.string())),
      notes: v.optional(v.string()),
      partnerNotes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    return booking || null;
  },
});

/**
 * Get bookings with RBAC filtering
 * - Traveler: Only their own bookings
 * - Partner: Only bookings for their own assets
 * - Employee: Only bookings for assets they're assigned to
 * - Master: All bookings
 */
export const getBookingsWithRBAC = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
    bookingType: v.optional(v.union(
      v.literal("activity"), 
      v.literal("event"), 
      v.literal("restaurant"), 
      v.literal("vehicle")
    )),
  },
  returns: v.object({
    bookings: v.array(v.object({
      _id: v.string(),
      _creationTime: v.number(),
      type: v.string(),
      assetId: v.string(),
      assetName: v.string(),
      customerName: v.string(),
      customerEmail: v.string(),
      totalPrice: v.number(),
      status: v.string(),
      confirmationCode: v.string(),
      date: v.optional(v.string()),
      time: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      canManage: v.boolean(), // Whether current user can manage this booking
    })),
    isDone: v.boolean(),
    continueCursor: v.string(),
    totalCount: v.number(),
  }),
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

    const allBookings: any[] = [];
    let totalCount = 0;

    // Helper function to check if user can manage a booking based on asset ownership
    const canUserManageAsset = async (assetId: string, assetType: string): Promise<boolean> => {
      if (user.role === "master") return true;
      
      let asset;
      switch (assetType) {
        case "activity":
          asset = await ctx.db.get(assetId as any);
          return user.role === "partner" && asset?.partnerId === user._id;
        case "event":
          asset = await ctx.db.get(assetId as any);
          return user.role === "partner" && asset?.partnerId === user._id;
        case "restaurant":
          asset = await ctx.db.get(assetId as any);
          return user.role === "partner" && asset?.partnerId === user._id;
        case "vehicle":
          asset = await ctx.db.get(assetId as any);
          return user.role === "partner" && asset?.ownerId === user._id;
        default:
          return false;
      }
    };

    // Fetch activity bookings based on role
    if (!args.bookingType || args.bookingType === "activity") {
      // Apply role-based filtering
      if (user.role === "traveler") {
        const activityBookings = await ctx.db
          .query("activityBookings")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();
        
        for (const booking of activityBookings) {
          const activity = await ctx.db.get(booking.activityId);
          if (activity) {
            allBookings.push({
              _id: booking._id,
              _creationTime: booking._creationTime,
              type: "activity",
              assetId: booking.activityId,
              assetName: activity.title,
              customerName: booking.customerInfo.name,
              customerEmail: booking.customerInfo.email,
              totalPrice: booking.totalPrice,
              status: booking.status,
              confirmationCode: booking.confirmationCode,
              date: booking.date,
              time: booking.time,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              canManage: false,
            });
          }
        }
      } else if (user.role === "partner") {
        // Get activities owned by partner
        const ownedActivities = await ctx.db
          .query("activities")
          .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
          .collect();
        
        for (const activity of ownedActivities) {
          const bookings = await ctx.db
            .query("activityBookings")
            .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
            .collect();
          
          for (const booking of bookings) {
            allBookings.push({
              _id: booking._id,
              _creationTime: booking._creationTime,
              type: "activity",
              assetId: booking.activityId,
              assetName: activity.title,
              customerName: booking.customerInfo.name,
              customerEmail: booking.customerInfo.email,
              totalPrice: booking.totalPrice,
              status: booking.status,
              confirmationCode: booking.confirmationCode,
              date: booking.date,
              time: booking.time,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              canManage: true,
            });
          }
        }
      } else if (user.role === "master") {
        const masterBookings = await ctx.db.query("activityBookings").collect();
        for (const booking of masterBookings) {
          const activity = await ctx.db.get(booking.activityId);
          if (activity) {
            allBookings.push({
              _id: booking._id,
              _creationTime: booking._creationTime,
              type: "activity",
              assetId: booking.activityId,
              assetName: activity.title,
              customerName: booking.customerInfo.name,
              customerEmail: booking.customerInfo.email,
              totalPrice: booking.totalPrice,
              status: booking.status,
              confirmationCode: booking.confirmationCode,
              date: booking.date,
              time: booking.time,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              canManage: true,
            });
          }
        }
      }
    }

    // Fetch event bookings based on role
    if (!args.bookingType || args.bookingType === "event") {
      // Apply role-based filtering
      if (user.role === "traveler") {
        const eventBookings = await ctx.db
          .query("eventBookings")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();
        
        for (const booking of eventBookings) {
          const event = await ctx.db.get(booking.eventId);
          if (event) {
            allBookings.push({
              _id: booking._id,
              _creationTime: booking._creationTime,
              type: "event",
              assetId: booking.eventId,
              assetName: event.title,
              customerName: booking.customerInfo.name,
              customerEmail: booking.customerInfo.email,
              totalPrice: booking.totalPrice,
              status: booking.status,
              confirmationCode: booking.confirmationCode,
              date: event.date,
              time: event.time,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              canManage: false,
            });
          }
        }
      } else if (user.role === "partner") {
        // Get events owned by partner
        const ownedEvents = await ctx.db
          .query("events")
          .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
          .collect();
        
        for (const event of ownedEvents) {
          const bookings = await ctx.db
            .query("eventBookings")
            .withIndex("by_event", (q) => q.eq("eventId", event._id))
            .collect();
          
          for (const booking of bookings) {
            allBookings.push({
              _id: booking._id,
              _creationTime: booking._creationTime,
              type: "event",
              assetId: booking.eventId,
              assetName: event.title,
              customerName: booking.customerInfo.name,
              customerEmail: booking.customerInfo.email,
              totalPrice: booking.totalPrice,
              status: booking.status,
              confirmationCode: booking.confirmationCode,
              date: event.date,
              time: event.time,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              canManage: true,
            });
          }
        }
      } else if (user.role === "master") {
        const masterBookings = await ctx.db.query("eventBookings").collect();
        for (const booking of masterBookings) {
          const event = await ctx.db.get(booking.eventId);
          if (event) {
            allBookings.push({
              _id: booking._id,
              _creationTime: booking._creationTime,
              type: "event",
              assetId: booking.eventId,
              assetName: event.title,
              customerName: booking.customerInfo.name,
              customerEmail: booking.customerInfo.email,
              totalPrice: booking.totalPrice,
              status: booking.status,
              confirmationCode: booking.confirmationCode,
              date: event.date,
              time: event.time,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              canManage: true,
            });
          }
        }
      }
    }

    // Fetch restaurant reservations based on role
    if (!args.bookingType || args.bookingType === "restaurant") {
      // Apply role-based filtering
      if (user.role === "traveler") {
        const restaurantReservations = await ctx.db
          .query("restaurantReservations")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();
        
        for (const reservation of restaurantReservations) {
          const restaurant = await ctx.db.get(reservation.restaurantId);
          if (restaurant) {
            allBookings.push({
              _id: reservation._id,
              _creationTime: reservation._creationTime,
              type: "restaurant",
              assetId: reservation.restaurantId,
              assetName: restaurant.name,
              customerName: reservation.name,
              customerEmail: reservation.email,
              totalPrice: 0, // Restaurant reservations don't have totalPrice
              status: reservation.status,
              confirmationCode: reservation.confirmationCode,
              date: reservation.date,
              time: reservation.time,
              createdAt: reservation._creationTime,
              updatedAt: reservation._creationTime,
              canManage: false,
            });
          }
        }
      } else if (user.role === "partner") {
        // Get restaurants owned by partner
        const ownedRestaurants = await ctx.db
          .query("restaurants")
          .withIndex("by_partner", (q) => q.eq("partnerId", user._id))
          .collect();
        
        for (const restaurant of ownedRestaurants) {
          const reservations = await ctx.db
            .query("restaurantReservations")
            .withIndex("by_restaurant", (q) => q.eq("restaurantId", restaurant._id))
            .collect();
          
          for (const reservation of reservations) {
            allBookings.push({
              _id: reservation._id,
              _creationTime: reservation._creationTime,
              type: "restaurant",
              assetId: reservation.restaurantId,
              assetName: restaurant.name,
              customerName: reservation.name,
              customerEmail: reservation.email,
              totalPrice: 0, // Restaurant reservations don't have totalPrice
              status: reservation.status,
              confirmationCode: reservation.confirmationCode,
              date: reservation.date,
              time: reservation.time,
              createdAt: reservation._creationTime,
              updatedAt: reservation._creationTime,
              canManage: true,
            });
          }
        }
      } else if (user.role === "master") {
        const masterReservations = await ctx.db.query("restaurantReservations").collect();
        for (const reservation of masterReservations) {
          const restaurant = await ctx.db.get(reservation.restaurantId);
          if (restaurant) {
            allBookings.push({
              _id: reservation._id,
              _creationTime: reservation._creationTime,
              type: "restaurant",
              assetId: reservation.restaurantId,
              assetName: restaurant.name,
              customerName: reservation.name,
              customerEmail: reservation.email,
              totalPrice: 0, // Restaurant reservations don't have totalPrice
              status: reservation.status,
              confirmationCode: reservation.confirmationCode,
              date: reservation.date,
              time: reservation.time,
              createdAt: reservation._creationTime,
              updatedAt: reservation._creationTime,
              canManage: true,
            });
          }
        }
      }
    }

    // Fetch vehicle bookings based on role
    if (!args.bookingType || args.bookingType === "vehicle") {
      // Apply role-based filtering
      if (user.role === "traveler") {
        const vehicleBookings = await ctx.db
          .query("vehicleBookings")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .collect();
        
        for (const booking of vehicleBookings) {
          const vehicle = await ctx.db.get(booking.vehicleId);
          if (vehicle) {
            allBookings.push({
              _id: booking._id,
              _creationTime: booking._creationTime,
              type: "vehicle",
              assetId: booking.vehicleId,
              assetName: vehicle.name,
              customerName: "Cliente", // Vehicle bookings may not have customer info
              customerEmail: "cliente@email.com", // Placeholder
              totalPrice: booking.totalPrice,
              status: booking.status,
              confirmationCode: booking._id.toString(), // Use booking ID as confirmation
              date: new Date(booking.startDate).toISOString().split('T')[0],
              time: undefined,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              canManage: false,
            });
          }
        }
      } else if (user.role === "partner") {
        // Get vehicles owned by partner
        const ownedVehicles = await ctx.db
          .query("vehicles")
          .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
          .collect();
        
        for (const vehicle of ownedVehicles) {
          const bookings = await ctx.db
            .query("vehicleBookings")
            .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicle._id))
            .collect();
          
          for (const booking of bookings) {
            allBookings.push({
              _id: booking._id,
              _creationTime: booking._creationTime,
              type: "vehicle",
              assetId: booking.vehicleId,
              assetName: vehicle.name,
              customerName: "Cliente", // Vehicle bookings may not have customer info
              customerEmail: "cliente@email.com", // Placeholder
              totalPrice: booking.totalPrice,
              status: booking.status,
              confirmationCode: booking._id.toString(), // Use booking ID as confirmation
              date: new Date(booking.startDate).toISOString().split('T')[0],
              time: undefined,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              canManage: true,
            });
          }
        }
      } else if (user.role === "master") {
        const masterBookings = await ctx.db.query("vehicleBookings").collect();
        for (const booking of masterBookings) {
          const vehicle = await ctx.db.get(booking.vehicleId);
          if (vehicle) {
            allBookings.push({
              _id: booking._id,
              _creationTime: booking._creationTime,
              type: "vehicle",
              assetId: booking.vehicleId,
              assetName: vehicle.name,
              customerName: "Cliente", // Vehicle bookings may not have customer info
              customerEmail: "cliente@email.com", // Placeholder
              totalPrice: booking.totalPrice,
              status: booking.status,
              confirmationCode: booking._id.toString(), // Use booking ID as confirmation
              date: new Date(booking.startDate).toISOString().split('T')[0],
              time: undefined,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              canManage: true,
            });
          }
        }
      }
    }

    // Apply status filter if provided
    const filteredBookings = args.status 
      ? allBookings.filter(booking => booking.status === args.status)
      : allBookings;

    // Sort by creation time (newest first)
    filteredBookings.sort((a, b) => b.createdAt - a.createdAt);
    
    totalCount = filteredBookings.length;

    // Apply pagination
    const startIndex = args.paginationOpts.cursor ? 
      parseInt(args.paginationOpts.cursor) : 0;
    const endIndex = startIndex + args.paginationOpts.numItems;
    
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
    const isDone = endIndex >= filteredBookings.length;
    const continueCursor = isDone ? "" : endIndex.toString();

    return {
      bookings: paginatedBookings,
      isDone,
      continueCursor,
      totalCount,
    };
  },
});

/**
 * Get user's own reservations (for traveler dashboard)
 */
export const getUserReservations = query({
  args: {},
  returns: v.array(v.object({
    id: v.string(),
    type: v.string(),
    name: v.string(),
    date: v.optional(v.string()),
    checkIn: v.optional(v.string()),
    checkOut: v.optional(v.string()),
    guests: v.optional(v.number()),
    status: v.string(),
    location: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    confirmationCode: v.optional(v.string()),
  })),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    const reservations: any[] = [];

    // Get activity bookings
    const activityBookings = await ctx.db
      .query("activityBookings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const booking of activityBookings) {
      const activity = await ctx.db.get(booking.activityId);
      if (activity) {
        reservations.push({
          id: booking._id,
          type: "activity",
          name: activity.title,
          date: booking.date,
          guests: booking.participants,
          status: booking.status,
          location: "Fernando de Noronha",
          imageUrl: activity.imageUrl,
          confirmationCode: booking.confirmationCode,
        });
      }
    }

    // Get event bookings
    const eventBookings = await ctx.db
      .query("eventBookings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const booking of eventBookings) {
      const event = await ctx.db.get(booking.eventId);
      if (event) {
        reservations.push({
          id: booking._id,
          type: "event",
          name: event.title,
          date: event.date,
          guests: booking.quantity,
          status: booking.status,
          location: event.location,
          imageUrl: event.imageUrl,
          confirmationCode: booking.confirmationCode,
        });
      }
    }

    // Get restaurant reservations
    const restaurantReservations = await ctx.db
      .query("restaurantReservations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const reservation of restaurantReservations) {
      const restaurant = await ctx.db.get(reservation.restaurantId);
      if (restaurant) {
        reservations.push({
          id: reservation._id,
          type: "restaurant",
          name: restaurant.name,
          date: reservation.date,
          guests: reservation.partySize,
          status: reservation.status,
          location: restaurant.address?.city || "Fernando de Noronha",
          imageUrl: restaurant.mainImage,
          confirmationCode: reservation.confirmationCode,
        });
      }
    }

    // Get vehicle bookings
    const vehicleBookings = await ctx.db
      .query("vehicleBookings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const booking of vehicleBookings) {
      const vehicle = await ctx.db.get(booking.vehicleId);
      if (vehicle) {
        reservations.push({
          id: booking._id,
          type: "vehicle",
          name: `${vehicle.brand} ${vehicle.model}`,
          checkIn: new Date(booking.startDate).toISOString(),
          checkOut: new Date(booking.endDate).toISOString(),
          status: booking.status,
          location: "Fernando de Noronha",
          imageUrl: vehicle.imageUrl,
          confirmationCode: booking._id, // Use booking ID as fallback for vehicles
        });
      }
    }

    // Sort by creation time (newest first)
    return reservations.sort((a, b) => new Date(b.date || b.checkIn || 0).getTime() - new Date(a.date || a.checkIn || 0).getTime());
  },
});

/**
 * Get user statistics for dashboard
 */
export const getUserStats = query({
  args: {},
  returns: v.object({
    totalReservations: v.number(),
    activeReservations: v.number(),
    totalSpent: v.number(),
    favoriteLocations: v.array(v.string()),
    completedTrips: v.number(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        totalReservations: 0,
        activeReservations: 0,
        totalSpent: 0,
        favoriteLocations: [],
        completedTrips: 0,
      };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return {
        totalReservations: 0,
        activeReservations: 0,
        totalSpent: 0,
        favoriteLocations: [],
        completedTrips: 0,
      };
    }

    // Count all reservations for the user
    const [activityBookings, eventBookings, restaurantReservations, vehicleBookings] = await Promise.all([
      ctx.db.query("activityBookings").withIndex("by_user", (q) => q.eq("userId", user._id)).collect(),
      ctx.db.query("eventBookings").withIndex("by_user", (q) => q.eq("userId", user._id)).collect(),
      ctx.db.query("restaurantReservations").withIndex("by_user", (q) => q.eq("userId", user._id)).collect(),
      ctx.db.query("vehicleBookings").withIndex("by_userId", (q) => q.eq("userId", user._id)).collect(),
    ]);

    const totalReservations = activityBookings.length + eventBookings.length + restaurantReservations.length + vehicleBookings.length;
    
    const activeReservations = [
      ...activityBookings.filter(b => b.status === "confirmed" || b.status === "pending"),
      ...eventBookings.filter(b => b.status === "confirmed" || b.status === "pending"),
      ...restaurantReservations.filter(b => b.status === "confirmed" || b.status === "pending"),
      ...vehicleBookings.filter(b => b.status === "confirmed" || b.status === "pending"),
    ].length;

    const totalSpent = [
      ...activityBookings.filter(b => b.status === "confirmed"),
      ...eventBookings.filter(b => b.status === "confirmed"),
    ].reduce((sum, booking) => sum + booking.totalPrice, 0);

    const completedTrips = [
      ...activityBookings.filter(b => b.status === "completed"),
      ...eventBookings.filter(b => b.status === "completed"),
      ...restaurantReservations.filter(b => b.status === "completed"),
      ...vehicleBookings.filter(b => b.status === "completed"),
    ].length;

    return {
      totalReservations,
      activeReservations,
      totalSpent,
      favoriteLocations: ["Fernando de Noronha", "Vila dos Remédios"],
      completedTrips,
    };
  },
});

/**
 * Get reservation details with partner information (for contact feature)
 */
export const getReservationWithPartnerDetails = query({
  args: {
    reservationId: v.string(),
    reservationType: v.union(
      v.literal("activity"),
      v.literal("event"),
      v.literal("restaurant"),
      v.literal("vehicle"),
      v.literal("accommodation")
    ),
  },
  returns: v.union(
    v.object({
      _id: v.string(),
      _creationTime: v.number(),
      type: v.string(),
      assetId: v.string(),
      assetName: v.string(),
      userId: v.id("users"),
      status: v.string(),
      confirmationCode: v.string(),
      // Partner information
      partnerId: v.id("users"),
      partnerName: v.optional(v.string()),
      partnerEmail: v.optional(v.string()),
      // Asset information for context
      assetType: v.string(),
      // Customer info (for verification)
      customerName: v.string(),
    }),
    v.null()
  ),
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

    let reservation: any = null;
    let asset: any = null;
    let partner: any = null;

    // Get reservation based on type
    switch (args.reservationType) {
      case "activity":
        reservation = await ctx.db.get(args.reservationId as Id<"activityBookings">);
        if (reservation) {
          asset = await ctx.db.get(reservation.activityId);
          if (asset) {
            partner = await ctx.db.get(asset.partnerId);
          }
        }
        break;

      case "event":
        reservation = await ctx.db.get(args.reservationId as Id<"eventBookings">);
        if (reservation) {
          asset = await ctx.db.get(reservation.eventId);
          if (asset) {
            partner = await ctx.db.get(asset.partnerId);
          }
        }
        break;

      case "restaurant":
        reservation = await ctx.db.get(args.reservationId as Id<"restaurantReservations">);
        if (reservation) {
          asset = await ctx.db.get(reservation.restaurantId);
          if (asset) {
            partner = await ctx.db.get(asset.partnerId);
          }
        }
        break;

      case "vehicle":
        reservation = await ctx.db.get(args.reservationId as Id<"vehicleBookings">);
        if (reservation) {
          asset = await ctx.db.get(reservation.vehicleId);
          if (asset) {
            partner = await ctx.db.get(asset.ownerId);
          }
        }
        break;

      case "accommodation":
        reservation = await ctx.db.get(args.reservationId as Id<"accommodationBookings">);
        if (reservation) {
          asset = await ctx.db.get(reservation.accommodationId);
          if (asset) {
            partner = await ctx.db.get(asset.partnerId);
          }
        }
        break;

      default:
        return null;
    }

    if (!reservation || !asset || !partner) {
      return null;
    }

    // Verify that the current user owns this reservation
    if (reservation.userId !== user._id) {
      throw new Error("Você não tem permissão para ver esta reserva");
    }

    // Get asset name based on type
    const assetName = asset.name || asset.title || `${asset.brand} ${asset.model}` || "Asset";
    
    // Get customer name based on reservation type
    const customerName = reservation.customerInfo?.name || reservation.name || "Cliente";

    // Get confirmation code - use reservation ID as fallback for vehicle bookings
    const confirmationCode = reservation.confirmationCode || reservation._id;

    return {
      _id: reservation._id,
      _creationTime: reservation._creationTime,
      type: args.reservationType,
      assetId: asset._id,
      assetName,
      userId: reservation.userId,
      status: reservation.status,
      confirmationCode,
      partnerId: partner._id,
      partnerName: partner.name,
      partnerEmail: partner.email,
      assetType: args.reservationType === "vehicle" ? "vehicles" : 
                 args.reservationType === "accommodation" ? "accommodations" :
                 `${args.reservationType}s`,
      customerName,
    };
  },
});

/**
 * Get pending bookings for partner dashboard
 */
export const getPendingBookingsForPartner = query({
  args: v.object({
    partnerId: v.id("users"), // Partners são users com role específico
  }),
  returns: v.array(v.object({
    bookingId: v.string(),
    bookingType: v.string(),
    assetName: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    totalPrice: v.number(),
    paymentIntentId: v.optional(v.string()),
    paymentCaptured: v.optional(v.boolean()),
    paymentStatus: v.string(),
    confirmationCode: v.string(),
    createdAt: v.number(),
    bookingDetails: v.any(),
    specialRequests: v.optional(v.string()),
  })),
  handler: async (ctx, args) => {
    const pendingBookings: any[] = [];

    // Get activity bookings
    const activityBookings = await ctx.db
      .query("activityBookings")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    for (const booking of activityBookings) {
      const activity = await ctx.db.get(booking.activityId);
      if (activity && activity.partnerId === args.partnerId) {
        pendingBookings.push({
          bookingId: booking._id,
          bookingType: "activity",
          assetName: activity.title,
          customerName: booking.customerInfo.name,
          customerEmail: booking.customerInfo.email,
          customerPhone: booking.customerInfo.phone,
          totalPrice: booking.totalPrice,
          paymentIntentId: booking.paymentIntentId,
          paymentCaptured: booking.paymentCaptured,
          paymentStatus: booking.paymentStatus,
          confirmationCode: booking.confirmationCode,
          createdAt: booking.createdAt || booking._creationTime,
          bookingDetails: {
            date: booking.date,
            time: booking.time,
            participants: booking.participants,
          },
          specialRequests: booking.specialRequests,
        });
      }
    }

    // Get event bookings
    const eventBookings = await ctx.db
      .query("eventBookings")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    for (const booking of eventBookings) {
      const event = await ctx.db.get(booking.eventId);
      if (event && event.partnerId === args.partnerId) {
        pendingBookings.push({
          bookingId: booking._id,
          bookingType: "event",
          assetName: event.title,
          customerName: booking.customerInfo.name,
          customerEmail: booking.customerInfo.email,
          customerPhone: booking.customerInfo.phone,
          totalPrice: booking.totalPrice,
          paymentIntentId: booking.paymentIntentId,
          paymentCaptured: booking.paymentCaptured,
          paymentStatus: booking.paymentStatus,
          confirmationCode: booking.confirmationCode,
          createdAt: booking.createdAt || booking._creationTime,
          bookingDetails: {
            quantity: booking.quantity,
            date: event.date,
            time: event.time,
            location: event.location,
          },
          specialRequests: booking.specialRequests,
        });
      }
    }

    // Get restaurant reservations
    const restaurantReservations = await ctx.db
      .query("restaurantReservations")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    for (const reservation of restaurantReservations) {
      const restaurant = await ctx.db.get(reservation.restaurantId);
      if (restaurant && restaurant.partnerId === args.partnerId) {
        pendingBookings.push({
          bookingId: reservation._id,
          bookingType: "restaurant",
          assetName: restaurant.name,
          customerName: reservation.name,
          customerEmail: reservation.email,
          customerPhone: reservation.phone,
          totalPrice: 0, // Restaurant reservations may not have price
          paymentIntentId: reservation.paymentIntentId,
          paymentCaptured: reservation.paymentCaptured,
          paymentStatus: reservation.paymentIntentId ? (reservation.paymentCaptured ? "paid" : "authorized") : "none",
          confirmationCode: reservation.confirmationCode,
          createdAt: reservation._creationTime,
          bookingDetails: {
            date: reservation.date,
            time: reservation.time,
            partySize: reservation.partySize,
          },
          specialRequests: reservation.specialRequests,
        });
      }
    }

    // Sort by creation time (newest first)
    return pendingBookings.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get booking history for partner dashboard (confirmed, cancelled, etc.)
 */
export const getBookingHistoryForPartner = query({
  args: v.object({
    partnerId: v.id("users"), // Partners são users com role específico
    status: v.optional(v.string()), // "confirmed", "cancelled", etc.
    limit: v.optional(v.number()),
  }),
  returns: v.array(v.object({
    bookingId: v.string(),
    bookingType: v.string(),
    assetName: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    status: v.string(),
    paymentStatus: v.string(),
    totalPrice: v.number(),
    confirmationCode: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    bookingDetails: v.any(),
    refundId: v.optional(v.string()),
    refundStatus: v.optional(v.string()),
    cancellationReason: v.optional(v.string()),
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const bookingHistory: any[] = [];

    // Get activity bookings
    const activityBookings = args.status 
      ? await ctx.db.query("activityBookings")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("activityBookings").collect();

    for (const booking of activityBookings) {
      const activity = await ctx.db.get(booking.activityId);
      if (activity && activity.partnerId === args.partnerId) {
        if (!args.status || booking.status === args.status) {
          bookingHistory.push({
            bookingId: booking._id,
            bookingType: "activity",
            assetName: activity.title,
            customerName: booking.customerInfo.name,
            customerEmail: booking.customerInfo.email,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            totalPrice: booking.totalPrice,
            confirmationCode: booking.confirmationCode,
            createdAt: booking.createdAt || booking._creationTime,
            updatedAt: booking.updatedAt || booking._creationTime,
            bookingDetails: {
              date: booking.date,
              time: booking.time,
              participants: booking.participants,
            },
            refundId: booking.refundId,
            refundStatus: booking.refundStatus,
            cancellationReason: booking.cancellationReason,
          });
        }
      }
    }

    // Sort by update time (newest first) and limit
    return bookingHistory
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  },
});

/**
 * Get payment summary for partner dashboard
 */
export const getPaymentSummaryForPartner = query({
  args: v.object({
    partnerId: v.id("users"), // Partners são users com role específico
    dateRange: v.optional(v.object({
      startDate: v.string(),
      endDate: v.string(),
    })),
  }),
  returns: v.object({
    totalRevenue: v.number(),
    totalBookings: v.number(),
    pendingPayments: v.number(),
    completedPayments: v.number(),
    refundedAmount: v.number(),
    refundCount: v.number(),
  }),
  handler: async (ctx, args) => {
    let totalRevenue = 0;
    let totalBookings = 0;
    let pendingPayments = 0;
    let completedPayments = 0;
    let refundedAmount = 0;
    let refundCount = 0;

    // Get activity bookings
    const activityBookings = await ctx.db.query("activityBookings").collect();
    for (const booking of activityBookings) {
      const activity = await ctx.db.get(booking.activityId);
      if (activity && activity.partnerId === args.partnerId) {
        totalBookings++;
        
        if (booking.status === "confirmed" && booking.paymentStatus === "paid") {
          totalRevenue += booking.totalPrice;
          completedPayments++;
        } else if (booking.status === "pending" && booking.paymentIntentId) {
          pendingPayments++;
        }

        if (booking.refundId && booking.refundStatus === "succeeded") {
          refundedAmount += booking.totalPrice;
          refundCount++;
        }
      }
    }

    // Add similar logic for other booking types...

    return {
      totalRevenue,
      totalBookings,
      pendingPayments,
      completedPayments,
      refundedAmount,
      refundCount,
    };
  },
});

/**
 * Get booking details for partner (single booking view)
 */
export const getBookingDetailsForPartner = query({
  args: v.object({
    bookingId: v.string(),
    bookingType: v.string(),
    partnerId: v.id("users"), // Partners são users com role específico
  }),
  returns: v.union(
    v.object({
      booking: v.any(),
      asset: v.any(),
      customer: v.any(),
      paymentDetails: v.object({
        paymentIntentId: v.optional(v.string()),
        paymentCaptured: v.optional(v.boolean()),
        paymentStatus: v.string(),
        refundId: v.optional(v.string()),
        refundStatus: v.optional(v.string()),
      }),
      timeline: v.array(v.object({
        timestamp: v.number(),
        event: v.string(),
        description: v.string(),
      })),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    // Get booking based on type
    let booking: any;
    let asset: any;

    switch (args.bookingType) {
      case "activity":
        booking = await ctx.db.get(args.bookingId as Id<"activityBookings">);
        if (booking) {
          asset = await ctx.db.get(booking.activityId);
        }
        break;
      case "event":
        booking = await ctx.db.get(args.bookingId as Id<"eventBookings">);
        if (booking) {
          asset = await ctx.db.get(booking.eventId);
        }
        break;
      case "restaurant":
        booking = await ctx.db.get(args.bookingId as Id<"restaurantReservations">);
        if (booking) {
          asset = await ctx.db.get(booking.restaurantId);
        }
        break;
      default:
        return null;
    }

    if (!booking || !asset || asset.partnerId !== args.partnerId) {
      return null;
    }

    // Get customer details
    const customer = await ctx.db.get(booking.userId);

    // Create timeline
    const timeline = [
      {
        timestamp: booking.createdAt || booking._creationTime,
        event: "booking_created",
        description: "Reserva criada pelo cliente",
      },
    ];

    if (booking.paymentIntentId) {
      timeline.push({
        timestamp: booking.createdAt || booking._creationTime,
        event: "payment_authorized",
        description: "Pagamento autorizado",
      });
    }

    if (booking.status === "confirmed") {
      timeline.push({
        timestamp: booking.updatedAt,
        event: "booking_confirmed",
        description: "Reserva confirmada pelo parceiro",
      });
    }

    if (booking.status === "cancelled") {
      timeline.push({
        timestamp: booking.updatedAt,
        event: "booking_cancelled",
        description: `Reserva cancelada. Motivo: ${booking.cancellationReason || "Não informado"}`,
      });
    }

    return {
      booking,
      asset,
      customer,
      paymentDetails: {
        paymentIntentId: booking.paymentIntentId,
        paymentCaptured: booking.paymentCaptured,
        paymentStatus: booking.paymentStatus || "none",
        refundId: booking.refundId,
        refundStatus: booking.refundStatus,
      },
      timeline: timeline.sort((a, b) => a.timestamp - b.timestamp),
    };
  },
});






