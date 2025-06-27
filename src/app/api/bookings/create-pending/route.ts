import { NextRequest, NextResponse } from "next/server";
import { ConvexError } from "convex/values";
import { api } from "../../../../../convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Get auth session from Clerk
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Get the Convex user ID
    const convexUserId = await fetchQuery(api.domains.users.queries.getUserByClerkId, {
      clerkId: clerkUserId,
    });

    if (!convexUserId) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const { assetType, assetId, bookingData } = body;

    if (!assetType || !assetId || !bookingData) {
      return NextResponse.json(
        { error: "Dados de reserva inválidos" },
        { status: 400 }
      );
    }

    // Generate confirmation code
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = Date.now();

    let reservationId: string;

    // Create pending reservation based on asset type
    switch (assetType) {
      case "activity":
        reservationId = await fetchMutation(api.domains.bookings.mutations.createActivityBookingFromPaymentLink, {
          activityId: assetId,
          sessionId: `pending_${Date.now()}`, // Temporary session ID
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: "stripe_payment_link",
          totalPrice: bookingData.totalPrice || 0,
          customerInfo: bookingData.customerInfo,
          confirmationCode,
          createdAt: now,
          updatedAt: now,
        });
        break;

      case "event":
        reservationId = await fetchMutation(api.domains.bookings.mutations.createEventBookingFromPaymentLink, {
          eventId: assetId,
          sessionId: `pending_${Date.now()}`,
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: "stripe_payment_link",
          totalPrice: bookingData.totalPrice || 0,
          customerInfo: bookingData.customerInfo,
          confirmationCode,
          createdAt: now,
          updatedAt: now,
        });
        break;

      case "restaurant":
        reservationId = await fetchMutation(api.domains.bookings.mutations.createRestaurantReservationFromPaymentLink, {
          restaurantId: assetId,
          sessionId: `pending_${Date.now()}`,
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: "stripe_payment_link",
          totalPrice: bookingData.totalPrice || 0,
          customerInfo: bookingData.customerInfo,
          confirmationCode,
          createdAt: now,
          updatedAt: now,
        });
        break;

      case "vehicle":
        // TODO: Implement vehicle booking mutations
        return NextResponse.json(
          { error: "Reservas de veículos via payment link ainda não implementadas" },
          { status: 501 }
        );

      case "accommodation":
        // TODO: Implement accommodation booking mutations
        return NextResponse.json(
          { error: "Reservas de hospedagem via payment link ainda não implementadas" },
          { status: 501 }
        );

      default:
        return NextResponse.json(
          { error: "Tipo de asset não suportado" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      reservationId,
      confirmationCode,
    });

  } catch (error: any) {
    console.error("Erro ao criar reserva pendente:", error);
    
    if (error instanceof ConvexError) {
      return NextResponse.json(
        { error: error.data || "Erro interno do Convex" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 