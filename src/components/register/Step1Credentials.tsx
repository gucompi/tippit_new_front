'use client';

import { User, Mail, Lock, AlertTriangle, Eye, EyeOff, Check } from 'lucide-react';
import { SignUpButton, SignedOut } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { tokens } from '@/styles/tokens';

interface Step1Props {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  showPassword: boolean;
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };
  validation: {
    emailError: string;
    emailChecking: boolean;
    emailOk: boolean;
  };
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailBlur: () => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function Step1Credentials({
  firstName,
  lastName,
  email,
  password,
  showPassword,
  errors,
  validation,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onEmailBlur,
  onPasswordChange,
  onTogglePassword,
  onFocus,
  onBlur,
}: Step1Props) {
  const t = useTranslations('register.step1');
  const hasEmailError = errors.email || validation.emailError;
  const isPasswordValid = password.length >= 8;

  return (
    <>
      {/* First Name Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <label
          htmlFor="firstName"
          className="text-sm font-bold leading-5"
          style={{
            color: tokens.colors.textInput,
            fontFamily: tokens.typography.fontFamily.primary,
            letterSpacing: tokens.typography.letterSpacing.tight,
          }}
        >
          {t('firstName', { defaultValue: 'First Name' })}
        </label>
        <div className="relative">
          {errors.firstName && (
            <AlertTriangle
              className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
              style={{ color: tokens.colors.error }}
              size={18}
            />
          )}
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder={t('firstNamePlaceholder', { defaultValue: 'Enter your first name' })}
            value={firstName}
            onChange={onFirstNameChange}
            className="h-[48px] w-full rounded-full border px-12 text-base outline-none transition placeholder:text-[#9da3b5]"
            style={
              errors.firstName
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
            autoComplete="given-name"
          />
          <User
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: tokens.colors.icon }}
          />
        </div>
        {errors.firstName && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            *{errors.firstName}
          </p>
        )}
      </div>

      {/* Last Name Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <label
          htmlFor="lastName"
          className="text-sm font-bold leading-5"
          style={{
            color: tokens.colors.textInput,
            fontFamily: tokens.typography.fontFamily.primary,
            letterSpacing: tokens.typography.letterSpacing.tight,
          }}
        >
          {t('lastName', { defaultValue: 'Last Name' })}
        </label>
        <div className="relative">
          {errors.lastName && (
            <AlertTriangle
              className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
              style={{ color: tokens.colors.error }}
              size={18}
            />
          )}
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder={t('lastNamePlaceholder', { defaultValue: 'Enter your last name' })}
            value={lastName}
            onChange={onLastNameChange}
            className="h-[48px] w-full rounded-full border px-12 text-base outline-none transition placeholder:text-[#9da3b5]"
            style={
              errors.lastName
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
            autoComplete="family-name"
          />
          <User
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: tokens.colors.icon }}
          />
        </div>
        {errors.lastName && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            *{errors.lastName}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <label
          htmlFor="email"
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
          {hasEmailError && (
            <AlertTriangle
              className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
              style={{ color: tokens.colors.error }}
              size={18}
            />
          )}
          {validation.emailChecking && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <input
            type="email"
            id="email"
            name="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={onEmailChange}
            onBlur={onEmailBlur}
            className="h-[48px] w-full rounded-full border px-12 text-base outline-none transition placeholder:text-[#9da3b5]"
            style={
              hasEmailError
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
            autoComplete="email"
          />
          <Mail
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: tokens.colors.icon }}
          />
        </div>
        {hasEmailError && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            *{errors.email || validation.emailError}
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
        <div className="relative w-full">
          {errors.password && (
            <AlertTriangle
              className="absolute right-12 top-1/2 -translate-y-1/2 z-10"
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
            onFocus={onFocus}
            onBlur={onBlur}
            className="h-[48px] w-full rounded-full border px-12 text-base outline-none transition placeholder:text-[#9da3b5]"
            style={
              errors.password
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
            autoComplete="new-password"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isPasswordValid && !errors.password && (
              <Check size={17} style={{ color: tokens.colors.success }} />
            )}
            <button
              type="button"
              onClick={onTogglePassword}
              style={{ color: tokens.colors.icon }}
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <Lock
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: tokens.colors.icon }}
          />
        </div>
        {errors.password && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            *{errors.password}
          </p>
        )}
      </div>

      {/* Divider and Google Sign Up Button - Only show when signed out */}
      <SignedOut>
        <div className="flex w-full items-center gap-4 my-4">
          <div className="flex-1 border-t" style={{ borderColor: tokens.colors.border }}></div>
          <span className="text-sm" style={{ color: tokens.colors.textSecondary }}>
            {t('or', { defaultValue: 'or' })}
          </span>
          <div className="flex-1 border-t" style={{ borderColor: tokens.colors.border }}></div>
        </div>

        {/* Google Sign Up Button */}
        <div className="w-full">
          <SignUpButton
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
              {t('signUpWithGoogle', { defaultValue: 'Sign up with Google' })}
            </button>
          </SignUpButton>
        </div>
      </SignedOut>
    </>
  );
}

