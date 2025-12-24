'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, PieChart as PieChartIcon } from 'lucide-react';

interface LargeCardProps {
  title: string;
  icon?: string;
  number: number | string;
  percentage?: number;
  isIncrease?: boolean;
  showEyeButton?: boolean;
  customClass?: string;
  isComparison?: boolean;
  withTippitValue?: number;
  withoutTippitValue?: number;
}

export function LargeCard({
  title,
  icon,
  number,
  percentage,
  isIncrease,
  showEyeButton = false,
  customClass = '',
  isComparison = false,
  withTippitValue,
  withoutTippitValue,
}: LargeCardProps) {
  const t = useTranslations('socios.cards');
  const [isVisible, setIsVisible] = useState(true);

  if (isComparison) {
    return (
      <div className={`large-card comparison-card bg-white rounded-2xl p-6 border border-[#E1E1E1] ${customClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h6 className="text-sm text-gray-600 mb-2">{t('withoutTippit', { defaultValue: 'Total Cash' })}</h6>
            <span className="text-2xl font-bold text-gray-700">${withoutTippitValue || '0'}</span>
          </div>
          <div className="flex-1 text-center border-l border-gray-200">
            <h4 className="text-sm text-gray-600 mb-2">{t('withTippit', { defaultValue: 'Total Tips' })}</h4>
            <span className="text-2xl font-bold text-pink-500">${withTippitValue || '0'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`large-card bg-white rounded-2xl p-6 border border-[#E1E1E1] ${customClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{t(title, { defaultValue: title })}</h3>
        {showEyeButton && (
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isVisible ? <Eye size={18} className="text-gray-600" /> : <EyeOff size={18} className="text-gray-600" />}
          </button>
        )}
      </div>
      <div className={`${!isVisible ? 'blur-sm' : ''}`}>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-800">
            {typeof number === 'number' ? number.toLocaleString() : number}
          </span>
          {percentage !== undefined && (
            <span
              className={`text-sm font-semibold ${isIncrease ? 'text-green-500' : 'text-red-500'}`}
            >
              {isIncrease ? '+' : '-'}
              {Math.abs(percentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

