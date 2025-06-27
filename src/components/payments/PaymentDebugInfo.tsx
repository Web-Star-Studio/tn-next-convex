'use client';

import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

interface NetworkInfo {
  online: boolean;
  connection: string;
  effectiveType: string;
}

export default function PaymentDebugInfo() {
  const stripe = useStripe();
  const elements = useElements();
  const [debugInfo, setDebugInfo] = useState({
    stripe: false,
    elements: false,
    timestamp: new Date().toISOString(),
    userAgent: '',
    url: '',
    stripeVersion: '',
    networkInfo: null as NetworkInfo | null,
    stripeKey: '',
    domainInfo: '',
  });

  useEffect(() => {
    // Get network information if available
    const getNetworkInfo = (): NetworkInfo | null => {
      if ('navigator' in window && 'connection' in navigator) {
        const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (conn) {
          return {
            online: navigator.onLine,
            connection: conn.type || 'unknown',
            effectiveType: conn.effectiveType || 'unknown'
          };
        }
      }
      return {
        online: navigator.onLine,
        connection: 'unknown',
        effectiveType: 'unknown'
      };
    };

    // Get Stripe version if available
    const getStripeVersion = () => {
      try {
        // Try to get version from Stripe object if available
        if (stripe && (stripe as any).version) {
          return (stripe as any).version;
        }
        // Try to get from global Stripe object
        if (typeof window !== 'undefined' && (window as any).Stripe) {
          return (window as any).Stripe.version || 'unknown';
        }
        return 'unknown';
      } catch {
        return 'unknown';
      }
    };

    setDebugInfo({
      stripe: !!stripe,
      elements: !!elements,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stripeVersion: getStripeVersion(),
      networkInfo: getNetworkInfo(),
      stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...' || 'Not set',
      domainInfo: `${window.location.protocol}//${window.location.host}`,
    });
  }, [stripe, elements]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const copyDebugInfo = () => {
    const info = {
      ...debugInfo,
      stripeInstanceType: stripe ? typeof stripe : 'undefined',
      elementsInstanceType: elements ? typeof elements : 'undefined',
      hasStripeGlobal: typeof window !== 'undefined' && !!(window as any).Stripe,
      consoleErrors: 'Check browser console for detailed errors'
    };
    
    navigator.clipboard.writeText(JSON.stringify(info, null, 2));
    console.log('Debug info copied to clipboard:', info);
  };

  return (
    <div className="bg-gray-100 border border-gray-300 rounded p-3 text-xs font-mono">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">🔍 Stripe Debug Info</div>
        <button 
          onClick={copyDebugInfo}
          className="text-blue-600 hover:text-blue-800 text-xs"
          title="Copy debug info to clipboard"
        >
          📋 Copy
        </button>
      </div>
      
      <div className="space-y-1">
        {/* Stripe & Elements Status */}
        <div className={`flex items-center space-x-2 ${debugInfo.stripe ? 'text-green-600' : 'text-red-600'}`}>
          <span>{debugInfo.stripe ? '✅' : '❌'}</span>
          <span>Stripe: {debugInfo.stripe ? 'Ready' : 'Not Ready'}</span>
        </div>
        
        <div className={`flex items-center space-x-2 ${debugInfo.elements ? 'text-green-600' : 'text-red-600'}`}>
          <span>{debugInfo.elements ? '✅' : '❌'}</span>
          <span>Elements: {debugInfo.elements ? 'Ready' : 'Not Ready'}</span>
        </div>

        {/* Network Status */}
        <div className={`flex items-center space-x-2 ${debugInfo.networkInfo?.online ? 'text-green-600' : 'text-red-600'}`}>
          <span>{debugInfo.networkInfo?.online ? '🌐' : '🔴'}</span>
          <span>Network: {debugInfo.networkInfo?.online ? 'Online' : 'Offline'}</span>
          {debugInfo.networkInfo?.effectiveType && (
            <span className="text-gray-500">({debugInfo.networkInfo.effectiveType})</span>
          )}
        </div>

        {/* Stripe Configuration */}
        <div className="border-t border-gray-300 pt-1 mt-2">
          <div className="text-gray-600 text-xs">
            <div>Stripe Key: {debugInfo.stripeKey}</div>
            <div>Version: {debugInfo.stripeVersion}</div>
            <div>Domain: {debugInfo.domainInfo}</div>
          </div>
        </div>

        {/* Browser Info */}
        <div className="border-t border-gray-300 pt-1 mt-2">
          <div className="text-gray-600 text-xs">
            <div>Browser: {debugInfo.userAgent.includes('Chrome') ? 'Chrome' : 
                         debugInfo.userAgent.includes('Firefox') ? 'Firefox' : 
                         debugInfo.userAgent.includes('Safari') ? 'Safari' : 'Other'}</div>
            <div>Last Update: {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Quick Tests */}
        {!debugInfo.stripe && (
          <div className="border-t border-gray-300 pt-1 mt-2 text-orange-600">
            <div className="text-xs">⚠️ Troubleshooting:</div>
            <ul className="text-xs list-disc list-inside ml-2 text-gray-600">
              <li>Check network connection</li>
              <li>Disable ad blockers</li>
              <li>Check browser console</li>
              <li>Verify Stripe key format</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 