'use client';

import { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { useCamera } from '@/hooks/useCamera';
import { RegisterForm } from './RegisterForm';
import { RegistrationSuccess } from './RegistrationSuccess';
import { RegisterPageSkeleton, RegistrationSuccessSkeleton } from './RegisterSkeleton';
import { AuthOverlay } from '../login/AuthOverlay';
import { tokens } from '@/styles/tokens';

export function RegisterScreen() {
  const t = useTranslations('register');
  // Initial loading state
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isStepTransitioning, setIsStepTransitioning] = useState(false);
  const [displayedStep, setDisplayedStep] = useState(1);

  const {
    formData,
    updateFormData,
    validation,
    checkEmail,
    checkCuit,
    checkPhone,
    clearValidationError,
    step,
    setStep,
    handleSubmit,
    isSubmitting,
    submitError,
    registrationSuccess,
    registeredEmail,
    resendVerificationEmail,
    isResending,
  } = useRegisterForm();

  const {
    photo,
    cameraStatus,
    videoRef,
    canvasRef,
    isIphoneDevice,
    startCamera,
    capturePhoto,
    handleFileUpload,
  } = useCamera();

  // Simulate initial page load delay (shows skeleton while "fetching" initial data)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // 1 second to show skeleton
    return () => clearTimeout(timer);
  }, []);

  // Handle step transitions with skeleton
  useEffect(() => {
    if (step !== displayedStep && !isPageLoading) {
      setIsStepTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedStep(step);
        setIsStepTransitioning(false);
      }, 400); // 0.4 seconds skeleton between steps
      return () => clearTimeout(timer);
    }
  }, [step, displayedStep, isPageLoading]);

  const handleBack = useCallback(() => {
    if (step === 1) {
      window.location.href = '/';
    } else {
      setStep((prev) => Math.max(1, prev - 1));
    }
  }, [step, setStep]);

  const handleNext = useCallback(() => {
    setStep((prev) => Math.min(3, prev + 1));
  }, [setStep]);

  // Show skeleton during initial page load
  if (isPageLoading) {
    return <RegisterPageSkeleton step={1} />;
  }

  // Show success screen after registration
  if (registrationSuccess) {
    return (
      <div 
        className="flex min-h-screen flex-col lg:flex-row animate-fade-in" 
        style={{ backgroundColor: tokens.colors.white }}
      >
        {/* Left Side - Image */}
        <div className="relative hidden lg:block lg:w-1/2 overflow-hidden imageLogin">
          <Image
            src="/tippit-waiter.webp"
            alt="Waiter"
            fill
            className="object-cover object-top"
            priority
            sizes="50vw"
          />
        </div>

        {/* Right Side - Success Content */}
        <div
          className="flex flex-1 items-center justify-center"
          style={{ padding: `${tokens.spacing[10]} ${tokens.spacing[6]}` }}
        >
          <div className="w-full animate-fade-in-up" style={{ maxWidth: tokens.sizing.maxWidth.form }}>
            <RegistrationSuccess
              email={registeredEmail}
              onResendEmail={resendVerificationEmail}
              isResending={isResending}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex min-h-screen flex-col lg:flex-row animate-fade-in" 
      style={{ backgroundColor: tokens.colors.white }}
    >
      {/* Left Side - Image */}
      <div className="relative hidden lg:block lg:w-1/2 overflow-hidden imageLogin">
        <Image
          src="/tippit-waiter.webp"
          alt="Waiter"
          fill
          className="object-cover object-top"
          priority
          sizes="50vw"
        />
      </div>

      {/* Right Side - Form Content */}
      <div
        className="flex flex-1 items-center justify-center"
        style={{ padding: `${tokens.spacing[10]} ${tokens.spacing[6]}` }}
      >
        <div className="w-full" style={{ maxWidth: tokens.sizing.maxWidth.form }}>
          {/* Header */}
          <div className="flex flex-col items-center mb-8 stagger-fade-in">
            {/* Logo */}
            <div className="relative mb-4">
              <Image
                src="/Tippit-logo-Texto-1024x242.png"
                alt="Tippit Logo"
                width={150}
                height={35}
                priority
              />
            </div>

            {/* Title */}
            <h1
              className="text-2xl font-bold text-center mb-2"
              style={{
                fontFamily: tokens.typography.fontFamily.primary,
                color: tokens.colors.textPrimary,
              }}
            >
              {t('title')}
            </h1>

            {/* Subtitle with login link */}
            <p
              className="text-center"
              style={{
                fontFamily: tokens.typography.fontFamily.primary,
                color: tokens.colors.textMuted,
              }}
            >
              {t('alreadyHaveAccount')}{' '}
              <Link
                href="/"
                className="underline hover:no-underline transition-colors"
                style={{ color: tokens.colors.primary }}
              >
                {t('loginLink')}
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div
              className="p-3 px-4 rounded-lg mb-4 text-white animate-fade-in"
              style={{ backgroundColor: tokens.colors.error }}
            >
              {submitError}
            </div>
          )}

          {/* Step Transition Skeleton or Form */}
          {isStepTransitioning ? (
            <div className="animate-pulse">
              {displayedStep === 1 && <StepSkeleton step={2} />}
              {displayedStep === 2 && <StepSkeleton step={step > 2 ? 3 : 1} />}
              {displayedStep === 3 && <StepSkeleton step={2} />}
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <RegisterForm
                formData={formData}
                validation={validation}
                step={displayedStep}
                photo={photo}
                cameraStatus={cameraStatus}
                videoRef={videoRef}
                canvasRef={canvasRef}
                isIphoneDevice={isIphoneDevice}
                isSubmitting={isSubmitting}
                onUpdateFormData={updateFormData}
                onCheckEmail={checkEmail}
                onCheckCuit={checkCuit}
                onCheckPhone={checkPhone}
                onClearValidationError={clearValidationError}
                onStartCamera={startCamera}
                onCapturePhoto={capturePhoto}
                onFileUpload={handleFileUpload}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </div>
      </div>

      {/* Auth Overlay */}
      <AuthOverlay isSubmitting={isSubmitting} authSuccess={registrationSuccess} />
    </div>
  );
}

// Simple inline skeleton for step transitions
function StepSkeleton({ step }: { step: number }) {
  return (
    <div className="flex w-full flex-col items-center space-y-6 px-4 sm:px-0">
      {/* Step Indicator */}
      <div className="w-full max-w-[379px] text-center mb-6">
        <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse" />
      </div>

      {/* Fields */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full max-w-[379px] space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 w-full bg-gray-200 rounded-full animate-pulse" />
        </div>
      ))}

      {/* Buttons */}
      <div className="w-full max-w-[379px] flex items-center justify-between">
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-14 w-48 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
