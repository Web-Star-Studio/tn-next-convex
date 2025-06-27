'use client';

import { useState, useEffect } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PaymentDebugInfo from "./PaymentDebugInfo";

export interface BookingPaymentFormProps {
  amountCents: number;
  bookingType: "activity" | "event" | "vehicle" | "accommodation" | "package" | "restaurant";
  bookingData: any;
  onSuccess: (paymentIntentId: string, authorizationOnly?: boolean) => Promise<void> | void;
  customerId?: string;
  clientSecret: string; // Agora é obrigatório
  paymentIntentId: string; // Agora é obrigatório
}

export default function BookingPaymentForm({ 
  amountCents, 
  bookingType,
  bookingData,
  onSuccess, 
  customerId,
  clientSecret,
  paymentIntentId
}: BookingPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const [elementError, setElementError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [loadErrorCount, setLoadErrorCount] = useState(0);

  const MAX_RETRIES = 2;
  const MAX_LOAD_ERRORS = 3; // Silent failures before showing error

  // Check if Stripe is properly configured - FIXED: Using OR instead of AND
  if (!stripe || !elements) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">Pagamento não disponível no momento.</p>
        <p className="text-sm text-gray-500">Configure as chaves do Stripe para habilitar pagamentos.</p>
      </div>
    );
  }

  // Enhanced PaymentElement load error handler
  const handleLoadError = (event: any) => {
    setLoadErrorCount(prev => prev + 1);
    
    // Check if this is a real error or just an empty event
    const hasErrorDetails = event && (
      event.error || 
      event.message || 
      event.code || 
      event.type ||
      Object.keys(event).length > 0
    );

    // Enhanced diagnostics
    const diagnostics = {
      event,
      eventType: typeof event,
      eventKeys: event ? Object.keys(event) : [],
      hasDetails: hasErrorDetails,
      loadErrorCount: loadErrorCount + 1,
      clientSecret: clientSecret ? "Present" : "Missing",
      clientSecretValid: clientSecret?.startsWith('pi_') || false,
      retryCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      online: navigator.onLine,
      referrer: document.referrer || 'Direct',
      cookies: document.cookie ? 'Present' : 'None',
      localStorage: (() => {
        try {
          return localStorage.length > 0 ? 'Available' : 'Empty';
        } catch {
          return 'Blocked';
        }
      })(),
    };

    // Only log detailed info in development or for real errors
    if (process.env.NODE_ENV === 'development' || hasErrorDetails) {
      console.warn('PaymentElement LoadError:', diagnostics);
    }

    // Only show user error after multiple empty load errors or real error
    if (hasErrorDetails || loadErrorCount >= MAX_LOAD_ERRORS) {
      const errorMessage = hasErrorDetails 
        ? "Erro ao carregar formulário de pagamento" 
        : "Problema de conectividade detectado";
        
      setElementError(errorMessage);
      setIsPaymentElementReady(false);
      
      // Only show toast for real errors or after multiple attempts
      if (hasErrorDetails || loadErrorCount >= MAX_LOAD_ERRORS) {
        toast.error(errorMessage, {
          description: hasErrorDetails 
            ? "Erro específico detectado. Tente novamente." 
            : "Verificando conectividade... Aguarde ou tente novamente."
        });
      }
    } else {
      // Silent handling for empty events - common with Stripe
      console.log(`Silent LoadError #${loadErrorCount + 1} (empty event) - not showing to user yet`);
    }
  };

  // Enhanced retry with better error reset
  const handleRetry = () => {
    if (retryCount >= MAX_RETRIES) {
      toast.error("Não foi possível carregar o pagamento após várias tentativas", {
        description: "Entre em contato com o suporte."
      });
      return;
    }

    setIsRetrying(true);
    setElementError(null);
    setIsPaymentElementReady(false);
    setLoadErrorCount(0); // Reset load error count on manual retry
    setRetryCount(prev => prev + 1);
    
    // Small delay before retry
    setTimeout(() => {
      setIsRetrying(false);
      toast.info(`Tentando novamente (${retryCount + 1}/${MAX_RETRIES})...`);
    }, 1000);
  };

  // Auto-retry for empty load errors (silent)
  useEffect(() => {
    if (loadErrorCount > 0 && loadErrorCount < MAX_LOAD_ERRORS && !elementError && !isRetrying) {
      const timer = setTimeout(() => {
        console.log(`Auto-retry #${loadErrorCount} for empty LoadError`);
        setLoadErrorCount(0);
        setIsPaymentElementReady(false);
        // Force remount by incrementing retry count
        setRetryCount(prev => prev + 0.1); // Small increment to trigger remount
      }, 2000); // Wait 2 seconds before auto-retry

      return () => clearTimeout(timer);
    }
  }, [loadErrorCount, elementError, isRetrying]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Enhanced validation to ensure all Stripe components are ready
    if (!stripe || !elements) {
      toast.error("Sistema de pagamento não está disponível");
      return;
    }

    // Check for element errors
    if (elementError) {
      toast.error("Problema com o formulário de pagamento", {
        description: "Tente recarregar a página ou entre em contato com o suporte."
      });
      return;
    }

    // Check if PaymentElement is ready
    if (!isPaymentElementReady) {
      toast.error("Aguarde o carregamento do formulário de pagamento");
      return;
    }

    try {
      setLoading(true);

      // Submit elements to ensure everything is valid
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Confirm the payment using the existing PaymentIntent
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });

      if (confirmError) {
        throw confirmError;
      }

      // Check payment status
      if (paymentIntent!.status === "succeeded") {
        if (paymentIntent!.capture_method === "manual") {
          // Authorization successful (not captured)
          toast.success("Pagamento autorizado! Aguardando confirmação do partner.", {
            description: `R$ ${(amountCents / 100).toFixed(2)} autorizados. Você receberá um email de confirmação.`
          });
          
          // Call success callback with authorization flag
          await onSuccess(paymentIntent!.id, true);
        } else {
          // Payment captured (legacy flow)
          toast.success("Pagamento aprovado!", {
            description: `R$ ${(amountCents / 100).toFixed(2)} pagos com sucesso.`
          });
          
          // Call success callback
          await onSuccess(paymentIntent!.id, false);
        }
      } else if (paymentIntent!.status === "requires_capture") {
        // Manual capture - payment authorized but not captured
        toast.success("Pagamento autorizado! Aguardando confirmação do partner.", {
          description: `R$ ${(amountCents / 100).toFixed(2)} autorizados. Você receberá um email de confirmação.`
        });
        
        // Call success callback with authorization flag
        await onSuccess(paymentIntent!.id, true);
      } else {
        // Unexpected status
        console.warn("Unexpected payment status:", paymentIntent!.status);
        toast.success("Solicitação enviada!", {
          description: "Aguardando confirmação do partner. Você receberá um email com o status."
        });
        
        await onSuccess(paymentIntent!.id, true);
      }
      
    } catch (err: any) {
      console.error("Payment Error:", err);
      
      // Enhanced error handling
      let errorMessage = "Erro no pagamento";
      let errorDescription = "Tente novamente ou use outro método de pagamento.";
      
      if (err.type === "card_error") {
        errorMessage = "Erro com o cartão";
        errorDescription = err.message || "Verifique os dados do cartão e tente novamente.";
      } else if (err.type === "validation_error") {
        errorMessage = "Dados inválidos";
        errorDescription = "Verifique as informações inseridas.";
      } else if (err.code === "payment_intent_authentication_failure") {
        errorMessage = "Falha na autenticação";
        errorDescription = "A autenticação do cartão falhou. Tente novamente.";
      }
      
      toast.error(errorMessage, { description: errorDescription });
    } finally {
      setLoading(false);
    }
  }

  // Show error state with retry option (only for real errors)
  if (elementError && !isRetrying) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="text-red-600">
          <div className="text-lg font-medium mb-2">❌ Erro no Pagamento</div>
          <p className="text-sm">{elementError}</p>
        </div>
        
        {retryCount < MAX_RETRIES && (
          <Button 
            onClick={handleRetry}
            variant="outline"
            className="w-full"
          >
            Tentar Novamente ({retryCount}/{MAX_RETRIES})
          </Button>
        )}
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>Possíveis soluções:</p>
          <ul className="list-disc list-inside text-left">
            <li>Verifique sua conexão com a internet</li>
            <li>Desative bloqueadores de anúncios temporariamente</li>
            <li>Tente usar outro navegador</li>
            <li>Recarregue a página</li>
          </ul>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-100 rounded">
            Debug: LoadErrors: {loadErrorCount}, Retries: {retryCount}
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Debug info for development */}
      <PaymentDebugInfo />
      
      {/* Payment Element from Stripe */}
      <div className="relative">
        {(isRetrying || (!isPaymentElementReady && loadErrorCount < MAX_LOAD_ERRORS)) && (
          <div className="absolute inset-0 bg-gray-50 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">
                {isRetrying ? "Recarregando..." : 
                 loadErrorCount > 0 ? "Reconectando..." : 
                 "Carregando formulário..."}
              </p>
              {process.env.NODE_ENV === 'development' && loadErrorCount > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  LoadErrors: {loadErrorCount}/{MAX_LOAD_ERRORS}
                </p>
              )}
            </div>
          </div>
        )}
        
        <PaymentElement 
          key={`payment-element-${Math.floor(retryCount)}`} // Force remount on retry
          options={{ 
            layout: "tabs",
            defaultValues: {
              // Clear values on retry to avoid stale data
              billingDetails: retryCount > 0 ? {} : undefined
            }
          }}
          onReady={() => {
            console.log("✅ PaymentElement is ready");
            setIsPaymentElementReady(true);
            setElementError(null);
            setLoadErrorCount(0); // Reset on successful load
          }}
          onChange={(event) => {
            if (event.complete) {
              setIsPaymentElementReady(true);
            }
            // Note: Validation errors are handled through other mechanisms in Stripe Elements
          }}
          onLoadError={handleLoadError}
          onLoaderStart={() => {
            console.log("🔄 PaymentElement loader started");
            setIsPaymentElementReady(false);
          }}
        />
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500">ℹ️</div>
          <div className="flex-1 text-sm">
            <p className="text-blue-900 font-medium">Sobre este pagamento:</p>
            <p className="text-blue-700 mt-1">
              Será feita uma autorização de <strong>R$ {(amountCents / 100).toFixed(2)}</strong> no seu cartão. 
              O valor só será cobrado após a confirmação do parceiro.
            </p>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || !elements || loading || !isPaymentElementReady || !!elementError || isRetrying} 
        className="w-full"
      >
        {loading ? "Processando..." : 
         isRetrying ? "Recarregando..." :
         (!isPaymentElementReady && loadErrorCount > 0) ? "Reconectando..." :
         !isPaymentElementReady ? "Carregando..." :
         elementError ? "Erro no formulário" :
         `Autorizar R$ ${(amountCents / 100).toFixed(2)}`}
      </Button>
    </form>
  );
} 