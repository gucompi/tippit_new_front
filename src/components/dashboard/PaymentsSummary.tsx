'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Coins } from 'lucide-react';

interface PaymentsSummaryProps {
  totalPayments: number;
  totalPropinas: number;
  totalPendiente: number;
  totalTransferido: number;
}

export function PaymentsSummary({
  totalPayments,
  totalPropinas,
  totalPendiente,
  totalTransferido,
}: PaymentsSummaryProps) {
  const t = useTranslations('dashboard.mozo');
  const [isAmountVisible, setIsAmountVisible] = useState(true);

  return (
    <div
      className={`flex rounded-md w-11/12 mx-auto py-6 px-6 cursor-pointer transition-all max-w-[600px] border border-[#EAEAEA] ${
        isAmountVisible ? 'bg-white' : 'bg-pink-900 text-white'
      }`}
      onClick={() => setIsAmountVisible(!isAmountVisible)}
    >
      <div className="w-full">
        <div className="text-3xl font-semibold flex items-center justify-center">
          {isAmountVisible ? `$${totalPayments.toFixed(2)}` : '$****'}
          {isAmountVisible ? (
            <Eye className="ml-3" size={30} />
          ) : (
            <EyeOff className="ml-3" size={30} />
          )}
        </div>

        {isAmountVisible && (
          <table className="min-w-full mt-6 mb-6">
            <tbody className="bg-white">
              <tr className="flex flex-row border-0 shadow-none">
                <td className="text-sm font-medium text-gray-900 min-w-[140px]">
                  {t('yourTips', { defaultValue: 'Your Tips' })}
                </td>
                <td className="whitespace-nowrap text-sm text-green-600">
                  ${totalPropinas.toFixed(2)}
                </td>
              </tr>
              <tr className="flex flex-row border-0 shadow-none">
                <td className="whitespace-nowrap text-sm font-medium text-gray-900 min-w-[140px]">
                  {t('totalPending', { defaultValue: 'Total Pending' })}
                </td>
                <td className="whitespace-nowrap text-sm text-gray-500">
                  ${totalPendiente.toFixed(2)}
                </td>
              </tr>
              <tr className="flex flex-row border-0 shadow-none">
                <td className="whitespace-nowrap text-sm font-medium text-gray-900 min-w-[140px]">
                  {t('totalTransferred', { defaultValue: 'Total Transferred' })}
                </td>
                <td className="whitespace-nowrap text-sm text-red-500">
                  ${totalTransferido.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-center text-sm mt-2">
          <Coins size={20} />
          &nbsp; {t('weeklyTipsTotal', { defaultValue: 'Weekly Tips Total' })}
        </div>
      </div>
    </div>
  );
}

