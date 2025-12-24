'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LoginImage } from './LoginImage';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { PasswordRecoveryForm } from './PasswordRecoveryForm';
import { LoginCardFlipper } from './LoginCardFlipper';
import { AuthOverlay } from './AuthOverlay';
import { LoginPageSkeleton } from './LoginSkeleton';
import { LanguageSwitcher } from '@/components/layout';
import { trpc } from '@/lib/trpc';
import { tokens } from '@/styles/tokens';

export function LoginScreen() {
  const router = useRouter();
  const t = useTranslations('auth.login');
  const tCommon = useTranslations('common');

  // Initial loading state
  const [isPageLoading, setIsPageLoading] = useState(true);

  // State
  const [isOwner, setIsOwner] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDefaultLogo, setShowDefaultLogo] = useState(true);
  const [authSuccess, setAuthSuccess] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [recoveryError, setRecoveryError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  // Get tRPC utils for query invalidation
  const utils = trpc.useUtils();

  // Simulate initial page load delay (shows skeleton while "fetching" initial data)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1200); // 1.2 seconds to show skeleton
    return () => clearTimeout(timer);
  }, []);

  // ============================================
  // tRPC + TanStack Query: Mutations
  // ============================================

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      setAuthSuccess(true);
      
      // Store auth data in localStorage (mock auth persistence)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.user.role);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Invalidate session query to refetch user data
      await utils.auth.getSession.invalidate();
      
      console.log('Login successful:', data);
      
      // Redirect to business dashboard after successful login
      setTimeout(() => {
        router.push('/business');
      }, 1500);
    },
    onError: (error) => {
      setFormErrors({ password: error.message });
    },
  });

  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(data.message);
    },
    onError: (error) => {
      setRecoveryError(error.message);
    },
  });

  // ============================================
  // Handlers
  // ============================================

  const toggleUser = useCallback(() => {
    setIsOwner((prev) => !prev);
    setFormErrors({});
  }, []);

  const handleFocus = useCallback(() => {
    setShowDefaultLogo(false);
  }, []);

  const handleBlur = useCallback(() => {
    setShowDefaultLogo(true);
  }, []);

  const handleFlip = useCallback(() => {
    setIsFlipped(true);
    setFormErrors({});
    setRecoveryError(undefined);
    setSuccessMessage(undefined);
  }, []);

  const handleBack = useCallback(() => {
    setIsFlipped(false);
    setRecoveryEmail('');
    setRecoveryError(undefined);
    setSuccessMessage(undefined);
  }, []);

  const validateLoginForm = useCallback(() => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t('errors.emailInvalid');
    }
    
    if (!password) {
      errors.password = t('errors.passwordRequired');
    } else if (password.length < 6) {
      errors.password = t('errors.passwordMin');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password, t]);

  const handleLoginSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateLoginForm()) return;
      
      // TanStack Query mutation call
      loginMutation.mutate({ email, password, isOwner });
    },
    [email, password, isOwner, validateLoginForm, loginMutation]
  );

  const validateRecoveryForm = useCallback(() => {
    if (!recoveryEmail) {
      setRecoveryError(t('errors.emailRequired'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail)) {
      setRecoveryError(t('errors.emailInvalid'));
      return false;
    }
    setRecoveryError(undefined);
    return true;
  }, [recoveryEmail, t]);

  const handleRecoverySubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateRecoveryForm()) return;
      
      // TanStack Query mutation call
      forgotPasswordMutation.mutate({ email: recoveryEmail });
    },
    [recoveryEmail, validateRecoveryForm, forgotPasswordMutation]
  );

  // Show skeleton during initial load
  if (isPageLoading) {
    return <LoginPageSkeleton />;
  }

  return (
    <div 
      className="flex min-h-screen flex-col lg:flex-row animate-fade-in"
      style={{ backgroundColor: tokens.colors.white }}
    >
      <LoginImage isOwner={isOwner} />

      <div 
        className="flex flex-1 items-center justify-center relative"
        style={{ 
          padding: `${tokens.spacing[10]} ${tokens.spacing[6]}` 
        }}
      >
        {/* Language Switcher */}
        <div className="absolute top-4 right-4">
          <LanguageSwitcher variant="dropdown" showFlags showNames={false} />
        </div>

        <div 
          className="w-full stagger-fade-in"
          style={{ maxWidth: tokens.sizing.maxWidth.form }}
        >
          {!isFlipped && (
            <LoginHeader
              showDefaultLogo={showDefaultLogo}
              isOwner={isOwner}
              onToggleUser={toggleUser}
            />
          )}

          <LoginCardFlipper isFlipped={isFlipped}>
            {/* Front - Login Form */}
            <div
              className="front relative w-full overflow-hidden transition-all duration-400"
              style={{
                borderRadius: tokens.borderRadius.xl,
                backgroundColor: tokens.colors.white,
                padding: tokens.spacing[4],
                visibility: isFlipped ? 'hidden' : 'visible',
              }}
            >
              <LoginForm
                email={email}
                password={password}
                formErrors={formErrors}
                isOwner={isOwner}
                isSubmitting={loginMutation.isPending}
                onEmailChange={(e) => {
                  setEmail(e.target.value);
                  setFormErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onPasswordChange={(e) => {
                  setPassword(e.target.value);
                  setFormErrors((prev) => ({ ...prev, password: undefined }));
                }}
                onSubmit={handleLoginSubmit}
                onForgotPassword={handleFlip}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <div 
                className="mx-auto flex w-full max-w-[379px] items-center justify-center gap-8 text-xs"
                style={{ 
                  marginTop: tokens.spacing[8],
                  color: tokens.colors.textMuted,
                }}
              >
                <span>{tCommon('version')}</span>
              </div>
            </div>

            {/* Back - Password Recovery Form */}
            <div 
              className="back relative w-full overflow-hidden"
              style={{
                borderRadius: tokens.borderRadius.xl,
                backgroundColor: tokens.colors.white,
              }}
            >
              <PasswordRecoveryForm
                email={recoveryEmail}
                formError={recoveryError}
                isSubmitting={forgotPasswordMutation.isPending}
                successMessage={successMessage}
                onEmailChange={(e) => {
                  setRecoveryEmail(e.target.value);
                  setRecoveryError(undefined);
                }}
                onSubmit={handleRecoverySubmit}
                onBack={handleBack}
              />
            </div>
          </LoginCardFlipper>
        </div>
      </div>

      <AuthOverlay
        isSubmitting={loginMutation.isPending}
        authSuccess={authSuccess}
      />
    </div>
  );
}
