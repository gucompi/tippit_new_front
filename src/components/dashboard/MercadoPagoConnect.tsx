'use client';

import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';

export function MercadoPagoConnect() {
  const t = useTranslations('dashboard.mozo');

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
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
      >
        {t('connectNow', { defaultValue: 'Connect Now' })}
        <ExternalLink size={18} />
      </button>
    </div>
  );
}

