'use client';

import { useState, useEffect } from "react";
import { StripeProvider } from "@/components/payments/StripeProvider";
import BookingPaymentForm, { BookingPaymentFormProps } from "@/components/payments/BookingPaymentForm";
import { toast } from "sonner";

interface PaymentWrapperProps extends Omit<BookingPaymentFormProps, 'clientSecret' | 'paymentIntentId'> {
  // Todas as props do BookingPaymentForm exceto clientSecret e paymentIntentId
}

export default function PaymentWrapper(props: PaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createPaymentIntent() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: props.amountCents, 
            customerId: props.customerId,
            bookingType: props.bookingType,
            bookingData: props.bookingData,
            metadata: {
              source: "booking_form",
              timestamp: new Date().toISOString(),
              flow: "reservation_system",
            }
          }),
        });

        const data = await res.json();
        
        if (!res.ok || data.error) {
          throw new Error(data.error ?? "Erro ao gerar pagamento");
        }

        if (!data.clientSecret || !data.paymentIntentId) {
          throw new Error("Resposta inválida do servidor");
        }

        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (err: any) {
        console.error("Erro ao criar PaymentIntent:", err);
        setError(err.message ?? "Erro ao inicializar pagamento");
        toast.error("Erro ao inicializar pagamento", {
          description: err.message ?? "Tente novamente em alguns instantes"
        });
      } finally {
        setLoading(false);
      }
    }

    createPaymentIntent();
  }, [props.amountCents, props.bookingType, props.customerId]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-gray-600">Preparando pagamento...</p>
      </div>
    );
  }

  // Error state
  if (error || !clientSecret || !paymentIntentId) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">Erro ao carregar pagamento</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Success - render payment form
  return (
    <StripeProvider clientSecret={clientSecret}>
      <BookingPaymentForm 
        {...props}
        clientSecret={clientSecret}
        paymentIntentId={paymentIntentId}
      />
    </StripeProvider>
  );
} 