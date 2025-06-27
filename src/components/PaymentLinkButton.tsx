"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, CreditCard } from "lucide-react";

interface PaymentLinkButtonProps {
  assetName: string;
  assetType: "activity" | "event" | "restaurant" | "vehicle" | "accommodation";
  price: number;
  stripePaymentLinkUrl?: string;
  isActive?: boolean;
  onReserveClick?: () => void;
  children?: React.ReactNode;
}

export function PaymentLinkButton({
  assetName,
  assetType,
  price,
  stripePaymentLinkUrl,
  isActive = true,
  onReserveClick,
  children,
}: PaymentLinkButtonProps) {
  const handleReserveClick = () => {
    // Call custom handler if provided
    if (onReserveClick) {
      onReserveClick();
    }

    // Redirect to Stripe Payment Link if available
    if (stripePaymentLinkUrl && isActive) {
      // Open in same tab for better UX
      window.location.href = stripePaymentLinkUrl;
    } else {
      console.warn("Payment link não disponível ou asset inativo");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getButtonText = () => {
    if (!isActive) return "Indisponível";
    if (!stripePaymentLinkUrl) return "Configurar Pagamento";
    
    switch (assetType) {
      case "activity":
        return "Reservar Atividade";
      case "event":
        return "Comprar Ingresso";
      case "restaurant":
        return "Fazer Reserva";
      case "vehicle":
        return "Alugar Veículo";
      case "accommodation":
        return "Reservar Hospedagem";
      default:
        return "Reservar";
    }
  };

  return (
    <div className="space-y-4">
      {/* Price Display */}
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {formatPrice(price)}
        </div>
        <div className="text-sm text-gray-600">
          por {assetType === "accommodation" ? "noite" : 
              assetType === "vehicle" ? "dia" : 
              assetType === "restaurant" ? "reserva" : "pessoa"}
        </div>
      </div>

      {/* Reserve Button */}
      <Button
        onClick={handleReserveClick}
        disabled={!isActive || !stripePaymentLinkUrl}
        className="w-full"
        size="lg"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        {getButtonText()}
        {stripePaymentLinkUrl && <ExternalLink className="ml-2 h-4 w-4" />}
      </Button>

      {/* Custom content */}
      {children}

      {/* Info Text */}
      <div className="text-xs text-gray-500 text-center">
        {stripePaymentLinkUrl ? (
          <>
            ✅ Pagamento seguro via Stripe<br />
            Você será redirecionado para completar o pagamento
          </>
        ) : (
          "⚠️ Sistema de pagamento em configuração"
        )}
      </div>

      {/* Status Indicators */}
      {!isActive && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center">
          <span className="text-red-600 text-sm">
            ❌ {assetName} está temporariamente indisponível
          </span>
        </div>
      )}

      {isActive && !stripePaymentLinkUrl && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-center">
          <span className="text-yellow-600 text-sm">
            ⚠️ Sistema de pagamento em configuração
          </span>
        </div>
      )}
    </div>
  );
}

// Componente de exemplo de uso
export function PaymentLinkExample() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Mergulho com Tartarugas</h3>
      
      <PaymentLinkButton
        assetName="Mergulho com Tartarugas"
        assetType="activity"
        price={150}
        stripePaymentLinkUrl="https://buy.stripe.com/test_example_link"
        isActive={true}
        onReserveClick={() => {
          console.log("Analytics: Usuário clicou para reservar");
          // Aqui você pode adicionar analytics, logs, etc.
        }}
      >
        {/* Conteúdo adicional personalizado */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Duração: 3 horas</p>
          <p>• Inclui equipamentos</p>
          <p>• Máximo 6 pessoas</p>
        </div>
      </PaymentLinkButton>
    </div>
  );
} 