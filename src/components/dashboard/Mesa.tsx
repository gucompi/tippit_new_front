'use client';

import { useTranslations } from 'next-intl';
import { Coffee, Star } from 'lucide-react';

interface MesaProps {
  pos: string;
  mesaDetails?: Record<string, {
    mostFrequentMozo?: string;
    highestMonto?: number;
    averageMonto?: number;
    averageCalificacion?: number;
    photo?: string;
  }>;
}

export function Mesa({ pos, mesaDetails }: MesaProps) {
  const t = useTranslations('dashboard.mesa');

  const details = mesaDetails?.[pos];

  return (
    <div className="md:flex mb-4">
      <div className="coffe-cup mt-12 md:mt-[95px] mx-auto md:scale-150 relative">
        <span className="absolute text-white w-full text-center h-full align-baseline pt-3 text-3xl font-mono z-10">
          {pos}
        </span>
        <Coffee size={96} className="text-pink-500 absolute mt-[-18px]" />
      </div>
      <div className="text-sm text-gray-500 border-2 mt-3 border-pink-300 rounded-md md:rounded-xl px-3 py-1 md:p-0 mb-2 shadow-md md:bg-pink-300 md:w-2/3">
        <div className="md:p-3 md:rounded-l-xl md:rounded-r-md md:bg-white md:m-1">
          <h3 className="text-pink-500 rounded-md p-2 text-sm mt-2">
            {t('mostFrequentStaff', { defaultValue: 'Most Frequent Staff' })}
            <span className="bg-white rounded-md px-2 float-right text-gray-500">
              {details?.mostFrequentMozo || 'N/A'}
            </span>
          </h3>
          <h3 className="text-pink-500 rounded-md p-2 text-sm mt-2">
            {t('highestTip', { defaultValue: 'Highest Tip' })}
            <span className="bg-white rounded-md px-2 float-right text-gray-500 font-normal">
              ${details?.highestMonto?.toFixed(2) || '0.00'}
            </span>
          </h3>
          <h3 className="text-pink-500 rounded-md p-2 text-sm mt-2">
            {t('averageTip', { defaultValue: 'Average Tip' })}
            <span className="bg-white rounded-md px-2 float-right text-gray-500 font-normal">
              {details?.averageMonto !== undefined
                ? `$${details.averageMonto.toFixed(2)}`
                : t('noData', { defaultValue: 'No data' })}
            </span>
          </h3>
          <h3 className="text-pink-500 rounded-md p-2 text-sm mt-2">
            {t('averageRating', { defaultValue: 'Average Rating' })}
            <span className="bg-white rounded-md px-2 float-right text-gray-500 font-normal flex items-center gap-1">
              {details?.averageCalificacion?.toFixed(0) || '0'}
              <Star size={14} className="text-yellow-400" />
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}

