'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { StepIndicator } from './StepIndicator';
import { Step1Credentials } from './Step1Credentials';
import { Step2Details } from './Step2Details';
import { Step3Photo } from './Step3Photo';
import { NavigationButtons } from './NavigationButtons';
import { tokens } from '@/styles/tokens';
import type { RegisterFormData, RegisterValidation } from '@/hooks/useRegisterForm';

interface RegisterFormProps {
  formData: RegisterFormData;
  validation: RegisterValidation;
  step: number;
  photo: string;
  cameraStatus: 'idle' | 'starting' | 'started' | 'error';
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isIphoneDevice: boolean;
  isSubmitting: boolean;
  onUpdateFormData: <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => void;
  onCheckEmail: (email: string) => Promise<boolean>;
  onCheckCuit: (cuit: string) => Promise<boolean>;
  onCheckPhone: (phone: string) => Promise<boolean>;
  onClearValidationError: (field: 'email' | 'cuit' | 'phone') => void;
  onStartCamera: () => void;
  onCapturePhoto: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export function RegisterForm({
  formData,
  validation,
  step,
  photo,
  cameraStatus,
  videoRef,
  canvasRef,
  isIphoneDevice,
  isSubmitting,
  onUpdateFormData,
  onCheckEmail,
  onCheckCuit,
  onCheckPhone,
  onClearValidationError,
  onStartCamera,
  onCapturePhoto,
  onFileUpload,
  onBack,
  onNext,
  onSubmit,
}: RegisterFormProps) {
  const t1 = useTranslations('register.step1');
  const t2 = useTranslations('register.step2');
  const t3 = useTranslations('register.step3');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    cuit?: string;
    alias?: string;
    phone?: string;
  }>({});

  // Sync validation errors with form errors
  useEffect(() => {
    if (validation.emailError) {
      setFormErrors((prev) => ({ ...prev, email: validation.emailError }));
    }
  }, [validation.emailError]);

  useEffect(() => {
    if (validation.cuitError) {
      setFormErrors((prev) => ({ ...prev, cuit: validation.cuitError }));
    }
  }, [validation.cuitError]);

  useEffect(() => {
    if (validation.phoneError) {
      setFormErrors((prev) => ({ ...prev, phone: validation.phoneError }));
    }
  }, [validation.phoneError]);

  // Sync photo with form data
  useEffect(() => {
    if (photo !== formData.photo) {
      onUpdateFormData('photo', photo);
    }
  }, [photo, formData.photo, onUpdateFormData]);

  // Validation functions
  const isStep1Valid = useCallback(() => {
    return (
      formData.name.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      !validation.emailError &&
      validation.emailOk &&
      formData.password.length >= 8
    );
  }, [formData.name, formData.email, formData.password, validation.emailError, validation.emailOk]);

  const isStep2Valid = useCallback(() => {
    return (
      formData.cuit.replace(/\D/g, '').length === 11 &&
      !validation.cuitError &&
      validation.cuitOk &&
      formData.alias.trim().length > 0 &&
      formData.phone.replace(/\D/g, '').length >= 8 &&
      !validation.phoneError &&
      validation.phoneOk
    );
  }, [formData.cuit, formData.alias, formData.phone, validation.cuitError, validation.cuitOk, validation.phoneError, validation.phoneOk]);

  const isStep3Valid = useCallback(() => {
    return photo.length > 0;
  }, [photo]);

