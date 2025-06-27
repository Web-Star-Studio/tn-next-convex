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
 * Create Stripe product and payment link for an asset
 */
export const createStripeProductAndPaymentLink = action({
  args: v.object({
    assetType: v.string(), // "activity", "event", "restaurant", "vehicle", "accommodation"
    assetId: v.string(),
    assetTitle: v.string(),
    assetDescription: v.string(),
    price: v.number(), // em centavos
    currency: v.optional(v.string()), // default "brl"
    imageUrl: v.optional(v.string()),
    successUrl: v.optional(v.string()),
    cancelUrl: v.optional(v.string()),
  }),
  returns: v.object({
    success: v.boolean(),
    productId: v.optional(v.string()),
    paymentLinkId: v.optional(v.string()),
    paymentLinkUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      console.log(`🔨 Criando produto Stripe para ${args.assetType}:${args.assetId}`);

      // 1. Create Stripe Product
      const product = await stripe.products.create({
        name: args.assetTitle,
        description: args.assetDescription,
        images: args.imageUrl ? [args.imageUrl] : undefined,
        metadata: {
          assetType: args.assetType,
          assetId: args.assetId,
          createdBy: "tuca-noronha-platform",
        },
      });

      console.log(`✅ Produto criado: ${product.id}`);

      // 2. Create Price for the Product
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: args.price,
        currency: args.currency || "brl",
        metadata: {
          assetType: args.assetType,
          assetId: args.assetId,
        },
      });

      console.log(`✅ Preço criado: ${price.id}`);

      // 3. Create Payment Link
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tucanoronha.com";
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        after_completion: {
          type: "redirect",
          redirect: {
            url: args.successUrl || `${baseUrl}/reservas/sucesso?session_id={CHECKOUT_SESSION_ID}`,
          },
        },
        // Permitir que o cliente ajuste a quantidade se necessário (para alguns assets)
        allow_promotion_codes: true,
        metadata: {
          assetType: args.assetType,
          assetId: args.assetId,
          flow: "asset_reservation",
        },
      });

      console.log(`✅ Payment Link criado: ${paymentLink.id} - ${paymentLink.url}`);

      // Update asset with Stripe information
      await ctx.runMutation(internal.domains.payments.mutations.updateAssetWithStripeData, {
        assetType: args.assetType,
        assetId: args.assetId,
        stripeProductId: product.id,
        stripePaymentLinkId: paymentLink.id,
        stripePaymentLinkUrl: paymentLink.url,
      });

      return {
        success: true,
        productId: product.id,
        paymentLinkId: paymentLink.id,
        paymentLinkUrl: paymentLink.url,
      };
    } catch (error: any) {
      console.error(`❌ Erro ao criar produto/payment link Stripe: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Update Stripe product and payment link when asset is updated
 */
export const updateStripeProductAndPaymentLink = action({
  args: v.object({
    productId: v.string(),
    paymentLinkId: v.string(),
    assetTitle: v.optional(v.string()),
    assetDescription: v.optional(v.string()),
    price: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    active: v.optional(v.boolean()),
  }),
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      console.log(`🔨 Atualizando produto Stripe: ${args.productId}`);

      // Update Product if needed
      if (args.assetTitle || args.assetDescription || args.imageUrl !== undefined) {
        const updateData: Stripe.ProductUpdateParams = {};
        if (args.assetTitle) updateData.name = args.assetTitle;
        if (args.assetDescription) updateData.description = args.assetDescription;
        if (args.imageUrl !== undefined) {
          updateData.images = args.imageUrl ? [args.imageUrl] : [];
        }
        if (args.active !== undefined) updateData.active = args.active;

        await stripe.products.update(args.productId, updateData);
        console.log(`✅ Produto atualizado: ${args.productId}`);
      }

      // Update Payment Link status if needed
      if (args.active !== undefined) {
        await stripe.paymentLinks.update(args.paymentLinkId, {
          active: args.active,
        });
        console.log(`✅ Payment Link ${args.active ? 'ativado' : 'desativado'}: ${args.paymentLinkId}`);
      }

      // If price changed, we need to create a new price and update the payment link
      if (args.price) {
        // Get current payment link to extract the product
        const currentLink = await stripe.paymentLinks.retrieve(args.paymentLinkId);
        
        // Create new price
        const newPrice = await stripe.prices.create({
          product: args.productId,
          unit_amount: args.price,
          currency: "brl",
        });

        // Note: Stripe doesn't allow updating existing payment links with new prices
        // We would need to create a new payment link, but that would change the URL
        // For now, we'll just create the new price and log a warning
        console.log(`⚠️ Nova price criada: ${newPrice.id}. Payment Link precisa ser recriado para usar novo preço.`);
      }

      return { success: true };
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar produto/payment link Stripe: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Deactivate Stripe product and payment link when asset is deleted
 */
export const deactivateStripeProductAndPaymentLink = action({
  args: v.object({
    productId: v.string(),
    paymentLinkId: v.string(),
  }),
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      console.log(`🔨 Desativando produto e payment link Stripe`);

      // Deactivate product
      await stripe.products.update(args.productId, { active: false });
      console.log(`✅ Produto desativado: ${args.productId}`);

      // Deactivate payment link
      await stripe.paymentLinks.update(args.paymentLinkId, { active: false });
      console.log(`✅ Payment Link desativado: ${args.paymentLinkId}`);

      return { success: true };
    } catch (error: any) {
      console.error(`❌ Erro ao desativar produto/payment link Stripe: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },
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