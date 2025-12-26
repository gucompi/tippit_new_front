'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import { ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import toast from 'react-hot-toast';

export function MercadoPagoConnect() {
  const t = useTranslations('dashboard.mozo');
  const { user } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);

  // Get user ID from backend (we need to get it from Clerk ID)
  const { data: connectionStatus, isLoading: isLoadingStatus } = trpc.mercadoPago.getConnectionStatus.useQuery(
    { userId: user?.id || '' },
    { enabled: !!user?.id }
  );

  const initiateOAuthMutation = trpc.mercadoPago.initiateOAuth.useMutation();
  const disconnectMutation = trpc.mercadoPago.disconnect.useMutation({
    onSuccess: () => {
      toast.success(t('disconnected', { defaultValue: 'Mercado Pago account disconnected' }));
      // Refetch status
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || t('disconnectError', { defaultValue: 'Failed to disconnect' }));
    },
  });

  const handleConnect = async () => {
    if (!user?.id) {
      toast.error(t('userNotFound', { defaultValue: 'User not found' }));
      return;
    }

    setIsConnecting(true);
    try {
      const result = await initiateOAuthMutation.mutateAsync({ userId: user.id });
      if (result.authUrl) {
        // Redirect to Mercado Pago authorization
        window.location.href = result.authUrl;
      }
    } catch (error: any) {
      toast.error(error.message || t('connectError', { defaultValue: 'Failed to initiate connection' }));
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user?.id) {
      return;
    }

    if (!confirm(t('confirmDisconnect', { defaultValue: 'Are you sure you want to disconnect your Mercado Pago account?' }))) {
      return;
    }

    try {
      await disconnectMutation.mutateAsync({ userId: user.id });
    } catch (error) {
      // Error handled in mutation
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
        <p className="text-sm text-gray-600">{t('loading', { defaultValue: 'Loading...' })}</p>
      </div>
    );
  }

  const isConnected = connectionStatus?.connected && connectionStatus?.isActive;

  if (isConnected) {
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          {t('connected', { defaultValue: 'Mercado Pago Connected' })}
        </h3>
        <p className="text-sm text-green-600 mb-4">
          {t('connectedDescription', {
            defaultValue: 'Your Mercado Pago account is connected and ready to receive tips.',
          })}
        </p>
        {connectionStatus?.needsRefresh && (
          <p className="text-xs text-yellow-600 mb-2">
            {t('tokenExpiring', { defaultValue: 'Token expiring soon. Reconnect if needed.' })}
          </p>
        )}
        <button
          type="button"
          onClick={handleDisconnect}
          disabled={disconnectMutation.isPending}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          {disconnectMutation.isPending
            ? t('disconnecting', { defaultValue: 'Disconnecting...' })
            : t('disconnect', { defaultValue: 'Disconnect' })}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        {t('connectMercadoPago', { defaultValue: 'Connect MercadoPago' })}
      </h3>
      <p className="text-sm text-blue-600 mb-4">
        {t('connectMercadoPagoDescription', {
          defaultValue: 'To receive your tips, you need to connect your MercadoPago account.',
        })}
      </p>
      <button
        type="button"
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
      >
        {isConnecting ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            {t('connecting', { defaultValue: 'Connecting...' })}
          </>
        ) : (
          <>
            {t('connectNow', { defaultValue: 'Connect Now' })}
            <ExternalLink size={18} />
          </>
        )}
      </button>
    </div>
  );
}