  // Validate step before proceeding
  const validateStep1 = useCallback(() => {
    const errors: typeof formErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = t1('errors.nameRequired');
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = t1('errors.emailRequired');
      isValid = false;
    } else if (validation.emailError) {
      errors.email = validation.emailError;
      isValid = false;
    }

    if (!formData.password) {
      errors.password = t1('errors.passwordRequired');
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = t1('errors.passwordMin');
      isValid = false;
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));
    return isValid;
  }, [formData.name, formData.email, formData.password, validation.emailError, t1]);

  const validateStep2 = useCallback(() => {
    const errors: typeof formErrors = {};
    let isValid = true;

    if (!formData.cuit.trim()) {
      errors.cuit = t2('errors.cuitRequired');
      isValid = false;
    } else if (validation.cuitError) {
      errors.cuit = validation.cuitError;
      isValid = false;
    }

    if (!formData.alias.trim()) {
      errors.alias = t2('errors.aliasRequired');
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = t2('errors.phoneRequired');
      isValid = false;
    } else if (validation.phoneError) {
      errors.phone = validation.phoneError;
      isValid = false;
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));
    return isValid;
  }, [formData.cuit, formData.alias, formData.phone, validation.cuitError, validation.phoneError, t2]);

  // Handlers
  const handleNext = useCallback(() => {
    if (step === 1) {
      if (validateStep1() && isStep1Valid()) {
        onNext();
      }
    } else if (step === 2) {
      if (validateStep2() && isStep2Valid()) {
        onNext();
      }
    } else if (step === 3) {
      if (isStep3Valid()) {
        onSubmit();
      }
    }
  }, [step, validateStep1, validateStep2, isStep1Valid, isStep2Valid, isStep3Valid, onNext, onSubmit]);

  const handleEmailBlur = useCallback(() => {
    if (formData.email.trim()) {
      onCheckEmail(formData.email);
    }
  }, [formData.email, onCheckEmail]);

  const handleCuitBlur = useCallback(() => {
    if (formData.cuit.trim()) {
      onCheckCuit(formData.cuit);
    }
  }, [formData.cuit, onCheckCuit]);

  const handlePhoneBlur = useCallback(() => {
    if (formData.phone.trim()) {
      onCheckPhone(formData.phone);
    }
  }, [formData.phone, onCheckPhone]);

  const getNextDisabled = () => {
    if (step === 1) return !isStep1Valid();
    if (step === 2) return !isStep2Valid();
    if (step === 3) return !isStep3Valid();
    return true;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 3 && isStep3Valid()) {
          onSubmit(e);
        }
      }}
      className="flex w-full flex-col items-center space-y-6 px-4 sm:px-0"
      style={{ paddingTop: '0px', paddingBottom: '16px' }}
    >
      <StepIndicator currentStep={step} totalSteps={3} />

      {step === 1 && (
        <Step1Credentials
          name={formData.name}
          email={formData.email}
          password={formData.password}
          showPassword={showPassword}
          errors={formErrors}
          validation={validation}
          onNameChange={(e) => {
            onUpdateFormData('name', e.target.value);
            setFormErrors((prev) => ({ ...prev, name: undefined }));
          }}
          onEmailChange={(e) => {
            onUpdateFormData('email', e.target.value);
            onClearValidationError('email');
            setFormErrors((prev) => ({ ...prev, email: undefined }));
          }}
          onEmailBlur={handleEmailBlur}
          onPasswordChange={(e) => {
            onUpdateFormData('password', e.target.value);
            setFormErrors((prev) => ({ ...prev, password: undefined }));
          }}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onFocus={() => {}}
          onBlur={() => {
            if (formData.password && formData.password.length < 8) {
              setFormErrors((prev) => ({
                ...prev,
                password: 'Password must be at least 8 characters',
              }));
            }
          }}
        />
      )}

      {step === 2 && (
        <Step2Details
          cuit={formData.cuit}
          alias={formData.alias}
          phone={formData.phone}
          errors={formErrors}
          validation={validation}
          onCuitChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            onUpdateFormData('cuit', value);
            onClearValidationError('cuit');
            setFormErrors((prev) => ({ ...prev, cuit: undefined }));
          }}
          onCuitBlur={handleCuitBlur}
          onAliasChange={(e) => {
            onUpdateFormData('alias', e.target.value);
            setFormErrors((prev) => ({ ...prev, alias: undefined }));
          }}
          onPhoneChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            onUpdateFormData('phone', value);
            onClearValidationError('phone');
            setFormErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          onPhoneBlur={handlePhoneBlur}
        />
      )}

      {step === 3 && (
        <Step3Photo
          photo={photo}
          cameraStatus={cameraStatus}
          videoRef={videoRef}
          canvasRef={canvasRef}
          isIphoneDevice={isIphoneDevice}
          onStartCamera={onStartCamera}
          onCapturePhoto={onCapturePhoto}
          onFileUpload={onFileUpload}
        />
      )}

      <NavigationButtons
        onBack={onBack}
        onNext={handleNext}
        isNextDisabled={getNextDisabled()}
        isSubmitting={isSubmitting}
        isLastStep={step === 3}
      />
    </form>
  );
}

