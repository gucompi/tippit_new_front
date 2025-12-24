'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { tokens } from '@/styles/tokens';

interface RegistrationSuccessProps {
  email: string;
  onResendEmail: (email: string) => Promise<unknown>;
  isResending: boolean;
}

export function RegistrationSuccess({
  email,
  onResendEmail,
  isResending,
}: RegistrationSuccessProps) {
  const t = useTranslations('register.success');
  const [resendSuccess, setResendSuccess] = useState(false);

  // Mask email for display (e.g., ex****e@gmail.com)
  const maskEmail = (email: string) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    if (localPart.length <= 2) {
      return `${localPart}****@${domain}`;
    }
    const visibleStart = localPart.substring(0, 2);
    const visibleEnd = localPart.substring(localPart.length - 1);
    return `${visibleStart}****${visibleEnd}@${domain}`;
  };

  const handleResendEmail = async () => {
    setResendSuccess(false);
    try {
      await onResendEmail(email);
      setResendSuccess(true);
    } catch (error) {
      console.error('Error resending email:', error);
    }
  };

  const maskedEmail = maskEmail(email);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] px-4 py-8">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/Tippit-logo-Texto-1024x242.png"
          alt="Tippit Logo"
          width={200}
          height={47}
          className="mx-auto"
          priority
        />
      </div>

      {/* Title */}
      <h1
        className="text-2xl font-bold mb-6 text-center"
        style={{
          fontFamily: tokens.typography.fontFamily.primary,
          color: '#222D39',
          letterSpacing: '0%',
        }}
      >
        {t('title')}
      </h1>

      {/* Explanatory Text */}
      <div
        className="mb-8 text-center max-w-[506px]"
        style={{
          fontFamily: tokens.typography.fontFamily.primary,
          fontWeight: tokens.typography.fontWeight.medium,
          fontSize: '14px',
          lineHeight: '21px',
          color: '#3E4854',
        }}
      >
        {t('emailSent')}{' '}
        <span style={{ fontWeight: tokens.typography.fontWeight.medium }}>
          {maskedEmail}
        </span>
        <br />
        {t('checkInbox')}
      </div>

      {/* Buttons */}
      <div className="flex flex-row gap-4 mb-6 justify-center items-center">
        <button
          type="button"
          onClick={handleResendEmail}
          disabled={isResending}
          className="transition-colors hover:bg-[#FFF5F9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{
            fontFamily: tokens.typography.fontFamily.primary,
            fontWeight: tokens.typography.fontWeight.medium,
            fontSize: '16px',
            lineHeight: '24px',
            width: '155px',
            height: '50px',
            borderRadius: '10px',
            border: `1px solid ${tokens.colors.primary}`,
            padding: '16px',
            backgroundColor: tokens.colors.white,
            color: tokens.colors.primary,
          }}
        >
          {isResending ? t('resending') : resendSuccess ? t('emailSentSuccess') : t('resendEmail')}
        </button>
        <Link
          href="/"
          className="transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center"
          style={{
            fontFamily: tokens.typography.fontFamily.primary,
            fontWeight: tokens.typography.fontWeight.medium,
            fontSize: '16px',
            lineHeight: '24px',
            width: '155px',
            height: '50px',
            borderRadius: '10px',
            padding: '16px',
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.white,
          }}
        >
          {t('goToLogin')}
        </Link>
      </div>

      {/* Troubleshooting Link */}
      <p
        className="text-sm text-center max-w-[379px]"
        style={{
          fontFamily: tokens.typography.fontFamily.primary,
          fontWeight: tokens.typography.fontWeight.regular,
          color: '#3E4854',
        }}
      >
        {t('didntReceive')}{' '}
        <button
          type="button"
          onClick={handleResendEmail}
          className="text-sm underline underline-offset-4"
          style={{
            fontFamily: tokens.typography.fontFamily.primary,
            fontWeight: tokens.typography.fontWeight.regular,
            color: '#1B9EDE',
          }}
        >
          {t('clickToResend')}
        </button>
      </p>
    </div>
  );
}

