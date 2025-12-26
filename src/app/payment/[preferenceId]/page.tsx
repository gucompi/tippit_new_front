'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { trpc } from '@/lib/trpc';
import { PaymentBricks } from '@/components/mercadoPago/PaymentBricks';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('payment');
  const preferenceId = params?.preferenceId as string;

  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');

  const { data: preference, isLoading, error } = trpc.mercadoPago.getPreference.useQuery(
    { preferenceId },
    { enabled: !!preferenceId }
  );

  useEffect(() => {
    // Check URL params for payment status (from redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const paymentId = urlParams.get('payment_id');

    if (status === 'approved' && paymentId) {
      setPaymentStatus('success');
      toast.success(t('paymentApproved', { defaultValue: 'Payment approved!' }));
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/payment/success');
      }, 3000);
    } else if (status === 'rejected') {
      setPaymentStatus('error');
      toast.error(t('paymentRejected', { defaultValue: 'Payment was rejected' }));
    } else if (status === 'pending') {
      toast(t('paymentPending', { defaultValue: 'Payment is pending' }), { icon: 'ℹ️' });
    }
  }, [router, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-lg">{t('loading', { defaultValue: 'Loading payment...' })}</p>
        </div>
      </div>
    );
  }

  if (error || !preference) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h1 className="text-2xl font-bold mb-2">{t('error', { defaultValue: 'Error' })}</h1>
          <p className="text-gray-600 mb-4">
            {error?.message || t('preferenceNotFound', { defaultValue: 'Payment preference not found' })}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t('goHome', { defaultValue: 'Go Home' })}
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          <h1 className="text-2xl font-bold mb-2">{t('success', { defaultValue: 'Payment Successful!' })}</h1>
          <p className="text-gray-600">{t('redirecting', { defaultValue: 'Redirecting...' })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{t('completePayment', { defaultValue: 'Complete Payment' })}</h1>
          {preference.description && (
            <p className="text-gray-600 mb-6">{preference.description}</p>
          )}
          <div className="mb-4">
            <p className="text-sm text-gray-500">{t('amount', { defaultValue: 'Amount' })}</p>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: preference.currency || 'ARS',
              }).format(preference.amount)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t('paymentMethod', { defaultValue: 'Payment Method' })}</h2>
          <PaymentBricks
            preferenceId={preference.preferenceId}
            onPaymentSuccess={(data) => {
              setPaymentStatus('success');
              toast.success(t('paymentApproved', { defaultValue: 'Payment approved!' }));
              setTimeout(() => {
                router.push('/payment/success');
              }, 2000);
            }}
            onPaymentError={(error) => {
              setPaymentStatus('error');
              toast.error(error.message || t('paymentError', { defaultValue: 'Payment error occurred' }));
            }}
            onPaymentPending={(data) => {
              toast(t('paymentPending', { defaultValue: 'Payment is pending' }), { icon: 'ℹ️' });
            }}
            onReady={() => {
              setPaymentStatus('ready');
            }}
          />
        </div>
      </div>
    </div>
  );
}

