import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { backendClient } from '@/lib/backend-client';

// Input schemas
const checkEmailSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

const checkCuitSchema = z.object({
  cuit: z.string().min(11, 'CUIT must be 11 digits').max(11, 'CUIT must be 11 digits'),
});

const checkPhoneSchema = z.object({
  phone: z.string().min(8, 'Phone number is too short'),
});

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  cuit: z.string().min(11, 'CUIT must be 11 digits').max(11, 'CUIT must be 11 digits'),
  alias: z.string().min(1, 'Alias is required'),
  phone: z.string().min(8, 'Phone number is required'),
  profilePicture: z.string().min(1, 'Profile picture is required'),
});

export const registerRouter = router({
  // ============================================
  // QUERIES
  // ============================================

  /**
   * Check if email is already registered
   */
  checkEmail: publicProcedure
    .input(checkEmailSchema)
    .query(async ({ input }) => {
      try {
        const response = await backendClient.get('/api/register/check-email', {
          params: { email: input.email },
        });
        return {
          available: response.data.available,
          message: response.data.message,
        };
      } catch (error: any) {
        // Handle 401 Unauthorized (missing API key)
        if (error.response?.status === 401) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: error.response?.data?.message || 'API key is missing or invalid. Please check your environment variables.',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || error.response?.data?.message || 'Failed to check email',
        });
      }
    }),

  /**
   * Check if CUIT is already registered
   */
  checkCuit: publicProcedure
    .input(checkCuitSchema)
    .query(async ({ input }) => {
      try {
        const cuitDigits = input.cuit.replace(/\D/g, '');
        const response = await backendClient.get('/api/register/check-cuit', {
          params: { cuit: cuitDigits },
        });
        return {
          valid: response.data.valid,
          available: response.data.available,
          message: response.data.message,
        };
      } catch (error: any) {
        // Log the full error for debugging
        console.error('Error checking CUIT:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });

        // Handle 401 Unauthorized (missing API key)
        if (error.response?.status === 401) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: error.response?.data?.message || 'API key is missing or invalid. Please check your environment variables.',
          });
        }

        throw new TRPCError({
          code: error.response?.status === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || error.response?.data?.message || 'Failed to check CUIT',
        });
      }
    }),

  /**
   * Validate phone number format
   */
  checkPhone: publicProcedure
    .input(checkPhoneSchema)
    .query(async ({ input }) => {
      // Basic Argentine phone validation (expecting format like 1155556666)
      const phoneDigits = input.phone.replace(/\D/g, '');
      const isValid = phoneDigits.length >= 8 && phoneDigits.length <= 12;
      
      return {
        valid: isValid,
        message: isValid ? 'Phone number is valid' : 'Invalid phone number format',
      };
    }),

  // ============================================
  // MUTATIONS
  // ============================================

  /**
   * Register a new user
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      try {
        const response = await backendClient.post('/api/register', {
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
          cuit: input.cuit,
          alias: input.alias,
          phone: input.phone,
          profilePicture: input.profilePicture,
        });

        return {
          success: response.data.success,
          message: 'Registration successful!',
          user: response.data.data,
        };
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to register';
        throw new TRPCError({
          code: error.response?.status === 409 ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
        });
      }
    }),

  /**
   * Recover account by CUIT
   */
  recoverByCuit: publicProcedure
    .input(z.object({ cuit: z.string().min(11, 'CUIT must be 11 digits').max(11, 'CUIT must be 11 digits') }))
    .mutation(async ({ input }) => {
      try {
        const cuitDigits = input.cuit.replace(/\D/g, '');
        const response = await backendClient.post('/api/register/recover-by-cuit', {
          cuit: cuitDigits,
        });
        return {
          success: response.data.success,
          message: response.data.message,
          emailMasked: response.data.emailMasked,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || 'Failed to recover account',
        });
      }
    }),

  /**
   * Complete user profile (for Clerk users)
   */
  completeProfile: publicProcedure
    .input(z.object({
      userId: z.string().optional(),
      password: z.string().min(8, 'Password must be at least 8 characters').optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      cuit: z.string().min(11, 'CUIT must be 11 digits').max(11, 'CUIT must be 11 digits'),
      alias: z.string().optional(),
      profilePicture: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { userId, ...profileData } = input;
        const response = await backendClient.post('/api/register/complete-profile', profileData, {
          params: userId ? { userId } : undefined,
        });
        return {
          success: response.data.success,
          message: response.data.message,
          user: response.data.data,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: error.response?.status === 409 ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || 'Failed to complete profile',
        });
      }
    }),

  /**
   * Unify login methods (link Clerk to existing account)
   */
  unifyLogin: publicProcedure
    .input(z.object({
      email: z.string().email(),
      clerkId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const response = await backendClient.post('/api/register/unify-login', input);
        return {
          success: response.data.success,
          message: response.data.message,
          user: response.data.data,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: error.response?.status === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || 'Failed to unify login methods',
        });
      }
    }),
});

