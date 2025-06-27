import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

// Expected payload: { 
//   amount: number; 
//   currency?: string; 
//   customerId?: string; 
//   bookingType: "activity" | "event" | "vehicle" | "accommodation" | "restaurant";
//   bookingData: any;
//   metadata?: any 
// }
export async function POST(req: NextRequest) {
  try {
    const { 
      amount, 
      currency = "brl", 
      customerId, 
      bookingType,
      bookingData,
      metadata 
    } = await req.json();

    if (!amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Invalid or missing amount (in cents)" },
        { status: 400 }
      );
    }

    if (!bookingType || !bookingData) {
      return NextResponse.json(
        { error: "Missing bookingType or bookingData" },
        { status: 400 }
      );
    }

    // Create Payment Intent with MANUAL CAPTURE for reservation system
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      capture_method: "manual", // 🔥 KEY CHANGE: Manual capture para autorizar sem capturar
      metadata: {
        // Core booking information for webhook processing
        bookingType,
        bookingData: JSON.stringify(bookingData),
        flow: "reservation_system", // Identifier for webhook logic
        // Additional metadata
        ...metadata,
      },
    });

    console.log(`💳 PaymentIntent criado com captura manual: ${intent.id}`);

    return NextResponse.json({ 
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    });
  } catch (error: any) {
    console.error("Stripe PI Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 