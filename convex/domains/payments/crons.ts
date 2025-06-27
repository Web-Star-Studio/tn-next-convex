"use node";

import { internalAction } from "../../_generated/server";
import { v } from "convex/values";
import { internal, api } from "../../_generated/api";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

/**
 * Cancel expired authorization payments (run every 4 hours)
 * 
 * Stripe authorizations expire after:
 * - 7 days for most cards
 * - 5 days for Visa (card-not-present, merchant-initiated)
 * - 2 days for in-person Terminal payments
 * 
 * We check for authorizations older than 6 days to cancel them proactively
 */
export const cancelExpiredAuthorizations = internalAction({
  args: {},
  returns: v.object({
    processed: v.number(),
    canceled: v.number(),
    errors: v.number(),
  }),
  handler: async (ctx, args) => {
    console.log("🔍 Checking for expired authorizations...");
    
    // Get bookings with authorized but not captured payments older than 6 days
    const cutoffTime = Date.now() - (6 * 24 * 60 * 60 * 1000); // 6 days ago
    
    const expiredBookings = await ctx.runQuery(internal.domains.payments.queries.getExpiredAuthorizations, {
      cutoffTime,
    });

    let processed = 0;
    let canceled = 0;
    let errors = 0;

    for (const booking of expiredBookings) {
      try {
        processed++;
        console.log(`🔄 Processing expired authorization: ${booking.paymentIntentId}`);

        // Check current status in Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(booking.paymentIntentId);
        
        if (paymentIntent.status === "requires_capture") {
          // Still authorized, needs to be canceled
          await stripe.paymentIntents.cancel(paymentIntent.id, {
            cancellation_reason: "abandoned",
          });
          
          // Update booking status
          await ctx.runMutation(internal.domains.bookings.mutations.updateBookingPaymentStatus, {
            bookingId: booking.bookingId,
            bookingType: booking.bookingType,
            paymentIntentId: booking.paymentIntentId,
            paymentStatus: "expired",
            paymentCaptured: false,
          });

          // Update booking to canceled
          const updateData: any = {
            status: "canceled",
            cancellationReason: "payment_authorization_expired",
            updatedAt: Date.now(),
          };

          switch (booking.bookingType) {
            case "activity":
              await ctx.runMutation(api.domains.bookings.mutations.updateActivityBooking, {
                bookingId: booking.bookingId as any,
                status: "canceled",
              });
              break;
            case "event":
              await ctx.runMutation(api.domains.bookings.mutations.updateEventBooking, {
                bookingId: booking.bookingId as any,
                status: "canceled",
              });
              break;
            case "vehicle":
              await ctx.runMutation(api.domains.bookings.mutations.updateVehicleBooking, {
                bookingId: booking.bookingId as any,
                status: "canceled",
              });
              break;
            case "accommodation":
              await ctx.runMutation(api.domains.accommodations.mutations.updateAccommodationBooking, {
                bookingId: booking.bookingId as any,
                status: "canceled",
              });
              break;
            case "restaurant":
              await ctx.runMutation(api.domains.restaurants.mutations.updateRestaurantReservation, {
                bookingId: booking.bookingId as any,
                status: "canceled",
              });
              break;
          }

          canceled++;
          console.log(`✅ Canceled expired authorization: ${booking.paymentIntentId}`);
        } else {
          console.log(`ℹ️ Authorization already processed: ${booking.paymentIntentId} (${paymentIntent.status})`);
        }
      } catch (error: any) {
        errors++;
        console.error(`❌ Error processing authorization ${booking.paymentIntentId}:`, error.message);
      }
    }

    console.log(`✅ Processed ${processed} authorizations, canceled ${canceled}, errors: ${errors}`);
    
    return {
      processed,
      canceled,
      errors,
    };
  },
});

