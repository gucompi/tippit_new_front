import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock profile data
const mockProfileData = {
  id: 'user-1',
  nombre: 'Juan Pérez',
  username: 'juan.perez',
  cuit: '20123456789',
  address: 'Av. Corrientes 1234, Buenos Aires',
  alias: 'juan.perez.mp',
  email: 'juan.perez@example.com',
  photo: '/tippit-owner-woman.webp',
  rol: 'Manager',
};

// Mock mozo stats
const mockMozoStats = {
  tips: 2450.50,
  promedio: 4.8,
  cant: 45,
};

// Mock roles
const mockRoles = [
  { id: '1', nombre_rol: 'Manager' },
  { id: '2', nombre_rol: 'Mozo' },
  { id: '3', nombre_rol: 'Restaurante' },
];

export const profileRouter = router({
  /**
   * Get current user profile
   */
  getProfile: publicProcedure
    .query(async () => {
      await delay(800);
      
      // Mock role - in real app, this would come from session/auth
      return {
        ...mockProfileData,
        rol: 'Manager', // This will be determined by auth context in real implementation
      };
    }),

  /**
   * Update profile
   */
  updateProfile: publicProcedure
    .input(
      z.object({
        nombre: z.string().optional(),
        photo: z.string().optional(),
        alias: z.string().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await delay(1000);
      
      return {
        ...mockProfileData,
        ...input,
        updatedAt: new Date().toISOString(),
      };
    }),

  /**
   * Get mozo stats (for Mozo role)
   */
  getMozoStats: publicProcedure
    .query(async () => {
      await delay(600);
      return mockMozoStats;
    }),

  /**
   * Get available roles (for admin)
   */
  getRoles: publicProcedure
    .query(async () => {
      await delay(400);
      return mockRoles;
    }),

  /**
   * Search employee by CUIT
   */
  searchEmployee: publicProcedure
    .input(z.object({ cuit: z.string() }))
    .query(async ({ input }) => {
      await delay(800);
      
      // Mock: if CUIT matches, return employee data
      if (input.cuit === '20123456789') {
        return {
          nombre: 'Carlos Rodriguez',
          cuit: input.cuit,
          foto: '/profile_he.jpg',
          detail: 'Found',
        };
      }
      
      return {
        detail: 'Empleado no encontrado',
      };
    }),

  /**
   * Link mozo to restaurant
   */
  linkMozo: publicProcedure
    .input(
      z.object({
        cuit: z.string(),
        rol: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await delay(1000);
      return {
        success: true,
        message: 'Mozo vinculado exitosamente',
      };
    }),

  /**
   * Unlink mozo from restaurant
   */
  unlinkMozo: publicProcedure
    .input(
      z.object({
        cuit: z.string(),
        rol: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await delay(1000);
      return {
        success: true,
        message: 'Mozo desvinculado exitosamente',
      };
    }),
});

