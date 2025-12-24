import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock registered users database
const registeredUsers: Array<{
  id: string;
  email: string;
  name: string;
  cuit: string;
  alias: string;
  phone: string;
  photo: string;
  verified: boolean;
}> = [];

// Mock registered emails and CUITs
const registeredEmails = new Set(['existing@tippit.com', 'taken@example.com']);
const registeredCuits = new Set(['20123456789', '27987654321']);

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
  name: z.string().min(1, 'Name is required'),
  cuit: z.string().min(11, 'CUIT must be 11 digits').max(11, 'CUIT must be 11 digits'),
  alias: z.string().min(1, 'Alias is required'),
  phone: z.string().min(8, 'Phone number is required'),
  photo: z.string().min(1, 'Photo is required'),
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
      await delay(800); // Simulate email validation API call

      const exists = registeredEmails.has(input.email.toLowerCase());
      
      return {
        available: !exists,
        message: exists ? 'This email is already registered' : 'Email is available',
      };
    }),

  /**
   * Check if CUIT is already registered
   */
  checkCuit: publicProcedure
    .input(checkCuitSchema)
    .query(async ({ input }) => {
      await delay(700); // Simulate CUIT validation API call

      // Validate CUIT format (basic Argentine CUIT validation)
      const cuitDigits = input.cuit.replace(/\D/g, '');
      if (cuitDigits.length !== 11) {
        return {
          valid: false,
          available: false,
          message: 'CUIT must be exactly 11 digits',
        };
      }

      const exists = registeredCuits.has(cuitDigits);
      
      return {
        valid: true,
        available: !exists,
        message: exists ? 'This CUIT is already registered' : 'CUIT is available',
      };
    }),

  /**
   * Validate phone number format
   */
  checkPhone: publicProcedure
    .input(checkPhoneSchema)
    .query(async ({ input }) => {
      await delay(500); // Simulate phone validation API call

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
      await delay(2500); // Simulate registration process with email sending

      // Check if email already exists
      if (registeredEmails.has(input.email.toLowerCase())) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'This email is already registered',
        });
      }

      // Check if CUIT already exists
      if (registeredCuits.has(input.cuit)) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'This CUIT is already registered',
        });
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: input.email.toLowerCase(),
        name: input.name,
        cuit: input.cuit,
        alias: input.alias,
        phone: input.phone,
        photo: input.photo,
        verified: false,
      };

      // Add to mock database
      registeredUsers.push(newUser);
      registeredEmails.add(input.email.toLowerCase());
      registeredCuits.add(input.cuit);

      return {
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      };
    }),

  /**
   * Resend verification email
   */
  resendVerification: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      await delay(1500); // Simulate email resending

      const user = registeredUsers.find(
        (u) => u.email.toLowerCase() === input.email.toLowerCase()
      );

      if (!user) {
        // Still return success for security reasons
        return {
          success: true,
          message: 'If an account exists with this email, a verification link will be sent.',
        };
      }

      return {
        success: true,
        message: 'Verification email sent successfully.',
      };
    }),
});

