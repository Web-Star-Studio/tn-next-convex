import { v } from "convex/values";
import type { Id } from "../../_generated/dataModel";
import { mutationWithRole } from "../../domains/rbac";
import { getCurrentUserRole, getCurrentUserConvexId, verifyPartnerAccess } from "../../domains/rbac";
import { internal } from "../../_generated/api";
import type { 
  ActivityCreateInput,
  ActivityUpdateInput,
  ActivityTicketCreateInput,
  ActivityTicketUpdateInput,
  ActivityTicketUpdates
} from "./types";

/**
 * Create a new activity
 */
export const create = mutationWithRole(["partner", "master"])({
  args: {
    title: v.string(),
    description: v.string(),
    shortDescription: v.string(),
    price: v.number(),
    category: v.string(),
    duration: v.string(),
    maxParticipants: v.number(),
    minParticipants: v.number(),
    difficulty: v.string(),
    rating: v.number(),
    imageUrl: v.string(),
    galleryImages: v.array(v.string()),
    highlights: v.array(v.string()),
    includes: v.array(v.string()),
    itineraries: v.array(v.string()),
    excludes: v.array(v.string()),
    additionalInfo: v.array(v.string()),
    cancelationPolicy: v.array(v.string()),
    isFeatured: v.boolean(),
    isActive: v.boolean(),
    hasMultipleTickets: v.optional(v.boolean()),
    partnerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const role = await getCurrentUserRole(ctx);
    const currentUserId = await getCurrentUserConvexId(ctx);
    if (role === "partner") {
      if (!currentUserId || currentUserId.toString() !== args.partnerId.toString()) {
        throw new Error("Unauthorized: partners can only create activities for themselves");
      }
    }
    // Convert numbers to correct types for the database
    const maxParticipants = BigInt(args.maxParticipants);
    const minParticipants = BigInt(args.minParticipants);
    
    // Creating the activity
    const activityId = await ctx.db.insert("activities", {
      ...args,
      maxParticipants,
      minParticipants,
      hasMultipleTickets: args.hasMultipleTickets || false, // default é false
    });
    
    // Automatically create Stripe Product and Payment Link
    try {
      const priceInCents = Math.round(args.price * 100); // Convert to cents
      
      await ctx.scheduler.runAfter(0, internal.domains.payments.actions.createStripeProductAndPaymentLink, {
        assetType: "activity",
        assetId: activityId,
        assetTitle: args.title,
        assetDescription: args.shortDescription,
        price: priceInCents,
        currency: "brl",
        imageUrl: args.imageUrl,
      });
    } catch (error) {
      console.error("Failed to create Stripe product/payment link for activity:", error);
      // Don't fail the activity creation if Stripe fails
    }
    
    return activityId;
  },
});

/**
 * Update an existing activity
 */
