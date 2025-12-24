'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Coins, Eye, EyeOff } from 'lucide-react';

interface AmountDisplayProps {
  activeSubButton: 'UltimaSemana' | 'UltimaMes' | 'UltimoAnio';
  totalPayments: number;
}

export function AmountDisplay({ activeSubButton, totalPayments }: AmountDisplayProps) {
  const [isAmountVisible, setIsAmountVisible] = useState(true);
  const t = useTranslations('dashboard.restaurant');

  const getPeriodText = () => {
    if (activeSubButton === 'UltimaSemana') {
      return t('thisWeek', { defaultValue: 'this week' });
    } else if (activeSubButton === 'UltimaMes') {
      return t('last30Days', { defaultValue: 'last 30 days' });
    } else if (activeSubButton === 'UltimoAnio') {
      return t('thisYear', { defaultValue: 'this year' });
    } else {
      return t('thisYear', { defaultValue: 'this year' });
    }
  };

  return (
    <div
      className={`rounded-md w-11/12 md:w-11/12 mx-auto p-4 py-5 md:py-6 md:my-5 md:h-[120px] cursor-pointer transition-all ${
        isAmountVisible
          ? 'border border-[#E1E1E1] shadow-pink-700 bg-white md:shadow-gray-300'
          : 'bg-[#aaa] text-white'
      }`}
      onClick={() => setIsAmountVisible(!isAmountVisible)}
    >
      <div className="text-3xl font-semibold flex items-center justify-center">
        {isAmountVisible ? `$${totalPayments.toFixed(2)}` : '$****'}
        {isAmountVisible ? (
          <Eye size={30} className="ml-2 text-gray-700" />
        ) : (
          <EyeOff size={30} className="ml-2 text-white" />
        )}
      </div>
      <div className="flex items-center justify-center text-sm mt-2">
        {isAmountVisible ? (
          <Coins size={20} className="ml-2 text-gray-700" />
        ) : (
          <Coins size={20} className="ml-2 text-white" />
        )}
        &nbsp; {t('totalTips', { defaultValue: 'Total Tips' })} {getPeriodText()}
      </div>
    </div>
  );
}

