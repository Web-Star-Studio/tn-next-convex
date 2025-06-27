import { v } from "convex/values";

// Common booking status values
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed", 
  CANCELED: "canceled",
  COMPLETED: "completed",
  REFUNDED: "refunded",
} as const;

// Payment status values
export const PAYMENT_STATUS = {
  PENDING: "pending",
  AUTHORIZED: "authorized",  // ✅ Adicionado para o novo fluxo
  PAID: "paid",
  REFUNDED: "refunded", 
  FAILED: "failed",
} as const;

// Payment method values
export const PAYMENT_METHOD = {
  CREDIT_CARD: "credit_card",
  PIX: "pix",
  BANK_TRANSFER: "bank_transfer",
  CASH: "cash",
} as const;

// Customer info validator (reusable)
export const customerInfoValidator = v.object({
  name: v.string(),
  email: v.string(),
  phone: v.string(),
});

// Activity booking validators
export const createActivityBookingValidator = v.object({
  activityId: v.id("activities"),
  ticketId: v.optional(v.id("activityTickets")),
  date: v.string(),
  time: v.optional(v.string()),
  participants: v.number(),
  customerInfo: v.optional(customerInfoValidator),
  specialRequests: v.optional(v.string()),
});

export const updateActivityBookingValidator = v.object({
  bookingId: v.id("activityBookings"),
  status: v.optional(v.string()),
  paymentStatus: v.optional(v.string()),
  paymentMethod: v.optional(v.string()),
  specialRequests: v.optional(v.string()),
});

// Event booking validators
export const createEventBookingValidator = v.object({
  eventId: v.id("events"),
  ticketId: v.optional(v.id("eventTickets")),
  quantity: v.number(),
  customerInfo: v.optional(customerInfoValidator),
  specialRequests: v.optional(v.string()),
});

export const updateEventBookingValidator = v.object({
  bookingId: v.id("eventBookings"),
  status: v.optional(v.string()),
  paymentStatus: v.optional(v.string()),
  paymentMethod: v.optional(v.string()),
  specialRequests: v.optional(v.string()),
});

// Restaurant reservation validators
export const createRestaurantReservationValidator = v.object({
  restaurantId: v.id("restaurants"),
  date: v.string(),
  time: v.string(),
  partySize: v.number(),
  customerInfo: v.optional(customerInfoValidator),
  specialRequests: v.optional(v.string()),
});

export const updateRestaurantReservationValidator = v.object({
  reservationId: v.id("restaurantReservations"),
  status: v.optional(v.string()),
  specialRequests: v.optional(v.string()),
});

// Vehicle booking validators
export const createVehicleBookingValidator = v.object({
  vehicleId: v.id("vehicles"),
  startDate: v.number(),
  endDate: v.number(),
  customerInfo: v.optional(customerInfoValidator),
  pickupLocation: v.optional(v.string()),
  returnLocation: v.optional(v.string()),
  additionalDrivers: v.optional(v.number()),
  additionalOptions: v.optional(v.array(v.string())),
  notes: v.optional(v.string()),
});

export const updateVehicleBookingValidator = v.object({
  bookingId: v.id("vehicleBookings"),
  status: v.optional(v.string()),
  paymentStatus: v.optional(v.string()),
  paymentMethod: v.optional(v.string()),
  pickupLocation: v.optional(v.string()),
  returnLocation: v.optional(v.string()),
  notes: v.optional(v.string()),
});