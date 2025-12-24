'use client';

import { useTranslations } from 'next-intl';
import { tokens } from '@/styles/tokens';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const t = useTranslations('register');
  return (
    <div className="w-full max-w-[379px] text-center mb-6">
      <p
        className="text-sm"
        style={{
          fontFamily: tokens.typography.fontFamily.primary,
          fontWeight: tokens.typography.fontWeight.regular,
          color: tokens.colors.textMuted,
        }}
      >
        {t('stepIndicator', { current: currentStep, total: totalSteps })}
      </p>
    </div>
  );
}

