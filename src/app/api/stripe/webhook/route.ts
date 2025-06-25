import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

export const runtime = "nodejs";

// Initialize Convex client for server-side operations
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  let event: Stripe.Event;
  const bodyText = await req.text();

  try {
    event = stripe.webhooks.constructEvent(bodyText, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("💰 PaymentIntent succeeded:", intent.id);
        
        const { bookingType, bookingData } = intent.metadata;
        
        if (!bookingType || !bookingData) {
          console.error("Missing booking metadata in PaymentIntent:", intent.id);
          break;
        }

        // Parse booking data
        const parsedBookingData = JSON.parse(bookingData);
        
        // Create booking based on type
        await createBookingAfterPayment(bookingType, parsedBookingData, intent.id);
        
        console.log(`✅ Booking created for PaymentIntent: ${intent.id}`);
        break;
      }
      
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("❌ PaymentIntent failed:", intent.id);
        
        // Optional: Log failed payment attempt or send notification
        // No booking is created on payment failure
        break;
      }
      
      case "payment_intent.canceled": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("🚫 PaymentIntent canceled:", intent.id);
        
        // Optional: Log canceled payment attempt
        // Could be useful for understanding user behavior
        break;
      }
      
      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        console.log("⚠️ Chargeback/Dispute created:", dispute.id);
        
        // TODO: Notify administrators about dispute
        // TODO: Mark related booking as disputed if found
        // For now, just log the event
        break;
      }
      
      case "refund.created": {
        const refund = event.data.object as Stripe.Refund;
        console.log("💸 Refund created:", refund.id);
        
        // TODO: Update booking payment status to "refunded"
        // TODO: Send refund confirmation email to customer
        // For now, just log the event
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
 * Create booking after successful payment
 */
async function createBookingAfterPayment(
  bookingType: string, 
  bookingData: any, 
  paymentIntentId: string
) {
  try {
    // Add payment information to booking data
    // Important: Booking status is "pending" - requires partner/employee confirmation
    // Payment status is "paid" - payment was processed successfully
    const bookingWithPayment = {
      ...bookingData,
      status: "pending", // ✅ Aguarda confirmação do partner/employee
      paymentStatus: "paid", // ✅ Pagamento foi processado com sucesso
      paymentMethod: "credit_card",
      paymentIntentId,
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