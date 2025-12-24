'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SignInButton, SignedOut } from '@clerk/nextjs';
import { Mail, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { tokens } from '@/styles/tokens';

interface LoginFormProps {
  email: string;
  password: string;
  formErrors: {
    email?: string;
    password?: string;
  };
  isOwner: boolean;
  isSubmitting: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function LoginForm({
  email,
  password,
  formErrors,
  isOwner,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  onFocus,
  onBlur,
}: LoginFormProps) {
  const t = useTranslations('auth.login');
  const [showPassword, setShowPassword] = useState(false);

  const inputBaseStyles = `h-[${tokens.sizing.inputHeight.md}] w-full rounded-full border px-12 text-base outline-none transition placeholder:text-[${tokens.colors.textPlaceholder}]`;
  const inputNormalStyles = `border-[${tokens.colors.border}] bg-white focus:border-[${tokens.colors.primary}] text-[${tokens.colors.textInput}]`;

  return (
    <form
      role="form"
      onSubmit={onSubmit}
      className="flex w-full flex-col items-center space-y-6"
    >
      {/* Email Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <label
          htmlFor="emailOwner"
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
          {formErrors.email && (
            <AlertTriangle
              className="absolute right-5 top-1/2 -translate-y-1/2 z-10 text-lg"
              style={{ color: tokens.colors.error }}
              size={18}
            />
          )}
          <input
            type="text"
            id="emailOwner"
            name="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={onEmailChange}
            className={`${inputBaseStyles} ${formErrors.email ? '' : inputNormalStyles}`}
            style={
              formErrors.email
                ? {
                    border: `1px solid ${tokens.colors.errorBorder}`,
                    backgroundColor: tokens.colors.errorLight,
                    color: tokens.colors.textInput,
                  }
                : {}
            }
            autoComplete="username"
            disabled={isSubmitting}
          />
          <Mail 
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2" 
            style={{ color: tokens.colors.icon }}
          />
        </div>
        {formErrors.email && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            *{formErrors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-bold leading-5"
          style={{ 
            color: tokens.colors.textInput,
            fontFamily: tokens.typography.fontFamily.primary,
            letterSpacing: tokens.typography.letterSpacing.tight,
          }}
        >
          {t('password')}
        </label>
        <div className="relative w-full input-lock">
          {formErrors.password && (
            <AlertTriangle
              className="absolute right-12 top-1/2 -translate-y-1/2 z-10 text-lg"
              style={{ color: tokens.colors.error }}
              size={18}
            />
          )}
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('passwordPlaceholder')}
            value={password}
            onChange={onPasswordChange}
            className={`${inputBaseStyles} ${formErrors.password ? '' : inputNormalStyles}`}
            style={
              formErrors.password
                ? {
                    border: `1px solid ${tokens.colors.errorBorder}`,
                    backgroundColor: tokens.colors.errorLight,
                    color: tokens.colors.textInput,
                  }
                : {}
            }
            autoComplete="current-password"
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2"
            style={{ color: tokens.colors.icon }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={isSubmitting}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <Lock 
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2" 
            style={{ color: tokens.colors.icon }}
          />
        </div>
        {formErrors.password && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            *{formErrors.password}
          </p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex w-full max-w-[379px] items-center justify-end text-sm">
        <button
          type="button"
          className="text-xs leading-4 text-right underline-offset-4 hover:underline"
          style={{ 
            color: tokens.colors.secondary,
            fontFamily: tokens.typography.fontFamily.primary,
            fontWeight: tokens.typography.fontWeight.regular,
          }}
          onClick={onForgotPassword}
          disabled={isSubmitting}
        >
          {t('forgotPassword')}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full max-w-[401px] text-sm font-semibold uppercase tracking-wide text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
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

      {/* Divider and Google Sign In Button - Only show when signed out */}
      <SignedOut>
        <div className="flex w-full max-w-[401px] items-center gap-4 my-4">
          <div className="flex-1 border-t" style={{ borderColor: tokens.colors.border }}></div>
          <span className="text-sm" style={{ color: tokens.colors.textSecondary }}>
            {t('or', { defaultValue: 'or' })}
          </span>
          <div className="flex-1 border-t" style={{ borderColor: tokens.colors.border }}></div>
        </div>

        {/* Google Sign In Button */}
        <div className="w-full max-w-[401px]">
          <SignInButton
            mode="modal"
            forceRedirectUrl="/profile"
          >
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-wide text-gray-700 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border"
              style={{
                height: tokens.sizing.buttonHeight.lg,
                borderRadius: tokens.borderRadius.lg,
                backgroundColor: 'white',
                borderColor: tokens.colors.border,
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('signInWithGoogle', { defaultValue: 'Sign in with Google' })}
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* Create Account Link (only for workers) */}
      {!isOwner && (
        <p 
          className="mt-4 text-center text-sm"
          style={{ color: tokens.colors.textSecondary }}
        >
          {t('createAccount')}{' '}
          <Link
            href="/register"
            className="underline-offset-4 hover:underline"
            style={{ 
              color: tokens.colors.secondary,
              fontFamily: tokens.typography.fontFamily.primary,
              fontWeight: tokens.typography.fontWeight.regular,
            }}
          >
            {t('createAccountLink')}
          </Link>
        </p>
      )}
    </form>
  );
}
