'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { tokens } from '@/styles/tokens';

interface LoginHeaderProps {
  showDefaultLogo: boolean;
  isOwner: boolean;
  onToggleUser: () => void;
}

export function LoginHeader({ showDefaultLogo, isOwner, onToggleUser }: LoginHeaderProps) {
  const t = useTranslations('auth.login');

  return (
    <div className="mb-1 text-center" style={{ color: tokens.colors.textPrimary }}>
      <div 
        className="relative mx-auto mb-4"
        style={{ 
          width: tokens.sizing.logo.width, 
          height: tokens.sizing.logo.height 
        }}
      >
        <Image
          src="/Tippit-logo-Texto-1024x242.png"
          alt="Tippit Logo"
          width={309}
          height={73}
          className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
            showDefaultLogo ? 'opacity-100' : 'opacity-0'
          }`}
          priority
        />
        <Image
          src="/Tippit-logo-Texto-1024x242-hidden.png"
          alt="Tippit Logo"
          width={309}
          height={73}
          className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
            showDefaultLogo ? 'opacity-0' : 'opacity-100'
          }`}
          priority
        />
      </div>
      <div 
        className="flex flex-col gap-2 mx-auto text-center"
        style={{ marginTop: tokens.spacing[8] }}
      >
        <h1
          className="font-semibold whitespace-nowrap"
          style={{ 
            fontFamily: tokens.typography.fontFamily.primary,
            fontSize: tokens.typography.fontSize.xl,
            lineHeight: tokens.typography.lineHeight.tight,
            color: tokens.colors.textPrimary,
          }}
        >
          {isOwner ? t('title') : t('titleWorker')}
        </h1>
        <p
          className="text-center"
          style={{ 
            fontFamily: tokens.typography.fontFamily.primary,
            fontSize: tokens.typography.fontSize.sm,
            fontWeight: tokens.typography.fontWeight.regular,
            lineHeight: tokens.typography.lineHeight.normal,
            color: tokens.colors.textSecondary,
          }}
        >
          <button
            type="button"
            className="underline-offset-4 underline"
            style={{
              fontFamily: tokens.typography.fontFamily.primary,
              fontSize: tokens.typography.fontSize.sm,
              fontWeight: tokens.typography.fontWeight.regular,
              color: tokens.colors.secondary,
            }}
            onClick={onToggleUser}
          >
            {isOwner ? t('toggleWorker') : t('toggleOwner')}
          </button>
        </p>
      </div>
    </div>
  );
}
