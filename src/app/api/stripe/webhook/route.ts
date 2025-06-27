import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api, internal } from "../../../../../convex/_generated/api";

export const runtime = "nodejs";

// Initialize Convex client for server-side operations
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "Stripe webhook endpoint is running" 
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.log(`❌ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  console.log(`📥 Stripe Webhook: ${event.type}`);

  try {
    switch (event.type) {
      case "payment_intent.created": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("📝 PaymentIntent created:", intent.id);
        console.log("💰 Amount:", intent.amount, intent.currency);
        console.log("📊 Status:", intent.status);
        console.log("🔒 Capture method:", intent.capture_method);
        break;
      }
      
      case "payment_intent.requires_action": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("🔐 PaymentIntent requires action:", intent.id);
        // Customer needs to complete 3D Secure or similar authentication
        break;
      }

      case "payment_intent.processing": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("⏳ PaymentIntent processing:", intent.id);
        break;
      }
      
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("💰 PaymentIntent succeeded:", intent.id);
        console.log("🔒 Capture method:", intent.capture_method);
        console.log("💳 Status:", intent.status);
        
        const { bookingType, bookingData, flow } = intent.metadata;
        
        if (!bookingType || !bookingData) {
          console.error("Missing booking metadata in PaymentIntent:", intent.id);
          break;
        }

        // Parse booking data
        const parsedBookingData = JSON.parse(bookingData);
        
        if (flow === "reservation_system") {
          if (intent.capture_method === "manual") {
            // ✅ AUTHORIZED (not captured) - Create pending reservation
            console.log(`🔄 Autorização bem-sucedida (manual capture): ${intent.id}`);
            await createBookingAfterAuthorization(bookingType, parsedBookingData, intent.id);
          } else {
            // ✅ CAPTURED automatically - Create confirmed reservation (legacy flow)
            console.log(`🔄 Pagamento capturado automaticamente: ${intent.id}`);
            await createBookingAfterPayment(bookingType, parsedBookingData, intent.id);
          }
        } else {
          // Legacy flow - maintain backward compatibility
          await createBookingAfterPayment(bookingType, parsedBookingData, intent.id);
        }
        
        console.log(`✅ Booking processed for PaymentIntent: ${intent.id}`);
        break;
      }

      case "payment_intent.amount_capturable_updated": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("📊 Amount capturable updated:", intent.id, "Capturable:", intent.amount_capturable);
        break;
      }
      
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("❌ PaymentIntent failed:", intent.id);
        
        // Optional: Update booking status to failed if it exists
        const { bookingType, bookingData } = intent.metadata;
        if (bookingType && bookingData) {
          // Could implement booking failure handling here
          console.log("💔 Payment failed for booking - no reservation created");
        }
        break;
      }
      
      case "payment_intent.canceled": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("🚫 PaymentIntent canceled:", intent.id);
        
        // Optional: Handle cancellation - could be partner canceling before confirmation
        const { bookingType, bookingData } = intent.metadata;
        if (bookingType && bookingData) {
          console.log("🚫 Payment canceled - handling cancellation logic");
        }
        break;
      }

      // Refund events
      case "refund.created": {
        const refund = event.data.object as Stripe.Refund;
        console.log("💸 Refund created:", refund.id);
        console.log("💰 Amount:", refund.amount, refund.currency);
        console.log("📊 Status:", refund.status);
        
        // Update booking refund status if metadata available
        const bookingId = refund.metadata?.bookingId;
        const bookingType = refund.metadata?.bookingType;
        if (bookingId && bookingType) {
          console.log(`🔄 Updating refund status for booking ${bookingId}`);
          // This will be called from the refund action, so we don't need to do it here
        }
        break;
      }

      case "refund.updated": {
        const refund = event.data.object as Stripe.Refund;
        console.log("💸 Refund updated:", refund.id, "Status:", refund.status);
        
        // Update final refund status
        const bookingId = refund.metadata?.bookingId;
        const bookingType = refund.metadata?.bookingType;
        if (bookingId && bookingType && refund.status === "succeeded") {
          await convex.mutation(api.domains.bookings.mutations.updateBookingRefundStatus, {
            bookingId,
            bookingType,
            refundId: refund.id,
            refundStatus: refund.status,
          });
        }
        break;
      }

      // Payment Link events
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("💳 Checkout session completed:", session.id);
        console.log("💰 Amount:", session.amount_total, session.currency);
        console.log("🎯 Payment status:", session.payment_status);
        
        // Check if this came from a payment link for asset reservation
        const { assetType, assetId, flow } = session.metadata || {};
        
        if (flow === "asset_reservation" && assetType && assetId) {
          await createReservationFromPaymentLink(session, assetType, assetId);
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * Create booking after successful authorization (manual capture)
 * Status: "pending" - requires partner confirmation to capture payment
 */
async function createBookingAfterAuthorization(
  bookingType: string, 
  bookingData: any, 
  paymentIntentId: string
) {
  try {
    console.log(`🔄 Creating ${bookingType} booking after authorization:`, paymentIntentId);

    switch (bookingType) {
      case "activity":
        await convex.mutation(api.domains.bookings.mutations.createActivityBookingWithPayment, {
          activityId: bookingData.activityId,
          userId: bookingData.userId,
          ticketId: bookingData.ticketId || undefined,
          date: bookingData.date,
          time: bookingData.time,
          participants: bookingData.participants,
          paymentIntentId,
          paymentCaptured: false, // Authorized but not captured
          totalPrice: bookingData.totalPrice,
          customerInfo: bookingData.customerInfo,
          specialRequests: bookingData.specialRequests || undefined,
        });
        break;
      
      case "event":
        await convex.mutation(api.domains.bookings.mutations.createEventBookingWithPayment, {
          eventId: bookingData.eventId,
          userId: bookingData.userId,
          ticketId: bookingData.ticketId || undefined,
          quantity: bookingData.quantity,
          paymentIntentId,
          paymentCaptured: false, // Authorized but not captured
          totalPrice: bookingData.totalPrice,
          customerInfo: bookingData.customerInfo,
          specialRequests: bookingData.specialRequests || undefined,
        });
        break;
      
      case "vehicle":
        // TODO: Create createVehicleBookingWithPayment mutation
        console.warn("Vehicle booking with payment not implemented yet");
        break;
      
      case "accommodation":
        // TODO: Create createAccommodationBookingWithPayment mutation
        console.warn("Accommodation booking with payment not implemented yet");
        break;
      
      case "restaurant":
        // TODO: Create createRestaurantReservationWithPayment mutation
        console.warn("Restaurant reservation with payment not implemented yet");
        break;
      
      default:
        throw new Error(`Unknown booking type: ${bookingType}`);
    }

    console.log(`✅ ${bookingType} booking created successfully with payment authorization`);
  } catch (error) {
    console.error(`Failed to create ${bookingType} booking after authorization:`, error);
    throw error;
  }
}

/**
 * Create booking after successful payment (legacy flow - automatic capture)
 * Status: "pending" - requires partner confirmation (legacy behavior)
 */
async function createBookingAfterPayment(
  bookingType: string, 
  bookingData: any, 
  paymentIntentId: string
) {
  try {
    // Add payment information to booking data
    // Important: Booking status is "pending" - requires partner/employee confirmation
    // Payment status is "paid" - payment was processed and captured successfully
    const bookingWithPayment = {
      ...bookingData,
      status: "pending", // ✅ Aguarda confirmação do partner/employee
      paymentStatus: "paid", // ✅ Pagamento foi processado e capturado com sucesso
      paymentMethod: "credit_card",
      paymentIntentId,
      paymentCaptured: true, // ✅ Already captured
    };

    switch (bookingType) {
      case "activity":
        await convex.mutation(api.domains.bookings.mutations.createActivityBooking, bookingWithPayment);
        break;
      
      case "event":
        await convex.mutation(api.domains.bookings.mutations.createEventBooking, bookingWithPayment);
        break;
      
      case "vehicle":
        await convex.mutation(api.domains.bookings.mutations.createVehicleBooking, bookingWithPayment);
        break;
      
      case "accommodation":
        await convex.mutation(api.domains.accommodations.mutations.createAccommodationBooking, bookingWithPayment);
        break;
      
      case "package":
        await convex.mutation(api.domains.packages.mutations.createPackageBooking, bookingWithPayment);
        break;
      
      case "restaurant":
        await convex.mutation(api.domains.restaurants.mutations.createRestaurantReservation, bookingWithPayment);
        break;
      
      default:
        throw new Error(`Unknown booking type: ${bookingType}`);
    }
  } catch (error) {
    console.error(`Failed to create ${bookingType} booking:`, error);
    throw error;
  }
}

/**
 * Create reservation after successful payment via Payment Link
 * Status: "paid" - payment was successful, now ready for partner confirmation
 */
async function createReservationFromPaymentLink(
  session: Stripe.Checkout.Session,
  assetType: string,
  assetId: string
) {
  try {
    console.log(`🔄 Creating ${assetType} reservation from payment link:`, session.id);

    if (session.payment_status !== "paid") {
      console.warn(`Payment not completed for session: ${session.id}`);
      return;
    }

    // Get customer information from session
    const customerInfo = {
      name: session.customer_details?.name || "Cliente",
      email: session.customer_details?.email || "",
      phone: session.customer_details?.phone || "",
    };

    // Basic reservation data
    const baseReservationData = {
      status: "paid", // Payment is done, but still needs partner confirmation
      paymentStatus: "paid",
      paymentMethod: "credit_card",
      totalPrice: (session.amount_total || 0) / 100, // Convert cents to currency
      customerInfo,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      // Generate confirmation code
      confirmationCode: `${assetType.toUpperCase().substring(0,3)}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
    };

    // Call appropriate booking mutation based on asset type
    switch (assetType) {
      case "activity":
        await convex.mutation(api.domains.bookings.mutations.createActivityBookingFromPaymentLink, {
          activityId: assetId,
          sessionId: session.id,
          ...baseReservationData,
        });
        break;
      
      case "event":
        await convex.mutation(api.domains.bookings.mutations.createEventBookingFromPaymentLink, {
          eventId: assetId,
          sessionId: session.id,
          ...baseReservationData,
        });
        break;
      
      case "restaurant":
        await convex.mutation(api.domains.bookings.mutations.createRestaurantReservationFromPaymentLink, {
          restaurantId: assetId,
          sessionId: session.id,
          ...baseReservationData,
        });
        break;
      
      case "vehicle":
        await convex.mutation(api.domains.bookings.mutations.createVehicleBookingFromPaymentLink, {
          vehicleId: assetId,
          sessionId: session.id,
          ...baseReservationData,
        });
        break;
      
      case "accommodation":
        await convex.mutation(api.domains.bookings.mutations.createAccommodationBookingFromPaymentLink, {
          accommodationId: assetId,
          sessionId: session.id,
          ...baseReservationData,
        });
        break;
      
      default:
        throw new Error(`Unknown asset type: ${assetType}`);
    }

    console.log(`✅ ${assetType} reservation created successfully from payment link`);
  } catch (error) {
    console.error(`Failed to create ${assetType} reservation from payment link:`, error);
    throw error;
  }
} 