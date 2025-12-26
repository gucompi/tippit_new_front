'use client';

import { useEffect, useRef } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

interface PaymentBricksProps {
  preferenceId: string;
  publicKey?: string;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: Error) => void;
  onPaymentPending?: (paymentData: any) => void;
  onReady?: () => void;
}

export function PaymentBricks({
  preferenceId,
  publicKey,
  onPaymentSuccess,
  onPaymentError,
  onPaymentPending,
  onReady,
}: PaymentBricksProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Initialize Mercado Pago SDK
    const mpPublicKey = publicKey || process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';
    
    if (!mpPublicKey) {
      console.error('Mercado Pago public key not configured. Set NEXT_PUBLIC_MP_PUBLIC_KEY');
      return;
    }

    if (!initializedRef.current) {
      initMercadoPago(mpPublicKey);
      initializedRef.current = true;
    }
  }, [publicKey]);

  const initialization = {
    amount: 0, // Will be set by preference
    preferenceId: preferenceId,
  };

  const customization = {
    visual: {
      style: {
        theme: 'default' as const,
      },
    },
    paymentMethods: {
      ticket: ['all'],
      creditCard: 'all',
      debitCard: 'all',
      mercadoPago: 'all',
    },
  };

  const onSubmit = async ({ formData }: any) => {
    // Payment is processed by Mercado Pago
    // We just need to handle the response
    try {
      // The formData contains payment information
      // Mercado Pago will process it and redirect based on back_urls
      // Webhook will update the payment status
      if (onPaymentSuccess) {
        onPaymentSuccess(formData);
      }
    } catch (error: any) {
      if (onPaymentError) {
        onPaymentError(error);
      }
    }
  };

  const onError = async (error: any) => {
    console.error('Payment error:', error);
    if (onPaymentError) {
      onPaymentError(new Error(error.message || 'Payment error occurred'));
    }
  };

  const onReadyCallback = () => {
    if (onReady) {
      onReady();
    }
  };

  if (!preferenceId) {
    return <div>Loading payment form...</div>;
  }

  return (
    <div id="payment-bricks-container" className="w-full">
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onError={onError}
        onReady={onReadyCallback}
      />
    </div>
  );
}

