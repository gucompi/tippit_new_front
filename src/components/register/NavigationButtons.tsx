'use client';

import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { tokens } from '@/styles/tokens';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  backLabel?: string;
  nextLabel?: string;
}

export function NavigationButtons({
  onBack,
  onNext,
  isNextDisabled,
  isSubmitting = false,
  isLastStep = false,
  backLabel,
  nextLabel,
}: NavigationButtonsProps) {
  const t = useTranslations('register');
  const defaultBackLabel = backLabel || t('back');
  const buttonLabel = isSubmitting
    ? t('submitting')
    : nextLabel || (isLastStep ? t('submit') : t('next'));

  return (
    <div className="w-full max-w-[379px] flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-sm font-normal hover:underline transition-colors"
        style={{
          fontFamily: tokens.typography.fontFamily.primary,
          color: tokens.colors.primary,
        }}
      >
        <ChevronLeft size={16} className="mr-1" />
        {defaultBackLabel}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled || isSubmitting}
        className="h-[56px] w-full max-w-[200px] rounded-[10px] text-base font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          fontFamily: tokens.typography.fontFamily.primary,
          padding: '16px',
          backgroundColor:
            isNextDisabled || isSubmitting ? tokens.colors.disabled : tokens.colors.primary,
          cursor: isNextDisabled || isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