export const update = mutationWithRole(["partner", "master"])({
  args: {
    id: v.id("activities"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    duration: v.optional(v.string()),
    maxParticipants: v.optional(v.number()),
    minParticipants: v.optional(v.number()),
    difficulty: v.optional(v.string()),
    rating: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    highlights: v.optional(v.array(v.string())),
    includes: v.optional(v.array(v.string())),
    itineraries: v.optional(v.array(v.string())),
    excludes: v.optional(v.array(v.string())),
    additionalInfo: v.optional(v.array(v.string())),
    cancelationPolicy: v.optional(v.array(v.string())),
    isFeatured: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    hasMultipleTickets: v.optional(v.boolean()),
    partnerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const role = await getCurrentUserRole(ctx);
    if (role === "partner") {
      const currentUserId = await getCurrentUserConvexId(ctx);
      const activity = await ctx.db.get(args.id);
      if (!activity || activity.partnerId.toString() !== currentUserId?.toString()) {
        throw new Error("Unauthorized");
      }
    }
    const { id, maxParticipants, minParticipants, ...otherFields } = args;
    
    // Definir um tipo mais específico para as atualizações
    type Updates = {
      title?: string;
      description?: string;
      shortDescription?: string;
      price?: number;
      category?: string;
      duration?: string;
      maxParticipants?: bigint;
      minParticipants?: bigint;
      difficulty?: string;
      rating?: number;
      imageUrl?: string;
      galleryImages?: string[];
      highlights?: string[];
      includes?: string[];
      itineraries?: string[];
      excludes?: string[];
      additionalInfo?: string[];
      cancelationPolicy?: string[];
      isFeatured?: boolean;
      isActive?: boolean;
      hasMultipleTickets?: boolean;
      partnerId?: Id<"users">;
    };
    
    // Criar um objeto com todos os campos atualizados
    const updates: Updates = {
      ...otherFields
    };
    
    // Convert participant numbers to BigInt if provided
    if (maxParticipants !== undefined) {
      updates.maxParticipants = BigInt(maxParticipants);
    }
    
    if (minParticipants !== undefined) {
      updates.minParticipants = BigInt(minParticipants);
    }
    
    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Delete an activity
 */
export const remove = mutationWithRole(["partner", "master"])({
  args: { id: v.id("activities") },
  handler: async (ctx, args) => {
    const role = await getCurrentUserRole(ctx);
    if (role === "partner") {
      const currentUserId = await getCurrentUserConvexId(ctx);
      const activity = await ctx.db.get(args.id);
      if (!activity || activity.partnerId.toString() !== currentUserId?.toString()) {
        throw new Error("Unauthorized");
      }
    }
    await ctx.db.delete(args.id);
  },
});

/**
 * Toggle the featured status of an activity
 */
export const toggleFeatured = mutationWithRole(["partner", "master"])({
  args: { 
    id: v.id("activities"),
    isFeatured: v.boolean()
  },
  handler: async (ctx, args) => {
    const role = await getCurrentUserRole(ctx);
    if (role === "partner") {
      const currentUserId = await getCurrentUserConvexId(ctx);
      const activity = await ctx.db.get(args.id);
      if (!activity || activity.partnerId.toString() !== currentUserId?.toString()) {
        throw new Error("Unauthorized");
      }
    }
    await ctx.db.patch(args.id, { isFeatured: args.isFeatured });
    return args.id;
  },
});

/**
 * Toggle the active status of an activity
 */
export const toggleActive = mutationWithRole(["partner", "master"])({
  args: { 
    id: v.id("activities"),
    isActive: v.boolean()
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const role = await getCurrentUserRole(ctx);
    if (role === "partner") {
      const currentUserId = await getCurrentUserConvexId(ctx);
      const activity = await ctx.db.get(args.id);
      if (!activity || activity.partnerId.toString() !== currentUserId?.toString()) {
        throw new Error("Unauthorized");
      }
    }
    await ctx.db.patch(args.id, { isActive: args.isActive });
    return null;
  },
});

/**
 * Create a new ticket for an activity
 */
export const createActivityTicket = mutationWithRole(["partner", "master"])({
  args: {
    activityId: v.id("activities"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    availableQuantity: v.number(),
    maxPerOrder: v.number(),
    type: v.string(),
    benefits: v.array(v.string()),
    isActive: v.boolean()
  },
  returns: v.id("activityTickets"),
  handler: async (ctx, args) => {
    const role = await getCurrentUserRole(ctx);
    if (role === "partner") {
      const currentUserId = await getCurrentUserConvexId(ctx);
      const activity = await ctx.db.get(args.activityId);
      if (!activity || activity.partnerId.toString() !== currentUserId?.toString()) {
        throw new Error("Unauthorized");
      }
    }
    // Primeiro, atualizamos a atividade para indicar que tem múltiplos ingressos
    await ctx.db.patch(args.activityId, { hasMultipleTickets: true });
    
    // Depois, criamos o novo ingresso
    const ticketId = await ctx.db.insert("activityTickets", {
      activityId: args.activityId,
      name: args.name,
      description: args.description,
      price: args.price,
      availableQuantity: BigInt(args.availableQuantity),
      maxPerOrder: BigInt(args.maxPerOrder),
      type: args.type,
      benefits: args.benefits,
      isActive: args.isActive
    });
    
    return ticketId;
  },
});

/**
 * Update an existing ticket
 */
export const updateActivityTicket = mutationWithRole(["partner", "master"])({
  args: {
    id: v.id("activityTickets"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    availableQuantity: v.optional(v.number()),
    maxPerOrder: v.optional(v.number()),
    type: v.optional(v.string()),
    benefits: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const { id, availableQuantity, maxPerOrder, ...otherFields } = args;
    
    // Criar um objeto com todos os campos a serem atualizados
    const updates: ActivityTicketUpdates = {
      ...otherFields
    };
    
    // Converter números para BigInt se fornecidos
    if (availableQuantity !== undefined) {
      updates.availableQuantity = BigInt(availableQuantity);
    }
    
    if (maxPerOrder !== undefined) {
      updates.maxPerOrder = BigInt(maxPerOrder);
    }
    
    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Delete a ticket
 */
export const removeActivityTicket = mutationWithRole(["partner", "master"])({
  args: { 
    id: v.id("activityTickets") 
  },
  handler: async (ctx, args) => {
    // Obter o ingresso para identificar a atividade
    const ticket = await ctx.db.get(args.id);
    
    // Verificar se o ticket existe
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    
    // Verificar se é o último ingresso desta atividade
    const remainingTickets = await ctx.db
      .query("activityTickets")
      .withIndex("by_activity", (q) => q.eq("activityId", ticket.activityId))
      .collect();
    
    // Se for o último (ou seja, se só restar 1 que é o que vamos excluir)
    if (remainingTickets.length <= 1) {
      // Atualizar a atividade para indicar que não tem mais ingressos múltiplos
      await ctx.db.patch(ticket.activityId, { hasMultipleTickets: false });
    }
    
    // Excluir o ingresso
    await ctx.db.delete(args.id);
  },
}); 