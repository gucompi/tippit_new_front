import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Role types used in the app
// Manager: Full access to dashboard, staff management, QR codes, etc.
// Mozo: Waiter role with limited access
// Restaurante: Restaurant account
// Duenio: Business owner

// Mock user database
const mockUsers = [
  { id: '1', email: 'owner@tippit.com', password: 'owner123', role: 'Manager', name: 'Restaurant Owner' },
  { id: '2', email: 'worker@tippit.com', password: 'worker123', role: 'Mozo', name: 'John Worker' },
];

// Mock session storage (in real app, use JWT/cookies)
let currentSession: { userId: string; token: string } | null = null;

// Input schemas (Zod)
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  isOwner: z.boolean(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export const authRouter = router({
  // ============================================
  // QUERIES (GET operations - use useQuery)
  // ============================================

  /**
   * Get current session/user info
   * Usage: const { data, isLoading } = trpc.auth.getSession.useQuery();
   */
  getSession: publicProcedure.query(async () => {
    await delay(500); // Simulate network latency

    if (!currentSession) {
      return { isAuthenticated: false, user: null };
    }

    const user = mockUsers.find((u) => u.id === currentSession?.userId);
    if (!user) {
      currentSession = null;
      return { isAuthenticated: false, user: null };
    }

    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }),

  /**
   * Check if email exists (useful for registration)
   * Usage: const { data } = trpc.auth.checkEmail.useQuery({ email: 'test@example.com' });
   */
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      await delay(600); // Simulate validation delay
      const exists = mockUsers.some((u) => u.email === input.email);
      return { exists };
    }),

  // ============================================
  // MUTATIONS (POST/PUT/DELETE - use useMutation)
  // ============================================

  /**
   * Login mutation
   * Usage: const loginMutation = trpc.auth.login.useMutation();
   *        loginMutation.mutate({ email, password, isOwner });
   */
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    await delay(1500); // Simulate network delay

    const user = mockUsers.find(
      (u) => u.email === input.email && u.password === input.password
    );

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    if (input.isOwner && user.role === 'Mozo') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'This account is not a business owner account',
      });
    }

    if (!input.isOwner && user.role !== 'Mozo') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'This account is not a team member account',
      });
    }

    // Create session
    const token = 'mock-jwt-token-' + Date.now();
    currentSession = { userId: user.id, token };

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }),

  /**
   * Logout mutation
   * Usage: const logoutMutation = trpc.auth.logout.useMutation();
   */
  logout: publicProcedure.mutation(async () => {
    await delay(300);
    currentSession = null;
    return { success: true };
  }),

  /**
   * Forgot password mutation
   * Usage: const forgotMutation = trpc.auth.forgotPassword.useMutation();
   */
  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ input }) => {
      await delay(1500); // Simulate email sending delay

      const user = mockUsers.find((u) => u.email === input.email);

      // Always return success for security (don't reveal if email exists)
      return {
        success: true,
        message: user
          ? 'Password reset link sent to your email.'
          : 'If an account exists with this email, you will receive a password reset link.',
      };
    }),
});
