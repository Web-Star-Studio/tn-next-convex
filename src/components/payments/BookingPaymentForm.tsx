'use client';

import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface BookingPaymentFormProps {
  amountCents: number;
  bookingType: "activity" | "event" | "vehicle" | "accommodation" | "package" | "restaurant";
  bookingData: any;
  onSuccess: (paymentIntentId: string) => Promise<void> | void;
  customerId?: string;
}

export default function BookingPaymentForm({ 
  amountCents, 
  bookingType,
  bookingData,
  onSuccess, 
  customerId 
}: BookingPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  // Check if Stripe is properly configured
  if (!stripe && !elements) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">Pagamento não disponível no momento.</p>
        <p className="text-sm text-gray-500">Configure as chaves do Stripe para habilitar pagamentos.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Sistema de pagamento não está disponível");
      return;
    }

    try {
      setLoading(true);

      // Create Payment Intent with booking metadata
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: amountCents, 
          customerId,
          bookingType,
          bookingData,
          metadata: {
            source: "booking_form",
            timestamp: new Date().toISOString(),
          }
        }),
      });

      const { clientSecret, error } = await res.json();
      if (!clientSecret || error) {
        throw new Error(error ?? "Erro ao gerar pagamento");
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });

      if (confirmError) {
        throw confirmError;
      }

      toast.success("Pagamento aprovado!");
      
      // Important: Don't create booking here - webhook will handle it
      // Just call success callback for UI updates
      await onSuccess(paymentIntent!.id);
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Erro no pagamento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element from Stripe */}
      <PaymentElement options={{ layout: "tabs" }} />
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Processando..." : "Pagar agora"}
      </Button>
    </form>
  );
} 