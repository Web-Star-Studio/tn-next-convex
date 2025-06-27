"use node";

import { action } from "../../_generated/server";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

/**
 * Capture Stripe payment after partner confirms booking
 */
export const captureStripePayment = action({
  args: v.object({
    paymentIntentId: v.string(),
    bookingId: v.string(),
    bookingType: v.string(),
    amount: v.optional(v.number()), // Optional: partial capture
  }),
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      console.log(`🔄 Capturando pagamento: ${args.paymentIntentId}`);

      // Capture the payment in Stripe
      const paymentIntent = await stripe.paymentIntents.capture(args.paymentIntentId, {
        amount_to_capture: args.amount, // If undefined, captures full amount
      });

      if (paymentIntent.status === "succeeded") {
        console.log(`✅ Pagamento capturado com sucesso: ${args.paymentIntentId}`);
        
        // Update booking payment status in database
        await ctx.runMutation(internal.domains.bookings.mutations.updateBookingPaymentStatus, {
          bookingId: args.bookingId,
          bookingType: args.bookingType,
          paymentIntentId: args.paymentIntentId,
          paymentStatus: "captured",
          paymentCaptured: true,
        });

        return { success: true };
      } else {
        console.error(`❌ Falha ao capturar pagamento: ${paymentIntent.status}`);
        return { 
          success: false, 
          error: `Status inesperado: ${paymentIntent.status}` 
        };
      }
    } catch (error: any) {
      console.error(`❌ Erro ao capturar pagamento: ${error.message}`);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },
});

/**
 * Cancel Stripe payment authorization (for non-captured payments)
 */
export const cancelStripePayment = action({
  args: v.object({
    paymentIntentId: v.string(),
    bookingId: v.string(),
    bookingType: v.string(),
    cancellationReason: v.optional(v.string()),
  }),
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      console.log(`🔄 Cancelando autorização: ${args.paymentIntentId}`);

      // Cancel the payment intent in Stripe
      const paymentIntent = await stripe.paymentIntents.cancel(args.paymentIntentId, {
        cancellation_reason: args.cancellationReason as any || "requested_by_customer",
      });

      if (paymentIntent.status === "canceled") {
        console.log(`✅ Autorização cancelada com sucesso: ${args.paymentIntentId}`);
        
        // Update booking payment status in database
        await ctx.runMutation(internal.domains.bookings.mutations.updateBookingPaymentStatus, {
          bookingId: args.bookingId,
          bookingType: args.bookingType,
          paymentIntentId: args.paymentIntentId,
          paymentStatus: "canceled",
          paymentCaptured: false,
        });

        return { success: true };
      } else {
        console.error(`❌ Falha ao cancelar autorização: ${paymentIntent.status}`);
        return { 
          success: false, 
          error: `Status inesperado: ${paymentIntent.status}` 
        };
      }
    } catch (error: any) {
      console.error(`❌ Erro ao cancelar autorização: ${error.message}`);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },
});

/**
 * Create refund for captured Stripe payment
 */
export const refundStripePayment = action({
  args: v.object({
    paymentIntentId: v.string(),
    bookingId: v.string(),
    bookingType: v.string(),
    amount: v.optional(v.number()), // Optional: partial refund
    reason: v.optional(v.string()),
  }),
  returns: v.object({
    success: v.boolean(),
    refundId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      console.log(`🔄 Processando reembolso: ${args.paymentIntentId}`);

      // Get the payment intent to find the charge
      const paymentIntent = await stripe.paymentIntents.retrieve(args.paymentIntentId);
      
      if (!paymentIntent.latest_charge) {
        return { 
          success: false, 
          error: "Nenhuma cobrança encontrada para reembolso" 
        };
      }

      // Create refund
      const refund = await stripe.refunds.create({
        charge: paymentIntent.latest_charge as string,
        amount: args.amount, // If undefined, refunds full amount
        reason: args.reason as any || "requested_by_customer",
        metadata: {
          bookingId: args.bookingId,
          bookingType: args.bookingType,
        },
      });

      if (refund.status === "succeeded" || refund.status === "pending") {
        console.log(`✅ Reembolso criado com sucesso: ${refund.id}`);
        
        // Update booking with refund information
        await ctx.runMutation(internal.domains.bookings.mutations.updateBookingPaymentStatus, {
          bookingId: args.bookingId,
          bookingType: args.bookingType,
          paymentIntentId: args.paymentIntentId,
          paymentStatus: "refunded",
          paymentCaptured: false,
        });

        // Update refund status in database
        await ctx.runMutation(internal.domains.bookings.mutations.updateBookingRefundStatus, {
          bookingId: args.bookingId,
          bookingType: args.bookingType,
          refundId: refund.id,
          refundStatus: refund.status,
        });

        return { 
          success: true, 
          refundId: refund.id 
        };
      } else {
        console.error(`❌ Falha ao criar reembolso: ${refund.status}`);
        return { 
          success: false, 
          error: `Status inesperado do reembolso: ${refund.status}` 
        };
      }
    } catch (error: any) {
      console.error(`❌ Erro ao processar reembolso: ${error.message}`);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },
});

/**
 * Check Stripe payment status (used for monitoring and reconciliation)
 */
export const checkStripePaymentStatus = action({
  args: v.object({
    paymentIntentId: v.string(),
  }),
  returns: v.object({
    status: v.string(),
    captured: v.boolean(),
    amount: v.number(),
    currency: v.string(),
    latestCharge: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(args.paymentIntentId);
      
      return {
        status: paymentIntent.status,
        captured: paymentIntent.capture_method === "automatic" || 
                 (paymentIntent.capture_method === "manual" && paymentIntent.status === "succeeded"),
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        latestCharge: paymentIntent.latest_charge as string || undefined,
      };
    } catch (error: any) {
      console.error(`❌ Erro ao verificar status do pagamento: ${error.message}`);
      throw new Error(`Erro ao verificar status: ${error.message}`);
    }
  },
}); 