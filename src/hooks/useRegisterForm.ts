'use client';

import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  cuit: string;
  alias: string;
  phone: string;
  photo: string;
}

export interface RegisterValidation {
  emailError: string;
  emailChecking: boolean;
  emailOk: boolean;
  cuitError: string;
  cuitChecking: boolean;
  cuitOk: boolean;
  phoneError: string;
  phoneChecking: boolean;
  phoneOk: boolean;
}

export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    name: '',
    cuit: '',
    alias: '',
    phone: '',
    photo: '',
  });

  const [validation, setValidation] = useState<RegisterValidation>({
    emailError: '',
    emailChecking: false,
    emailOk: false,
    cuitError: '',
    cuitChecking: false,
    cuitOk: false,
    phoneError: '',
    phoneChecking: false,
    phoneOk: false,
  });

  const [step, setStep] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Get tRPC utils
  const utils = trpc.useUtils();

  // Mutations
  const registerMutation = trpc.register.register.useMutation({
    onSuccess: (data) => {
      setRegistrationSuccess(true);
      setRegisteredEmail(formData.email);
    },
    onError: (error) => {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('email')) {
        setValidation((prev) => ({ ...prev, emailError: error.message, emailOk: false }));
        setStep(1);
      } else if (errorMessage.includes('cuit')) {
        setValidation((prev) => ({ ...prev, cuitError: error.message, cuitOk: false }));
        setStep(2);
      }
    },
  });

  const resendVerificationMutation = trpc.register.resendVerification.useMutation();

  // Validation helpers
  const validateEmail = useCallback((email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }, []);

  const validatePassword = useCallback((password: string): boolean => {
    return password.length >= 8;
  }, []);

  // Update form data
  const updateFormData = useCallback(
    <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Check email availability
  const checkEmail = useCallback(
    async (email: string) => {
      if (!validateEmail(email)) {
        setValidation((prev) => ({
          ...prev,
          emailError: 'Please enter a valid email',
          emailOk: false,
        }));
        return false;
      }

      setValidation((prev) => ({ ...prev, emailChecking: true, emailError: '' }));

      try {
        const result = await utils.register.checkEmail.fetch({ email });
        setValidation((prev) => ({
          ...prev,
          emailChecking: false,
          emailError: result.available ? '' : result.message,
          emailOk: result.available,
        }));
        return result.available;
      } catch (error) {
        setValidation((prev) => ({
          ...prev,
          emailChecking: false,
          emailError: 'Error checking email',
          emailOk: false,
        }));
        return false;
      }
    },
    [validateEmail, utils.register.checkEmail]
  );

  // Check CUIT availability
  const checkCuit = useCallback(
    async (cuit: string) => {
      const cuitDigits = cuit.replace(/\D/g, '');
      if (cuitDigits.length !== 11) {
        setValidation((prev) => ({
          ...prev,
          cuitError: 'CUIT must be 11 digits',
          cuitOk: false,
        }));
        return false;
      }

      setValidation((prev) => ({ ...prev, cuitChecking: true, cuitError: '' }));

      try {
        const result = await utils.register.checkCuit.fetch({ cuit: cuitDigits });
        setValidation((prev) => ({
          ...prev,
          cuitChecking: false,
          cuitError: result.available ? '' : result.message,
          cuitOk: result.valid && result.available,
        }));
        return result.valid && result.available;
      } catch (error) {
        setValidation((prev) => ({
          ...prev,
          cuitChecking: false,
          cuitError: 'Error checking CUIT',
          cuitOk: false,
        }));
        return false;
      }
    },
    [utils.register.checkCuit]
  );

  // Check phone validity
  const checkPhone = useCallback(
    async (phone: string) => {
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 8) {
        setValidation((prev) => ({
          ...prev,
          phoneError: 'Phone number is too short',
          phoneOk: false,
        }));
        return false;
      }

      setValidation((prev) => ({ ...prev, phoneChecking: true, phoneError: '' }));

      try {
        const result = await utils.register.checkPhone.fetch({ phone: phoneDigits });
        setValidation((prev) => ({
          ...prev,
          phoneChecking: false,
          phoneError: result.valid ? '' : result.message,
          phoneOk: result.valid,
        }));
        return result.valid;
      } catch (error) {
        setValidation((prev) => ({
          ...prev,
          phoneChecking: false,
          phoneError: 'Error checking phone',
          phoneOk: false,
        }));
        return false;
      }
    },
    [utils.register.checkPhone]
  );

  // Submit registration
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      registerMutation.mutate({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        cuit: formData.cuit.replace(/\D/g, ''),
        alias: formData.alias,
        phone: formData.phone.replace(/\D/g, ''),
        photo: formData.photo,
      });
    },
    [formData, registerMutation]
  );

  // Resend verification email
  const resendVerificationEmail = useCallback(
    async (email: string) => {
      return resendVerificationMutation.mutateAsync({ email });
    },
    [resendVerificationMutation]
  );

  // Clear validation error
  const clearValidationError = useCallback(
    (field: 'email' | 'cuit' | 'phone') => {
      setValidation((prev) => ({
        ...prev,
        [`${field}Error`]: '',
      }));
    },
    []
  );

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      name: '',
      cuit: '',
      alias: '',
      phone: '',
      photo: '',
    });
    setValidation({
      emailError: '',
      emailChecking: false,
      emailOk: false,
      cuitError: '',
      cuitChecking: false,
      cuitOk: false,
      phoneError: '',
      phoneChecking: false,
      phoneOk: false,
    });
    setStep(1);
    setRegistrationSuccess(false);
    setRegisteredEmail('');
  }, []);

  return {
    // Form data
    formData,
    updateFormData,

    // Validation
    validation,
    validateEmail,
    validatePassword,
    checkEmail,
    checkCuit,
    checkPhone,
    clearValidationError,

    // Step management
    step,
    setStep,

    // Submission
    handleSubmit,
    isSubmitting: registerMutation.isPending,
    submitError: registerMutation.error?.message,

    // Registration result
    registrationSuccess,
    registeredEmail,

    // Resend verification
    resendVerificationEmail,
    isResending: resendVerificationMutation.isPending,

    // Reset
    resetForm,
  };
}

