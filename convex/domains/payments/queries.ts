import { internalQuery } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Get bookings with expired authorizations
 * This is a regular query (not Node.js) since it only reads from database
 */
export const getExpiredAuthorizations = internalQuery({
  args: {
    cutoffTime: v.number(),
  },
  returns: v.array(v.object({
    bookingId: v.string(),
    bookingType: v.string(),
    paymentIntentId: v.string(),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const expiredBookings: Array<{
      bookingId: string;
      bookingType: string;
      paymentIntentId: string;
      createdAt: number;
    }> = [];

    // Check each booking type for expired authorizations
    const bookingTypes = [
      { type: "activity", table: "activityBookings" as const },
      { type: "event", table: "eventBookings" as const },
      { type: "vehicle", table: "vehicleBookings" as const },
      { type: "accommodation", table: "accommodationBookings" as const },
      { type: "restaurant", table: "restaurantReservations" as const },
    ];

    for (const { type, table } of bookingTypes) {
      const bookings = await ctx.db
        .query(table)
        .filter((q) => 
          q.and(
            q.eq(q.field("paymentStatus"), "authorized"),
            q.eq(q.field("paymentCaptured"), false),
            q.eq(q.field("status"), "pending"),
            q.lt(q.field("createdAt"), args.cutoffTime)
          )
        )
        .collect();

      for (const booking of bookings) {
        if (booking.paymentIntentId) {
          expiredBookings.push({
            bookingId: booking._id,
            bookingType: type,
            paymentIntentId: booking.paymentIntentId,
            createdAt: (booking as any).createdAt || booking._creationTime,
          });
        }
      }
    }

    return expiredBookings;
  },
}); 