"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentLinkBookingButtonProps {
  assetType: "activity" | "event" | "restaurant" | "vehicle" | "accommodation";
  assetId: string;
  assetName: string;
  price: number;
  stripePaymentLinkUrl?: string;
  bookingData: any;
  onBookingCreate?: (bookingId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PaymentLinkBookingButton({
  assetType,
  assetId,
  assetName,
  price,
  stripePaymentLinkUrl,
  bookingData,
  onBookingCreate,
  isLoading = false,
  disabled = false,
  className = "",
  children,
}: PaymentLinkBookingButtonProps) {
  const [redirecting, setRedirecting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getButtonText = () => {
    if (redirecting) return "Redirecionando...";
    if (isLoading) return "Preparando...";
    
    switch (assetType) {
      case "activity":
        return `Reservar por ${formatPrice(price)}`;
      case "event":
        return `Comprar ingresso por ${formatPrice(price)}`;
      case "restaurant":
        return `Fazer reserva por ${formatPrice(price)}`;
      case "vehicle":
        return `Alugar por ${formatPrice(price)}`;
      case "accommodation":
        return `Reservar por ${formatPrice(price)}`;
      default:
        return `Reservar por ${formatPrice(price)}`;
    }
  };

  const getIcon = () => {
    if (redirecting || isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    return <CreditCard className="w-4 h-4" />;
  };

  const createPendingReservation = async () => {
    try {
      const response = await fetch("/api/bookings/create-pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetType,
          assetId,
          bookingData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar reserva pendente");
      }

      return result.reservationId;
    } catch (error: any) {
      console.error("Erro ao criar reserva pendente:", error);
      throw error;
    }
  };

  const handleBookingClick = async () => {
    if (!stripePaymentLinkUrl) {
      toast.error("Payment link não disponível", {
        description: "Entre em contato com o suporte."
      });
      return;
    }

    try {
      setRedirecting(true);

      // Create pending reservation first
      const reservationId = await createPendingReservation();
      
      if (onBookingCreate) {
        onBookingCreate(reservationId);
      }

      toast.success("Redirecionando para pagamento...", {
        description: "Você será redirecionado para o Stripe em instantes."
      });

      // Add metadata to payment link URL
      const url = new URL(stripePaymentLinkUrl);
      url.searchParams.set("client_reference_id", reservationId);
      url.searchParams.set("prefilled_email", bookingData.customerInfo?.email || "");
      
      // Redirect to Stripe Payment Link
      setTimeout(() => {
        window.location.href = url.toString();
      }, 1000); // Small delay to show toast

    } catch (error: any) {
      console.error("Erro ao processar reserva:", error);
      toast.error("Erro ao processar reserva", {
        description: error.message || "Tente novamente."
      });
      setRedirecting(false);
    }
  };

  const isButtonDisabled = disabled || isLoading || redirecting || !stripePaymentLinkUrl;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Payment summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700">Total a pagar</p>
            <p className="text-lg font-semibold text-blue-900">{formatPrice(price)}</p>
          </div>
          <div className="text-blue-500">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Pagamento seguro processado pelo Stripe
        </p>
      </div>

      {/* Booking button */}
      <Button
        onClick={handleBookingClick}
        disabled={isButtonDisabled}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
      >
        <div className="flex items-center justify-center space-x-2">
          {getIcon()}
          <span>{children || getButtonText()}</span>
          {!isLoading && !redirecting && (
            <ExternalLink className="w-4 h-4 ml-1" />
          )}
        </div>
      </Button>

      {/* Info text */}
      {!stripePaymentLinkUrl && (
        <p className="text-xs text-center text-red-600">
          Sistema de pagamento não configurado para este item
        </p>
      )}
      
      {stripePaymentLinkUrl && (
        <p className="text-xs text-center text-gray-500">
          Você será redirecionado para uma página segura do Stripe para completar o pagamento
        </p>
      )}
    </div>
  );
} 