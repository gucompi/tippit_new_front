'use client';

import { useTranslations } from 'next-intl';
import { PieChart } from '../socios/PieChart';

interface MozoProps {
  pos: string;
  mozoDetails?: Record<string, { nombre: string; cuit: string }>;
  groupedPaymentsArray?: Array<{
    key: string;
    payments: Array<{ monto: number }>;
    name?: string;
    totalMonto?: number;
  }>;
}

export function Mozo({ pos, mozoDetails, groupedPaymentsArray = [] }: MozoProps) {
  const t = useTranslations('dashboard.mozo');

  const mozoInfo = mozoDetails?.[pos];
  const mozoData = groupedPaymentsArray.find((m) => m.key === pos);

  if (!mozoData) {
    return null;
  }

  // Calculate totals for pie chart
  const totalMonto = mozoData.totalMonto || mozoData.payments.reduce((sum, p) => sum + p.monto, 0);
  const otherMozosTotal = groupedPaymentsArray
    .filter((m) => m.key !== pos)
    .reduce((sum, m) => sum + (m.totalMonto || m.payments.reduce((s, p) => s + p.monto, 0)), 0);

  const pieData = [
    {
      key: mozoInfo?.nombre || pos,
      value: totalMonto,
      color: '#EB5998',
    },
    {
      key: t('others', { defaultValue: 'Others' }),
      value: otherMozosTotal,
      color: '#4ECDC4',
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="mb-4">
      {mozoInfo && (
        <div className="mb-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <h3 className="text-lg font-semibold text-pink-700 mb-2">{mozoInfo.nombre}</h3>
          <p className="text-sm text-gray-600">CUIT: {mozoInfo.cuit}</p>
        </div>
      )}
      {pieData.length > 0 && (
        <PieChart
          data={pieData}
          title={t('tipsDistribution', { defaultValue: 'Tips Distribution' })}
        />
      )}
    </div>
  );
}

