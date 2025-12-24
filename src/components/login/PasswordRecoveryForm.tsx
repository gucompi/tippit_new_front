'use client';

import { useTranslations } from 'next-intl';
import { Mail, AlertTriangle, ArrowLeft } from 'lucide-react';
import { tokens } from '@/styles/tokens';

interface PasswordRecoveryFormProps {
  email: string;
  formError?: string;
  isSubmitting: boolean;
  successMessage?: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function PasswordRecoveryForm({
  email,
  formError,
  isSubmitting,
  successMessage,
  onEmailChange,
  onSubmit,
  onBack,
}: PasswordRecoveryFormProps) {
  const t = useTranslations('auth.forgotPassword');

  return (
    <div style={{ padding: tokens.spacing[8] }}>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 mb-6 hover:underline"
        style={{ color: tokens.colors.secondary }}
        disabled={isSubmitting}
      >
        <ArrowLeft size={18} />
        <span className="text-sm">{t('backToLogin')}</span>
      </button>

      {successMessage ? (
        <div className="text-center">
          <div 
            className="rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: tokens.colors.successLight 
            }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: tokens.colors.success }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 
            className="font-semibold mb-2"
            style={{ 
              fontSize: tokens.typography.fontSize.xl,
              color: tokens.colors.textPrimary,
            }}
          >
            {t('success')}
          </h2>
          <p 
            className="text-sm"
            style={{ color: tokens.colors.textSecondary }}
          >
            {successMessage}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 w-full max-w-[300px] text-sm font-semibold uppercase tracking-wide text-white transition"
            style={{
              height: tokens.sizing.buttonHeight.md,
              borderRadius: tokens.borderRadius.lg,
              backgroundColor: tokens.colors.primary,
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = tokens.colors.primaryHover)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = tokens.colors.primary)}
          >
            {t('backToLogin')}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col items-center space-y-6">
          <div className="text-center mb-4">
            <h2 
              className="font-semibold mb-2"
              style={{ 
                fontSize: tokens.typography.fontSize.xl,
                color: tokens.colors.textPrimary,
              }}
            >
              {t('title')}
            </h2>
            <p 
              className="text-sm"
              style={{ color: tokens.colors.textSecondary }}
            >
              {t('description')}
            </p>
          </div>

          <div className="w-full max-w-[379px] space-y-2">
            <label
              htmlFor="recoveryEmail"
              className="text-sm font-bold leading-5"
              style={{ 
                color: tokens.colors.textInput,
                fontFamily: tokens.typography.fontFamily.primary,
                letterSpacing: tokens.typography.letterSpacing.tight,
              }}
            >
              {t('email')}
            </label>
            <div className="relative">
              {formError && (
                <AlertTriangle
                  className="absolute right-5 top-1/2 -translate-y-1/2 z-10 text-lg"
                  style={{ color: tokens.colors.error }}
                  size={18}
                />
              )}
              <input
                type="email"
                id="recoveryEmail"
                name="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={onEmailChange}
                className={`h-[48px] w-full rounded-full border px-12 text-base outline-none transition placeholder:text-[${tokens.colors.textPlaceholder}]`}
                style={
                  formError
                    ? {
                        border: `1px solid ${tokens.colors.errorBorder}`,
                        backgroundColor: tokens.colors.errorLight,
                        color: tokens.colors.textInput,
                      }
                    : {
                        borderColor: tokens.colors.border,
                        backgroundColor: tokens.colors.white,
                        color: tokens.colors.textInput,
                      }
                }
                autoComplete="email"
                disabled={isSubmitting}
              />
              <Mail 
                className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2" 
                style={{ color: tokens.colors.icon }}
              />
            </div>
            {formError && (
              <p className="text-sm" style={{ color: tokens.colors.error }}>
                *{formError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-[401px] text-sm font-semibold uppercase tracking-wide text-white transition disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              height: tokens.sizing.buttonHeight.lg,
              borderRadius: tokens.borderRadius.lg,
              backgroundColor: tokens.colors.primary,
            }}
            onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = tokens.colors.primaryHover)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = tokens.colors.primary)}
          >
            {isSubmitting ? t('submitting') : t('submit')}
          </button>
        </form>
      )}
    </div>
  );
}
