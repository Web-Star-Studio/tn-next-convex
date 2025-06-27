'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PropsWithChildren, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Validate that the Stripe publishable key is available and properly formatted
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Enhanced key validation
const validateStripeKey = (key: string | undefined): boolean => {
  if (!key) return false;
  
  // Check if key starts with the correct prefix
  if (!key.startsWith('pk_')) {
    console.error('Invalid Stripe key format. Key must start with "pk_"');
    return false;
  }
  
  // Check key length (Stripe keys are typically 107-108 characters)
  if (key.length < 100) {
    console.error('Stripe key appears to be too short');
    return false;
  }
  
  return true;
};

const isValidKey = validateStripeKey(stripePublishableKey);

if (!stripePublishableKey) {
  console.warn('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não está definida. Funcionalidades de pagamento não estarão disponíveis.');
} else if (!isValidKey) {
  console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY está malformada. Verifique a configuração.');
}

interface StripeProviderProps extends PropsWithChildren {
  clientSecret?: string;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Return early if no valid key
    if (!stripePublishableKey || !isValidKey) {
      setIsLoading(false);
      return;
    }

    const initializeStripe = async () => {
      try {
        setIsLoading(true);
        setStripeError(null);

        // Add timeout to loadStripe to detect network issues
        const stripePromise = loadStripe(stripePublishableKey);
        
        // Race between loading and timeout
        const timeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Stripe.js load timeout')), 15000);
        });

        const stripeInstance = await Promise.race([stripePromise, timeoutPromise]);
        
        if (stripeInstance) {
          setStripe(stripeInstance);
          console.log('✅ Stripe.js loaded successfully');
        } else {
          throw new Error('Failed to load Stripe.js - returned null');
        }
      } catch (error: any) {
        console.error('❌ Failed to load Stripe.js:', error);
        
        let errorMessage = 'Erro ao carregar sistema de pagamentos';
        
        if (error.message.includes('timeout')) {
          errorMessage = 'Tempo limite ao carregar pagamentos. Verifique sua conexão.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Erro de rede ao carregar pagamentos.';
        } else if (error.message.includes('Invalid key')) {
          errorMessage = 'Configuração de pagamento inválida.';
        }
        
        setStripeError(errorMessage);
        
        // Only show toast in development or if it's a user-facing error
        if (process.env.NODE_ENV === 'development') {
          toast.error('Erro ao inicializar Stripe', {
            description: errorMessage
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublishableKey]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Inicializando pagamentos...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (stripeError || (!stripePublishableKey || !isValidKey)) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="text-red-600">
          <div className="text-lg font-medium mb-2">❌ Sistema de Pagamento Indisponível</div>
          <p className="text-sm">
            {stripeError || 'Configuração de pagamento não encontrada'}
          </p>
        </div>
        
        {stripeError && (
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        )}
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>Possíveis soluções:</p>
          <ul className="list-disc list-inside text-left max-w-sm mx-auto">
            <li>Verifique sua conexão com a internet</li>
            <li>Desative bloqueadores de anúncios temporariamente</li>
            <li>Tente usar outro navegador</li>
            <li>Entre em contato com o suporte se o problema persistir</li>
          </ul>
        </div>
      </div>
    );
  }

  // Return children without Elements if stripe failed to load
  if (!stripe) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">Pagamento não disponível no momento.</p>
        <p className="text-sm text-gray-500">Tente recarregar a página ou entre em contato com o suporte.</p>
      </div>
    );
  }

  const options = clientSecret ? { clientSecret } : {};
  
  return (
    <Elements 
      stripe={stripe} 
      options={options}
      key={clientSecret} // Force remount when clientSecret changes
    >
      {children}
    </Elements>
  );
} 