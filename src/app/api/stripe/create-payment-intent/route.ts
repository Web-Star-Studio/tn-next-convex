import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Expected payload: { 
//   amount: number; 
//   currency?: string; 
//   customerId?: string; 
//   bookingType: "activity" | "event" | "vehicle" | "accommodation" | "package";
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

    // Create Payment Intent with booking metadata
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      metadata: {
        // Core booking information for webhook processing
        bookingType,
        bookingData: JSON.stringify(bookingData),
        // Additional metadata
        ...metadata,
      },
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (error: any) {
    console.error("Stripe PI Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 