"use node";

import { v } from "convex/values";
import { action, internalAction } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { sendQuickEmail } from "./service";
import type { 
  BookingConfirmationEmailData, 
  BookingCancelledEmailData,
  PackageRequestReceivedEmailData,
  PartnerNewBookingEmailData,
  WelcomeNewUserEmailData,
  SupportMessageEmailData
} from "./types";

/**
 * Enviar email de confirmação de reserva para o cliente
 */
export const sendBookingConfirmationEmail = internalAction({
  args: {
    customerEmail: v.string(),
    customerName: v.string(),
    assetName: v.string(),
    bookingType: v.union(
      v.literal("activity"),
      v.literal("event"), 
      v.literal("restaurant"),
      v.literal("vehicle"),
      v.literal("accommodation")
    ),
    confirmationCode: v.string(),
    bookingDate: v.string(),
    totalPrice: v.optional(v.number()),
    partnerName: v.optional(v.string()),
    partnerEmail: v.optional(v.string()),
    bookingDetails: v.any(),
  },
  returns: v.object({
    success: v.boolean(),
    messageId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const emailData: BookingConfirmationEmailData = {
        type: "booking_confirmation",
        to: args.customerEmail,
        subject: `Reserva Confirmada - ${args.assetName} - Código: ${args.confirmationCode}`,
        customerName: args.customerName,
        assetName: args.assetName,
        bookingType: args.bookingType,
        confirmationCode: args.confirmationCode,
        bookingDate: args.bookingDate,
        totalPrice: args.totalPrice,
        partnerName: args.partnerName,
        partnerEmail: args.partnerEmail,
        bookingDetails: args.bookingDetails,
      };

      const result = await sendQuickEmail(emailData);
      
      // Salvar log no banco de dados
      if (result.id) {
        await ctx.runMutation(internal.domains.email.mutations.logEmail, {
          type: result.type,
          to: result.to,
          subject: result.subject,
          status: result.status,
          error: result.error,
          sentAt: result.sentAt,
        });
      }

      return {
        success: result.status === "sent",
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to send booking confirmation email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

/**
 * Enviar email de cancelamento de reserva para o cliente
 */
export const sendBookingCancelledEmail = internalAction({
  args: {
    customerEmail: v.string(),
    customerName: v.string(),
    assetName: v.string(),
    bookingType: v.union(
      v.literal("activity"),
      v.literal("event"), 
      v.literal("restaurant"),
      v.literal("vehicle"),
      v.literal("accommodation")
    ),
    confirmationCode: v.string(),
    reason: v.optional(v.string()),
    refundAmount: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const emailData: BookingCancelledEmailData = {
        type: "booking_cancelled",
        to: args.customerEmail,
        subject: `Reserva Cancelada - ${args.assetName} - Código: ${args.confirmationCode}`,
        customerName: args.customerName,
        assetName: args.assetName,
        bookingType: args.bookingType,
        confirmationCode: args.confirmationCode,
        reason: args.reason,
        refundAmount: args.refundAmount,
      };

      const result = await sendQuickEmail(emailData);
      
      // Salvar log no banco de dados
      if (result.id) {
        await ctx.runMutation(internal.domains.email.mutations.logEmail, {
          type: result.type,
          to: result.to,
          subject: result.subject,
          status: result.status,
          error: result.error,
          sentAt: result.sentAt,
        });
      }

      return {
        success: result.status === "sent",
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to send booking cancelled email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

/**
 * Enviar email de nova reserva para o parceiro
 */
export const sendPartnerNewBookingEmail = internalAction({
  args: {
    partnerEmail: v.string(),
    partnerName: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    assetName: v.string(),
    bookingType: v.union(
      v.literal("activity"),
      v.literal("event"), 
      v.literal("restaurant"),
      v.literal("vehicle"),
      v.literal("accommodation")
    ),
    confirmationCode: v.string(),
    bookingDate: v.string(),
    totalPrice: v.optional(v.number()),
    bookingDetails: v.any(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const emailData: PartnerNewBookingEmailData = {
        type: "partner_new_booking",
        to: args.partnerEmail,
        subject: `Nova Reserva Recebida - ${args.assetName} - ${args.customerName}`,
        partnerName: args.partnerName,
        customerName: args.customerName,
        assetName: args.assetName,
        bookingType: args.bookingType,
        confirmationCode: args.confirmationCode,
        bookingDate: args.bookingDate,
        totalPrice: args.totalPrice,
        customerContact: {
          email: args.customerEmail,
          phone: args.customerPhone,
        },
        bookingDetails: args.bookingDetails,
      };

      const result = await sendQuickEmail(emailData);
      
      // Salvar log no banco de dados
      if (result.id) {
        await ctx.runMutation(internal.domains.email.mutations.logEmail, {
          type: result.type,
          to: result.to,
          subject: result.subject,
          status: result.status,
          error: result.error,
          sentAt: result.sentAt,
        });
      }

      return {
        success: result.status === "sent",
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to send partner new booking email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

/**
 * Enviar email de confirmação de solicitação de pacote
 */
export const sendPackageRequestReceivedEmail = internalAction({
  args: {
    customerEmail: v.string(),
    customerName: v.string(),
    requestNumber: v.string(),
    duration: v.number(),
    guests: v.number(),
    budget: v.number(),
    destination: v.string(),
    requestDetails: v.any(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const emailData: PackageRequestReceivedEmailData = {
        type: "package_request_received",
        to: args.customerEmail,
        subject: `Solicitação de Pacote Recebida - #${args.requestNumber}`,
        customerName: args.customerName,
        requestNumber: args.requestNumber,
        duration: args.duration,
        guests: args.guests,
        budget: args.budget,
        destination: args.destination,
        requestDetails: args.requestDetails,
      };

      const result = await sendQuickEmail(emailData);
      
      // Salvar log no banco de dados
      if (result.id) {
        await ctx.runMutation(internal.domains.email.mutations.logEmail, {
          type: result.type,
          to: result.to,
          subject: result.subject,
          status: result.status,
          error: result.error,
          sentAt: result.sentAt,
        });
      }

      return {
        success: result.status === "sent",
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to send package request received email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

/**
 * Notificar master sobre nova solicitação de pacote
 */
export const notifyMasterNewPackageRequest = internalAction({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    requestNumber: v.string(),
    duration: v.number(),
    guests: v.number(),
    budget: v.number(),
    destination: v.string(),
    requestDetails: v.any(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      // Buscar email do master nas variáveis de ambiente ou usar padrão
      const masterEmail = process.env.MASTER_EMAIL || "master@tucanoronha.com";
      
      const emailData: PackageRequestReceivedEmailData = {
        type: "package_request_received",
        to: masterEmail,
        subject: `[MASTER] Nova Solicitação de Pacote - #${args.requestNumber} - ${args.customerName}`,
        customerName: args.customerName,
        requestNumber: args.requestNumber,
        duration: args.duration,
        guests: args.guests,
        budget: args.budget,
        destination: args.destination,
        requestDetails: {
          ...args.requestDetails,
          customerEmail: args.customerEmail,
          isForMaster: true,
        },
      };

      const result = await sendQuickEmail(emailData);
      
      // Salvar log no banco de dados
      if (result.id) {
        await ctx.runMutation(internal.domains.email.mutations.logEmail, {
          type: result.type,
          to: result.to,
          subject: result.subject,
          status: result.status,
          error: result.error,
          sentAt: result.sentAt,
        });
      }

      return {
        success: result.status === "sent",
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to notify master about new package request:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

/**
 * Enviar email de boas-vindas para novos usuários
 */
export const sendWelcomeEmail = internalAction({
  args: {
    userEmail: v.string(),
    userName: v.string(),
    userRole: v.union(
      v.literal("traveler"),
      v.literal("partner"),
      v.literal("employee"),
      v.literal("master")
    ),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const emailData: WelcomeNewUserEmailData = {
        type: "welcome_new_user",
        to: args.userEmail,
        subject: `Bem-vindo ao Tucano Noronha, ${args.userName}! 🏝️`,
        userName: args.userName,
        userEmail: args.userEmail,
        userRole: args.userRole,
      };

      const result = await sendQuickEmail(emailData);
      
      // Salvar log no banco de dados
      if (result.id) {
        await ctx.runMutation(internal.domains.email.mutations.logEmail, {
          type: result.type,
          to: result.to,
          subject: result.subject,
          status: result.status,
          error: result.error,
          sentAt: result.sentAt,
        });
      }

      return {
        success: result.status === "sent",
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

/**
 * Enviar notificação de mensagem de suporte
 */
export const sendSupportNotificationEmail = internalAction({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    messageSubject: v.string(),
    messageContent: v.string(),
    category: v.string(),
    isUrgent: v.boolean(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const supportEmail = process.env.SUPPORT_EMAIL || "suporte@tucanoronha.com";
      
      const emailData: SupportMessageEmailData = {
        type: "support_message",
        to: supportEmail,
        subject: `${args.isUrgent ? '[URGENTE] ' : ''}Nova Mensagem de Suporte - ${args.messageSubject}`,
        customerName: args.customerName,
        customerEmail: args.customerEmail,
        messageSubject: args.messageSubject,
        messageContent: args.messageContent,
        category: args.category,
        isUrgent: args.isUrgent,
        priority: args.isUrgent ? "high" : "normal",
      };

      const result = await sendQuickEmail(emailData);
      
      // Salvar log no banco de dados
      if (result.id) {
        await ctx.runMutation(internal.domains.email.mutations.logEmail, {
          type: result.type,
          to: result.to,
          subject: result.subject,
          status: result.status,
          error: result.error,
          sentAt: result.sentAt,
        });
      }

      return {
        success: result.status === "sent",
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to send support notification email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

/**
 * Ação para testar o serviço de email
 */
export const testEmailService = action({
  args: {
    testEmail: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      const emailData: WelcomeNewUserEmailData = {
        type: "welcome_new_user",
        to: args.testEmail,
        subject: "Teste do Sistema de Email - Tucano Noronha",
        userName: "Usuário Teste",
        userEmail: args.testEmail,
        userRole: "traveler",
      };

      const result = await sendQuickEmail(emailData);
      
      return {
        success: result.status === "sent",
        message: result.status === "sent" 
          ? "Email de teste enviado com sucesso!" 
          : `Falha ao enviar email: ${result.error}`,
      };
    } catch (error) {
      console.error("Failed to send test email:", error);
      return {
        success: false,
        message: `Erro no teste: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },
});

/**
 * Enviar email de atualização de status de reserva
 */
export const sendBookingStatusUpdateEmail = internalAction({
  args: {
    customerEmail: v.string(),
    customerName: v.string(),
    assetName: v.string(),
    bookingType: v.union(
      v.literal("activity"),
      v.literal("event"), 
      v.literal("restaurant"),
      v.literal("vehicle"),
      v.literal("accommodation")
    ),
    confirmationCode: v.string(),
    newStatus: v.string(), // "confirmed", "cancelled"
    message: v.string(),
    refundAmount: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const statusMap: Record<string, string> = {
        confirmed: "Confirmada",
        cancelled: "Cancelada",
      };

      const subject = `Reserva ${statusMap[args.newStatus] || "Atualizada"} - ${args.assetName} - Código: ${args.confirmationCode}`;

      const emailData = {
        type: "booking_status_update" as const,
        to: args.customerEmail,
        subject,
        customerName: args.customerName,
        assetName: args.assetName,
        bookingType: args.bookingType,
        confirmationCode: args.confirmationCode,
        newStatus: args.newStatus,
        statusMessage: args.message,
        refundAmount: args.refundAmount,
      };

      const result = await sendQuickEmail(emailData);
      
      // Salvar log no banco de dados
      if (result.id) {
        await ctx.runMutation(internal.domains.email.mutations.logEmail, {
          type: result.type,
          to: result.to,
          subject: result.subject,
          status: result.status,
          error: result.error,
          sentAt: result.sentAt,
        });
      }

      return {
        success: result.status === "sent",
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to send booking status update email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
}); 