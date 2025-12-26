import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { backendClient } from '@/lib/backend-client';

export const mercadoPagoRouter = router({
  /**
   * Initiate OAuth flow
   */
  initiateOAuth: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const response = await backendClient.post('/api/mercado-pago/oauth/initiate', {
          userId: input.userId,
        });
        return {
          success: response.data.success,
          authUrl: response.data.authUrl,
          state: response.data.state,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || 'Failed to initiate OAuth flow',
        });
      }
    }),

  /**
   * Get connection status
   */
  getConnectionStatus: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = await backendClient.get('/api/mercado-pago/oauth/status', {
          params: { userId: input.userId },
        });
        return response.data.data;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || 'Failed to get connection status',
        });
      }
    }),

  /**
   * Disconnect Mercado Pago account
   */
  disconnect: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const response = await backendClient.post('/api/mercado-pago/oauth/disconnect', {
          userId: input.userId,
        });
        return {
          success: response.data.success,
          message: response.data.message,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || 'Failed to disconnect account',
        });
      }
    }),

  /**
   * Create payment preference
   */
  createPreference: publicProcedure
    .input(
      z.object({
        recipientUserId: z.string(),
        amount: z.number().positive(),
        currency: z.string().default('ARS'),
        description: z.string().optional(),
        tipId: z.string().optional(),
        businessId: z.string().optional(),
        qrId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await backendClient.post('/api/payment-preferences', input);
        return {
          success: response.data.success,
          data: response.data.data,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || 'Failed to create payment preference',
        });
      }
    }),

  /**
   * Get payment preference
   */
  getPreference: publicProcedure
    .input(z.object({ preferenceId: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = await backendClient.get(`/api/payment-preferences/${input.preferenceId}`);
        return response.data.data;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || 'Failed to get payment preference',
        });
      }
    }),

  /**
   * Get user's payment preferences
   */
  getUserPreferences: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        status: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await backendClient.get(`/api/payment-preferences/user/${input.userId}`, {
          params: { status: input.status },
        });
        return {
          preferences: response.data.data,
          count: response.data.count,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.response?.data?.error || 'Failed to get payment preferences',
        });
      }
    }),
});

