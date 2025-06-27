import { v } from "convex/values";
import { internalMutation } from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";

/**
 * Internal mutation to update asset with Stripe product and payment link data
 * Called after successful creation of Stripe product/payment link
 */
export const updateAssetWithStripeData = internalMutation({
  args: v.object({
    assetType: v.string(),
    assetId: v.string(),
    stripeProductId: v.string(),
    stripePaymentLinkId: v.string(),
    stripePaymentLinkUrl: v.string(),
  }),
  returns: v.null(),
  handler: async (ctx, args) => {
    try {
      console.log(`🔄 Atualizando ${args.assetType} ${args.assetId} com dados do Stripe`);

      const updateData = {
        stripeProductId: args.stripeProductId,
        stripePaymentLinkId: args.stripePaymentLinkId,
        stripePaymentLinkUrl: args.stripePaymentLinkUrl,
      };

      switch (args.assetType) {
        case "activity":
          await ctx.db.patch(args.assetId as Id<"activities">, updateData);
          break;
        case "event":
          await ctx.db.patch(args.assetId as Id<"events">, updateData);
          break;
        case "restaurant":
          await ctx.db.patch(args.assetId as Id<"restaurants">, updateData);
          break;
        case "vehicle":
          await ctx.db.patch(args.assetId as Id<"vehicles">, updateData);
          break;
        case "accommodation":
          await ctx.db.patch(args.assetId as Id<"accommodations">, updateData);
          break;
        default:
          throw new Error(`Tipo de asset inválido: ${args.assetType}`);
      }

      console.log(`✅ Asset ${args.assetType}:${args.assetId} atualizado com dados do Stripe`);
      return null;
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar asset com dados do Stripe: ${error.message}`);
      throw error;
    }
  },
}); 