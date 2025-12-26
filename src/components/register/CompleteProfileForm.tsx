'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import { trpc } from '@/lib/trpc';
import { backendClient } from '@/lib/backend-client';
import { AlertTriangle, Eye, EyeOff, Check, User, Mail, Lock, Phone, CreditCard, Building } from 'lucide-react';
import { tokens } from '@/styles/tokens';
import toast from 'react-hot-toast';

interface CompleteProfileFormProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export function CompleteProfileForm({ onComplete, onCancel }: CompleteProfileFormProps) {
  const { user: clerkUser } = useUser();
  const t = useTranslations('register.completeProfile');
  const [showPassword, setShowPassword] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: '',
    firstName: clerkUser?.firstName || '',
    lastName: clerkUser?.lastName || '',
    phone: '',
    cuit: '',
    alias: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validation, setValidation] = useState({
    cuitError: '',
    cuitChecking: false,
    cuitOk: false,
  });

  const utils = trpc.useUtils();
  
  // Initialize user - check if exists, create if not
  useEffect(() => {
    const initializeUser = async () => {
      if (!clerkUser?.id) {
        console.error('No Clerk user ID found');
        setIsInitializing(false);
        return;
      }

      try {
        // Try to get user by Clerk ID
        const response = await backendClient.get(`/api/users/clerk/${clerkUser.id}`);
        const foundUserId = response.data.data?._id || response.data.data?.id;
        if (foundUserId) {
          console.log('✅ User found in backend:', foundUserId);
          setUserId(foundUserId);
          setIsInitializing(false);
          return;
        }
      } catch (error: any) {
        console.log('⚠️ User not found, attempting to create:', {
          status: error.response?.status,
          clerkId: clerkUser.id,
        });

        // If user not found (404), create the user
        if (error.response?.status === 404) {
          try {
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            if (!email) {
              console.error('No email found for Clerk user');
              toast.error(t('noEmail', { defaultValue: 'No email found. Please contact support.' }));
              setIsInitializing(false);
              return;
            }

            console.log('Creating user in backend...', {
              clerkId: clerkUser.id,
              email,
              firstName: clerkUser.firstName,
              lastName: clerkUser.lastName,
            });

            const userData: any = {
              clerkId: clerkUser.id,
              email,
              firstName: clerkUser.firstName || undefined,
              lastName: clerkUser.lastName || undefined,
              profilePicture: clerkUser.imageUrl || undefined,
              profileCompleted: false,
            };

            const createResponse = await backendClient.post('/api/register', userData);
            const createdUser = createResponse.data.data;
            const createdUserId = createdUser?._id || createdUser?.id;

            console.log('✅ User created successfully:', createdUserId);
            
            if (createdUserId) {
              setUserId(createdUserId);
            } else {
              toast.error(t('createError', { defaultValue: 'Failed to create user. Please try again.' }));
            }
          } catch (createError: any) {
            console.error('❌ Error creating user:', {
              status: createError.response?.status,
              data: createError.response?.data,
              message: createError.message,
            });

            if (createError.response?.status === 409 && createError.response?.data?.existingUser) {
              // User exists with email - unify login methods by linking Clerk ID
              console.log('User exists with email, attempting to unify login methods...');
              try {
                const unifyResponse = await backendClient.post('/api/register/unify-login', {
                  email: clerkUser.emailAddresses[0]?.emailAddress,
                  clerkId: clerkUser.id,
                });
                
                if (unifyResponse.data.success && unifyResponse.data.data) {
                  const unifiedUserId = unifyResponse.data.data?._id || unifyResponse.data.data?.id;
                  console.log('✅ Login methods unified successfully:', unifiedUserId);
                  setUserId(unifiedUserId);
                  return;
                }
              } catch (unifyError: any) {
                console.error('Error unifying login methods:', {
                  status: unifyError.response?.status,
                  data: unifyError.response?.data,
                  message: unifyError.message,
                });
                toast.error(
                  unifyError.response?.data?.message ||
                  t('unifyError', { defaultValue: 'Failed to link account. Please contact support.' })
                );
              }
            } else if (createError.response?.status === 409) {
              // Other 409 errors (e.g., Clerk ID already exists) - try to get user
              try {
                const retryResponse = await backendClient.get(`/api/users/clerk/${clerkUser.id}`);
                const retryUserId = retryResponse.data.data?._id || retryResponse.data.data?.id;
                if (retryUserId) {
                  console.log('✅ User found after creation attempt:', retryUserId);
                  setUserId(retryUserId);
                } else {
                  toast.error(t('createError', { defaultValue: 'Failed to create user. Please try again.' }));
                }
              } catch (retryError) {
                console.error('Error retrying user fetch:', retryError);
                toast.error(t('createError', { defaultValue: 'Failed to create user. Please try again.' }));
              }
            } else {
              toast.error(
                createError.response?.data?.message ||
                t('createError', { defaultValue: 'Failed to create user. Please try again.' })
              );
            }
          }
        } else {
          console.error('Unexpected error getting user ID:', error);
          toast.error(t('userError', { defaultValue: 'Error loading user. Please try again.' }));
        }
      } finally {
        setIsInitializing(false);
      }
    };

    if (clerkUser?.id) {
      console.log('🚀 Initializing user for Clerk ID:', clerkUser.id);
      initializeUser();
    } else {
      console.warn('⚠️ No Clerk user available yet');
      setIsInitializing(false);
    }
  }, [clerkUser?.id, t]);

  // Update form data when Clerk user data changes
  useEffect(() => {
    if (clerkUser) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || clerkUser.firstName || '',
        lastName: prev.lastName || clerkUser.lastName || '',
      }));
    }
  }, [clerkUser]);

  const completeProfileMutation = trpc.register.completeProfile.useMutation({
    onSuccess: () => {
      toast.success(t('success', { defaultValue: 'Profile completed successfully!' }));
      onComplete();
    },
    onError: (error) => {
      toast.error(error.message || t('error', { defaultValue: 'Failed to complete profile' }));
    },
  });

  const checkCuit = useCallback(
    async (cuit: string) => {
      const cuitDigits = cuit.replace(/\D/g, '');
      if (cuitDigits.length !== 11) {
        setValidation((prev) => ({
          ...prev,
          cuitError: t('cuitInvalid', { defaultValue: 'CUIT must be exactly 11 digits' }),
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
          cuitError: t('cuitCheckError', { defaultValue: 'Error checking CUIT' }),
          cuitOk: false,
        }));
        return false;
      }
    },
    [utils.register.checkCuit, t]
  );

  const handleCuitBlur = useCallback(() => {
    if (formData.cuit.trim()) {
      checkCuit(formData.cuit);
    }
  }, [formData.cuit, checkCuit]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      // Validation
      if (!formData.password || formData.password.length < 8) {
        newErrors.password = t('passwordRequired', { defaultValue: 'Password must be at least 8 characters' });
      }
      if (!formData.firstName.trim()) {
        newErrors.firstName = t('firstNameRequired', { defaultValue: 'First name is required' });
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = t('lastNameRequired', { defaultValue: 'Last name is required' });
      }
      if (!formData.phone.trim()) {
        newErrors.phone = t('phoneRequired', { defaultValue: 'Phone is required' });
      }
      if (!formData.cuit.trim() || formData.cuit.replace(/\D/g, '').length !== 11) {
        newErrors.cuit = t('cuitRequired', { defaultValue: 'CUIT is required and must be 11 digits' });
      } else if (!validation.cuitOk) {
        newErrors.cuit = validation.cuitError || t('cuitInvalid', { defaultValue: 'CUIT is invalid or already registered' });
      }
      if (!formData.alias.trim()) {
        newErrors.alias = t('aliasRequired', { defaultValue: 'Alias is required' });
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Check if user ID is available
      if (!userId) {
        toast.error(t('userNotFound', { defaultValue: 'User not found. Please try refreshing the page.' }));
        return;
      }

      // Submit
      completeProfileMutation.mutate({
        userId,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone.replace(/\D/g, ''),
        cuit: formData.cuit.replace(/\D/g, ''),
        alias: formData.alias,
        profilePicture: clerkUser?.imageUrl,
      });
    },
    [formData, validation, completeProfileMutation, clerkUser, t, userId]
  );

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: tokens.colors.textPrimary }}>
            {t('error', { defaultValue: 'Error' })}
          </h1>
          <p className="text-sm" style={{ color: tokens.colors.textSecondary }}>
            {t('userError', { defaultValue: 'Error loading user. Please try refreshing the page.' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: tokens.colors.textPrimary }}>
            {t('title', { defaultValue: 'Complete Your Profile' })}
          </h1>
          <p className="text-sm" style={{ color: tokens.colors.textSecondary }}>
            {t('subtitle', { defaultValue: 'Please provide the following information to complete your account setup' })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold" style={{ color: tokens.colors.textInput }}>
              {t('password', { defaultValue: 'Password' })} *
            </label>
            <div className="relative">
              {errors.password && (
                <AlertTriangle className="absolute right-12 top-1/2 -translate-y-1/2 z-10" style={{ color: tokens.colors.error }} size={18} />
              )}
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, password: e.target.value }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.password;
                    return newErrors;
                  });
                }}
                placeholder={t('passwordPlaceholder', { defaultValue: 'Enter your password' })}
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
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {formData.password.length >= 8 && !errors.password && (
                  <Check size={17} style={{ color: tokens.colors.success }} />
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: tokens.colors.icon }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: tokens.colors.icon }} />
            </div>
            {errors.password && (
              <p className="text-sm" style={{ color: tokens.colors.error }}>
                *{errors.password}
              </p>
            )}
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold" style={{ color: tokens.colors.textInput }}>
              {t('firstName', { defaultValue: 'First Name' })} *
            </label>
            <div className="relative">
              {errors.firstName && (
                <AlertTriangle className="absolute right-5 top-1/2 -translate-y-1/2 z-10" style={{ color: tokens.colors.error }} size={18} />
              )}
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.firstName;
                    return newErrors;
                  });
                }}
                placeholder={t('firstNamePlaceholder', { defaultValue: 'Enter your first name' })}
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
              />
              <User className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: tokens.colors.icon }} />
            </div>
            {errors.firstName && (
              <p className="text-sm" style={{ color: tokens.colors.error }}>
                *{errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold" style={{ color: tokens.colors.textInput }}>
              {t('lastName', { defaultValue: 'Last Name' })} *
            </label>
            <div className="relative">
              {errors.lastName && (
                <AlertTriangle className="absolute right-5 top-1/2 -translate-y-1/2 z-10" style={{ color: tokens.colors.error }} size={18} />
              )}
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.lastName;
                    return newErrors;
                  });
                }}
                placeholder={t('lastNamePlaceholder', { defaultValue: 'Enter your last name' })}
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
              />
              <User className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: tokens.colors.icon }} />
            </div>
            {errors.lastName && (
              <p className="text-sm" style={{ color: tokens.colors.error }}>
                *{errors.lastName}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-bold" style={{ color: tokens.colors.textInput }}>
              {t('phone', { defaultValue: 'Phone' })} *
            </label>
            <div className="relative">
              {errors.phone && (
                <AlertTriangle className="absolute right-5 top-1/2 -translate-y-1/2 z-10" style={{ color: tokens.colors.error }} size={18} />
              )}
              <div
                className="h-[48px] w-full rounded-full border flex items-center overflow-visible"
                style={
                  errors.phone
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
                <span className="text-base pl-5 pr-2" style={{ color: tokens.colors.textInput }}>
                  +54
                </span>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData((prev) => ({ ...prev, phone: value }));
                    setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.phone;
                    return newErrors;
                  });
                  }}
                  placeholder={t('phonePlaceholder', { defaultValue: 'Enter your phone number' })}
                  className="flex-1 h-full px-2 text-base outline-none bg-transparent placeholder:text-[#9da3b5]"
                  style={{ color: tokens.colors.textInput }}
                />
              </div>
            </div>
            {errors.phone && (
              <p className="text-sm" style={{ color: tokens.colors.error }}>
                *{errors.phone}
              </p>
            )}
          </div>

          {/* CUIT */}
          <div className="space-y-2">
            <label className="text-sm font-bold" style={{ color: tokens.colors.textInput }}>
              {t('cuit', { defaultValue: 'CUIT' })} *
            </label>
            <div className="relative">
              {(errors.cuit || validation.cuitError) && (
                <AlertTriangle className="absolute right-5 top-1/2 -translate-y-1/2 z-10" style={{ color: tokens.colors.error }} size={18} />
              )}
              {validation.cuitChecking && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <input
                type="text"
                value={formData.cuit}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData((prev) => ({ ...prev, cuit: value }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.cuit;
                    return newErrors;
                  });
                  setValidation((prev) => ({ ...prev, cuitError: '', cuitOk: false }));
                }}
                onBlur={handleCuitBlur}
                maxLength={11}
                placeholder={t('cuitPlaceholder', { defaultValue: 'Enter your CUIT' })}
                className="h-[48px] w-full rounded-full border px-5 text-base outline-none transition placeholder:text-[#9da3b5]"
                style={
                  errors.cuit || validation.cuitError
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
            {(errors.cuit || validation.cuitError) && (
              <p className="text-sm" style={{ color: tokens.colors.error }}>
                *{errors.cuit || validation.cuitError}
              </p>
            )}
          </div>

          {/* Alias */}
          <div className="space-y-2">
            <label className="text-sm font-bold" style={{ color: tokens.colors.textInput }}>
              {t('alias', { defaultValue: 'Bank Alias' })} *
            </label>
            <div className="relative">
              {errors.alias && (
                <AlertTriangle className="absolute right-5 top-1/2 -translate-y-1/2 z-10" style={{ color: tokens.colors.error }} size={18} />
              )}
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, alias: e.target.value }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.alias;
                    return newErrors;
                  });
                }}
                placeholder={t('aliasPlaceholder', { defaultValue: 'Enter your bank alias' })}
                className="h-[48px] w-full rounded-full border px-12 text-base outline-none transition placeholder:text-[#9da3b5]"
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
              <Building className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: tokens.colors.icon }} />
            </div>
            {errors.alias && (
              <p className="text-sm" style={{ color: tokens.colors.error }}>
                *{errors.alias}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 h-[48px] rounded-full border text-base font-semibold transition"
                style={{
                  borderColor: tokens.colors.border,
                  color: tokens.colors.textSecondary,
                  backgroundColor: 'white',
                }}
              >
                {t('cancel', { defaultValue: 'Cancel' })}
              </button>
            )}
            <button
              type="submit"
              disabled={completeProfileMutation.isPending}
              className="flex-1 h-[48px] rounded-full text-base font-semibold text-white transition disabled:opacity-50"
              style={{
                backgroundColor: tokens.colors.primary,
              }}
            >
              {completeProfileMutation.isPending
                ? t('submitting', { defaultValue: 'Submitting...' })
                : t('submit', { defaultValue: 'Complete Profile' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

