'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { trpc } from '@/lib/trpc';
import { AlertTriangle, CreditCard, Mail } from 'lucide-react';
import { tokens } from '@/styles/tokens';
import toast from 'react-hot-toast';

interface PasswordRecoveryByCuitProps {
  onBack: () => void;
}

export function PasswordRecoveryByCuit({ onBack }: PasswordRecoveryByCuitProps) {
  const t = useTranslations('login.recovery');
  const [cuit, setCuit] = useState('');
  const [error, setError] = useState('');
  const [emailMasked, setEmailMasked] = useState<string | null>(null);

  const recoverMutation = trpc.register.recoverByCuit.useMutation({
    onSuccess: (data) => {
      if (data.emailMasked) {
        setEmailMasked(data.emailMasked);
        toast.success(data.message);
      } else {
        toast.success(data.message);
      }
    },
    onError: (error) => {
      setError(error.message || t('error', { defaultValue: 'Failed to recover account' }));
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailMasked(null);

    const cuitDigits = cuit.replace(/\D/g, '');
    if (cuitDigits.length !== 11) {
      setError(t('cuitInvalid', { defaultValue: 'CUIT must be exactly 11 digits' }));
      return;
    }

    recoverMutation.mutate({ cuit: cuitDigits });
  };

  if (emailMasked) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: tokens.colors.success + '20' }}>
            <Mail size={32} style={{ color: tokens.colors.success }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: tokens.colors.textPrimary }}>
            {t('emailSent', { defaultValue: 'Email Sent' })}
          </h2>
          <p className="text-sm" style={{ color: tokens.colors.textSecondary }}>
            {t('emailSentMessage', {
              defaultValue: 'If an account exists with this CUIT, a recovery email has been sent to:',
            })}
          </p>
          <div className="p-4 rounded-lg border" style={{ borderColor: tokens.colors.border, backgroundColor: tokens.colors.white }}>
            <p className="text-lg font-semibold" style={{ color: tokens.colors.textPrimary }}>
              {emailMasked}
            </p>
          </div>
          <button
            onClick={onBack}
            className="w-full h-[48px] rounded-full text-base font-semibold text-white transition"
            style={{ backgroundColor: tokens.colors.primary }}
          >
            {t('backToLogin', { defaultValue: 'Back to Login' })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: tokens.colors.textPrimary }}>
          {t('title', { defaultValue: 'Recover Account' })}
        </h2>
        <p className="text-sm" style={{ color: tokens.colors.textSecondary }}>
          {t('subtitle', { defaultValue: 'Enter your CUIT to recover your account' })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold" style={{ color: tokens.colors.textInput }}>
            {t('cuit', { defaultValue: 'CUIT' })}
          </label>
          <div className="relative">
            {error && (
              <AlertTriangle
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
                style={{ color: tokens.colors.error }}
                size={18}
              />
            )}
            <input
              type="text"
              value={cuit}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setCuit(value);
                setError('');
              }}
              maxLength={11}
              placeholder={t('cuitPlaceholder', { defaultValue: 'Enter your CUIT' })}
              className="h-[48px] w-full rounded-full border px-12 text-base outline-none transition placeholder:text-[#9da3b5]"
              style={
                error
                  ? {
                      border: `1px solid ${tokens.colors.errorBorder}`,
                      backgroundColor: tokens.colors.errorLight,
                      color: tokens.colors.textInput,
                    }
                  : {
                      borderColor: tokens.colors.border,
                      color: tokens.colors.textInput,
                    }
              }
            />
            <CreditCard
              className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
              style={{ color: tokens.colors.icon }}
            />
          </div>
          {error && (
            <p className="text-sm" style={{ color: tokens.colors.error }}>
              *{error}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 h-[48px] rounded-full border text-base font-semibold transition"
            style={{
              borderColor: tokens.colors.border,
              color: tokens.colors.textSecondary,
              backgroundColor: 'white',
            }}
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            type="submit"
            disabled={recoverMutation.isPending || cuit.replace(/\D/g, '').length !== 11}
            className="flex-1 h-[48px] rounded-full text-base font-semibold text-white transition disabled:opacity-50"
            style={{
              backgroundColor: tokens.colors.primary,
            }}
          >
            {recoverMutation.isPending
              ? t('sending', { defaultValue: 'Sending...' })
              : t('sendRecovery', { defaultValue: 'Send Recovery Email' })}
          </button>
        </div>
      </form>
    </div>
  );
}

