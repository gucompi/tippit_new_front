'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { tokens } from '@/styles/tokens';

interface Step2Props {
  cuit: string;
  alias: string;
  phone: string;
  errors: {
    cuit?: string;
    alias?: string;
    phone?: string;
  };
  validation: {
    cuitError: string;
    cuitChecking: boolean;
    cuitOk: boolean;
    phoneError: string;
    phoneChecking: boolean;
    phoneOk: boolean;
  };
  onCuitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCuitBlur: () => void;
  onAliasChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneBlur: () => void;
}

export function Step2Details({
  cuit,
  alias,
  phone,
  errors,
  validation,
  onCuitChange,
  onCuitBlur,
  onAliasChange,
  onPhoneChange,
  onPhoneBlur,
}: Step2Props) {
  const t = useTranslations('register.step2');
  const hasCuitError = errors.cuit || validation.cuitError;
  const hasPhoneError = errors.phone || validation.phoneError;

  return (
    <>
      {/* CUIT Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <label
          htmlFor="cuit"
          className="text-sm font-bold leading-5"
          style={{
            color: tokens.colors.textInput,
            fontFamily: tokens.typography.fontFamily.primary,
            letterSpacing: tokens.typography.letterSpacing.tight,
          }}
        >
          {t('cuit')}
        </label>
        <div className="relative">
          {hasCuitError && (
            <AlertTriangle
              className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
              style={{ color: tokens.colors.error }}
              size={18}
            />
          )}
          {validation.cuitChecking && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <input
            type="text"
            id="cuit"
            name="cuit"
            placeholder={t('cuitPlaceholder')}
            value={cuit}
            onChange={onCuitChange}
            onBlur={onCuitBlur}
            maxLength={11}
            className="h-[48px] w-full rounded-full border px-5 text-base outline-none transition placeholder:text-[#9da3b5]"
            style={
              hasCuitError
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
        </div>
        {hasCuitError && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            *{errors.cuit || validation.cuitError}
          </p>
        )}
      </div>

      {/* Alias Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <label
          htmlFor="alias"
          className="text-sm font-bold leading-5"
          style={{
            color: tokens.colors.textInput,
            fontFamily: tokens.typography.fontFamily.primary,
            letterSpacing: tokens.typography.letterSpacing.tight,
          }}
        >
          {t('alias')}
        </label>
        <div className="relative">
          {errors.alias && (
            <AlertTriangle
              className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
              style={{ color: tokens.colors.error }}
              size={18}
            />
          )}
          <input
            type="text"
            id="alias"
            name="alias"
            placeholder={t('aliasPlaceholder')}
            value={alias}
            onChange={onAliasChange}
            className="h-[48px] w-full rounded-full border px-5 text-base outline-none transition placeholder:text-[#9da3b5]"
            style={
              errors.alias
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
        </div>
        {errors.alias && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            *{errors.alias}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-bold leading-5"
          style={{
            color: tokens.colors.textInput,
            fontFamily: tokens.typography.fontFamily.primary,
            letterSpacing: tokens.typography.letterSpacing.tight,
          }}
        >
          {t('phone')}
        </label>
        <div className="relative">
          {hasPhoneError && (
            <AlertTriangle
              className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
              style={{ color: tokens.colors.error }}
              size={18}
            />
          )}
          {validation.phoneChecking && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div
            className="h-[48px] w-full rounded-full border flex items-center overflow-visible"
            style={
              hasPhoneError
                ? {
                    border: `1px solid ${tokens.colors.errorBorder}`,
                    backgroundColor: tokens.colors.errorLight,
                  }
                : {
                    borderColor: tokens.colors.border,
                    backgroundColor: tokens.colors.white,
                  }
            }
          >
            {/* Country code display */}
            <span
              className="text-base pl-5 pr-2"
              style={{ color: tokens.colors.textInput }}
            >
              +54
            </span>
            {/* Phone number input */}
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={onPhoneChange}
              onBlur={onPhoneBlur}
              placeholder={t('phonePlaceholder')}
              className="flex-1 h-full px-2 text-base outline-none bg-transparent placeholder:text-[#9da3b5]"
              style={{ color: tokens.colors.textInput }}
            />
          </div>
        </div>
        {hasPhoneError && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            *{errors.phone || validation.phoneError}
          </p>
        )}
      </div>
    </>
  );
}

