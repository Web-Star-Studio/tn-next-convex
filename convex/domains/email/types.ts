"use node";

import { Id } from "../../_generated/dataModel";

// Tipos de email que o sistema pode enviar
export type EmailType = 
  | "booking_confirmation" 
  | "booking_cancelled"
  | "booking_status_update"  // ✅ Novo tipo adicionado
  | "booking_reminder"
  | "package_request_received"
  | "package_request_status_update"
  | "partner_new_booking"
  | "welcome_new_user"
  | "new_partner_registration"
  | "employee_invitation"
  | "support_message"
  | "payment_confirmation"
  | "payment_failed"
  | "review_request";

// Interface base para dados de email
export interface BaseEmailData {
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  priority?: "low" | "normal" | "high";
}

// Dados específicos para cada tipo de email
export interface BookingConfirmationEmailData extends BaseEmailData {
  type: "booking_confirmation";
  customerName: string;
  assetName: string;
  bookingType: "activity" | "event" | "restaurant" | "vehicle" | "accommodation";
  confirmationCode: string;
  bookingDate: string;
  totalPrice?: number;
  partnerName?: string;
  partnerEmail?: string;
  bookingDetails: any;
}

export interface BookingCancelledEmailData extends BaseEmailData {
  type: "booking_cancelled";
  customerName: string;
  assetName: string;
  bookingType: "activity" | "event" | "restaurant" | "vehicle" | "accommodation";
  confirmationCode: string;
  reason?: string;
  refundAmount?: number;
}

export interface BookingStatusUpdateEmailData extends BaseEmailData {
  type: "booking_status_update";
  customerName: string;
  assetName: string;
  bookingType: "activity" | "event" | "restaurant" | "vehicle" | "accommodation";
  confirmationCode: string;
  newStatus: string;
  statusMessage: string;
  refundAmount?: number;
}

export interface PackageRequestReceivedEmailData extends BaseEmailData {
  type: "package_request_received";
  customerName: string;
  requestNumber: string;
  duration: number;
  guests: number;
  budget: number;
  destination: string;
  requestDetails: any;
}

export interface PackageRequestStatusUpdateEmailData extends BaseEmailData {
  type: "package_request_status_update";
  customerName: string;
  requestNumber: string;
  newStatus: string;
  statusMessage?: string;
  proposalDetails?: string;
}

export interface PartnerNewBookingEmailData extends BaseEmailData {
  type: "partner_new_booking";
  partnerName: string;
  customerName: string;
  assetName: string;
  bookingType: "activity" | "event" | "restaurant" | "vehicle" | "accommodation";
  confirmationCode: string;
  bookingDate: string;
  totalPrice?: number;
  customerContact: {
    email: string;
    phone: string;
  };
  bookingDetails: any;
}

export interface WelcomeNewUserEmailData extends BaseEmailData {
  type: "welcome_new_user";
  userName: string;
  userEmail: string;
  userRole: "traveler" | "partner" | "employee" | "master";
}

export interface NewPartnerRegistrationEmailData extends BaseEmailData {
  type: "new_partner_registration";
  partnerName: string;
  partnerEmail: string;
  businessName?: string;
  registrationDate: string;
}

export interface EmployeeInvitationEmailData extends BaseEmailData {
  type: "employee_invitation";
  employeeName: string;
  organizationName: string;
  inviterName: string;
  inviteCode?: string;
}

export interface SupportMessageEmailData extends BaseEmailData {
  type: "support_message";
  customerName: string;
  customerEmail: string;
  messageSubject: string;
  messageContent: string;
  category: string;
  isUrgent: boolean;
}

// União de todos os tipos de dados de email
export type EmailData = 
  | BookingConfirmationEmailData
  | BookingCancelledEmailData
  | BookingStatusUpdateEmailData  // ✅ Novo tipo adicionado
  | PackageRequestReceivedEmailData
  | PackageRequestStatusUpdateEmailData
  | PartnerNewBookingEmailData
  | WelcomeNewUserEmailData
  | NewPartnerRegistrationEmailData
  | EmployeeInvitationEmailData
  | SupportMessageEmailData;

// Configuração de email
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
}

// Log de email
export interface EmailLog {
  id?: Id<"emailLogs">;
  type: EmailType;
  to: string;
  subject: string;
  status: "sent" | "failed" | "pending";
  error?: string;
  sentAt?: number;
  createdAt: number;
} 