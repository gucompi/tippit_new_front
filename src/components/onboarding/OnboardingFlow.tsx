'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Building, Users, Star, ArrowRight, Check } from 'lucide-react';
import { tokens } from '@/styles/tokens';
import toast from 'react-hot-toast';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type OnboardingOption = 'receive-tips' | 'work-for-business' | 'create-business';

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const t = useTranslations('onboarding');
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<OnboardingOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options: Array<{
    id: OnboardingOption;
    icon: React.ReactNode;
    title: string;
    description: string;
  }> = [
    {
      id: 'receive-tips',
      icon: <Star size={32} style={{ color: tokens.colors.primary }} />,
      title: t('receiveTips.title', { defaultValue: 'Receive Tips & Reviews' }),
      description: t('receiveTips.description', {
        defaultValue: 'Get tips and reviews from customers when they scan your QR code',
      }),
    },
    {
      id: 'work-for-business',
      icon: <Users size={32} style={{ color: tokens.colors.primary }} />,
      title: t('workForBusiness.title', { defaultValue: 'Work for a Business' }),
      description: t('workForBusiness.description', {
        defaultValue: 'Join an existing business as an employee or staff member',
      }),
    },
    {
      id: 'create-business',
      icon: <Building size={32} style={{ color: tokens.colors.primary }} />,
      title: t('createBusiness.title', { defaultValue: 'Create a Business' }),
      description: t('createBusiness.description', {
        defaultValue: 'Set up your own business and start managing tips, staff, and QR codes',
      }),
    },
  ];

  const toggleOption = (optionId: OnboardingOption) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  const handleContinue = async () => {
    if (selectedOptions.length === 0) {
      toast.error(t('selectAtLeastOne', { defaultValue: 'Please select at least one option' }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle each selected option
      if (selectedOptions.includes('create-business')) {
        // Redirect to business creation
        router.push('/business/create');
      } else if (selectedOptions.includes('work-for-business')) {
        // Redirect to join business
        router.push('/business/join');
      } else if (selectedOptions.includes('receive-tips')) {
        // User wants to receive tips - they're already set up
        // Just continue to dashboard
        onComplete();
        return;
      }

      // If no redirect happened, complete onboarding
      onComplete();
    } catch (error) {
      console.error('Error in onboarding:', error);
      toast.error(t('error', { defaultValue: 'An error occurred. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold" style={{ color: tokens.colors.textPrimary }}>
            {t('title', { defaultValue: 'Welcome to Tippit!' })}
          </h1>
          <p className="text-lg" style={{ color: tokens.colors.textSecondary }}>
            {t('subtitle', {
              defaultValue: 'What would you like to do? Select all that apply.',
            })}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleOption(option.id)}
                className="relative p-6 rounded-xl border-2 transition-all text-left"
                style={{
                  borderColor: isSelected ? tokens.colors.primary : tokens.colors.border,
                  backgroundColor: isSelected ? tokens.colors.primary + '10' : tokens.colors.white,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = tokens.colors.primary;
                    e.currentTarget.style.backgroundColor = tokens.colors.primary + '05';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = tokens.colors.border;
                    e.currentTarget.style.backgroundColor = tokens.colors.white;
                  }
                }}
              >
                {/* Checkmark indicator */}
                {isSelected && (
                  <div
                    className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: tokens.colors.primary }}
                  >
                    <Check size={16} style={{ color: 'white' }} />
                  </div>
                )}

                {/* Icon */}
                <div className="mb-4">{option.icon}</div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2" style={{ color: tokens.colors.textPrimary }}>
                  {option.title}
                </h3>

                {/* Description */}
                <p className="text-sm" style={{ color: tokens.colors.textSecondary }}>
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleContinue}
            disabled={isSubmitting || selectedOptions.length === 0}
            className="flex items-center gap-2 px-8 h-[48px] rounded-full text-base font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: tokens.colors.primary,
            }}
          >
            {isSubmitting ? (
              t('processing', { defaultValue: 'Processing...' })
            ) : (
              <>
                {t('continue', { defaultValue: 'Continue' })}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

