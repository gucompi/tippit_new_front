import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface Payment {
  id: string;
  hora_aprovacion_pago: string;
  monto: number;
  tipo: 'Deposito' | 'Transferencia';
  estado: 'pendiente' | 'aprobado' | 'transferido';
  mesa?: number;
  mozo_nombre?: string;
  mozo_cuit?: string;
  id_transaccion?: string;
  cuit_acreedor?: string;
}

// Mock payments data
const mockPayments: Payment[] = Array.from({ length: 50 }, (_, i) => ({
  id: `payment-${i + 1}`,
  hora_aprovacion_pago: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  monto: Math.floor(Math.random() * 5000) + 500,
  tipo: Math.random() > 0.3 ? 'Deposito' : 'Transferencia',
  estado: Math.random() > 0.5 ? 'aprobado' : Math.random() > 0.5 ? 'transferido' : 'pendiente',
  mesa: Math.floor(Math.random() * 20) + 1,
  mozo_nombre: ['Maria Garcia', 'Pedro Lopez', 'Ana Martinez', 'Carlos Rodriguez', 'Laura Fernandez'][
    Math.floor(Math.random() * 5)
  ],
  mozo_cuit: ['27-98765432-1', '23-11223344-5', '27-55667788-9', '20-99887766-4', '27-11223344-7'][
    Math.floor(Math.random() * 5)
  ],
  id_transaccion: `trans-${i + 1}`,
  cuit_acreedor: `27-${Math.floor(Math.random() * 90000000) + 10000000}-${Math.floor(Math.random() * 9)}`,
}));

export const dashboardRouter = router({
  getMozoWeeklyData: publicProcedure
    .input(
      z.object({
        cuit: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      await delay(800);
      console.log('[tRPC Dashboard] getMozoWeeklyData called with:', input);

      // Filter payments for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentPayments = mockPayments.filter(
        (p) => new Date(p.hora_aprovacion_pago) >= sevenDaysAgo
      );

      // Filter by CUIT if provided
      const filteredPayments = input.cuit
        ? recentPayments.filter((p) => p.mozo_cuit === input.cuit)
        : recentPayments;

      // Group payments by date
      const groupedPayments: Record<string, Payment[]> = {};
      filteredPayments.forEach((payment) => {
        const date = new Date(payment.hora_aprovacion_pago).toISOString().split('T')[0];
        if (!groupedPayments[date]) {
          groupedPayments[date] = [];
        }
        groupedPayments[date].push(payment);
      });

      // Calculate totals
      const totalPayments = filteredPayments.reduce((sum, p) => sum + p.monto, 0);
      const totalPropinas = filteredPayments
        .filter((p) => p.tipo === 'Deposito' && p.estado === 'aprobado')
        .reduce((sum, p) => sum + p.monto, 0);
      const totalPendiente = filteredPayments
        .filter((p) => p.estado === 'pendiente')
        .reduce((sum, p) => sum + p.monto, 0);
      const totalTransferido = filteredPayments
        .filter((p) => p.tipo === 'Transferencia')
        .reduce((sum, p) => sum + p.monto, 0);

      return {
        groupedPayments,
        totalPayments,
        totalPropinas,
        totalPendiente,
        totalTransferido,
      };
    }),

  getRestaurantPayments: publicProcedure
    .input(
      z.object({
        restaurantId: z.string().optional(),
        activeButton: z.enum(['Tiempo', 'Mesa', 'Mozo']).default('Tiempo'),
        activeSubButton: z.enum(['UltimaSemana', 'UltimaMes', 'UltimoAnio']).default('UltimaSemana'),
      })
    )
    .query(async ({ input }) => {
      await delay(800);
      console.log('[tRPC Dashboard] getRestaurantPayments called with:', input);

      // Filter payments based on time period
      const now = new Date();
      let startDate = new Date();
      if (input.activeSubButton === 'UltimaSemana') {
        startDate.setDate(now.getDate() - 7);
      } else if (input.activeSubButton === 'UltimaMes') {
        startDate.setDate(now.getDate() - 30);
      } else if (input.activeSubButton === 'UltimoAnio') {
        startDate.setFullYear(now.getFullYear() - 1);
      }

      const filteredPayments = mockPayments.filter(
        (p) => new Date(p.hora_aprovacion_pago) >= startDate
      );

      // Group payments based on activeButton
      let groupedPayments: Record<string, Payment[]> = {};

      if (input.activeButton === 'Tiempo') {
        // Group by date
        filteredPayments.forEach((payment) => {
          const date = new Date(payment.hora_aprovacion_pago).toISOString().split('T')[0];
          if (!groupedPayments[date]) {
            groupedPayments[date] = [];
          }
          groupedPayments[date].push(payment);
        });
      } else if (input.activeButton === 'Mesa') {
        // Group by table
        filteredPayments.forEach((payment) => {
          const mesa = payment.mesa?.toString() || 'Unknown';
          if (!groupedPayments[mesa]) {
            groupedPayments[mesa] = [];
          }
          groupedPayments[mesa].push(payment);
        });
      } else if (input.activeButton === 'Mozo') {
        // Group by waiter
        filteredPayments.forEach((payment) => {
          const mozo = payment.mozo_cuit || payment.mozo_nombre || 'Unknown';
          if (!groupedPayments[mozo]) {
            groupedPayments[mozo] = [];
          }
          groupedPayments[mozo].push(payment);
        });
      }

      const totalPayments = filteredPayments.reduce((sum, p) => sum + p.monto, 0);

      // Get unique waiters for mozo details
      const mozoDetails: Record<string, { nombre: string; cuit: string }> = {};
      filteredPayments.forEach((p) => {
        if (p.mozo_cuit && p.mozo_nombre) {
          mozoDetails[p.mozo_cuit] = {
            nombre: p.mozo_nombre,
            cuit: p.mozo_cuit,
          };
        }
      });

      return {
        groupedPayments,
        totalPayments,
        mozoDetails,
        mesaDetails: {}, // Can be populated if needed
        groupedPaymentsArray: Object.entries(groupedPayments).map(([key, payments]) => ({
          key,
          payments,
        })),
      };
    }),

  validateTransfer: publicProcedure
    .input(
      z.object({
        numero_operacion: z.string(),
        id_transaccion: z.string(),
        cuit_destinatario: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await delay(1000);
      console.log('[tRPC Dashboard] validateTransfer called with:', input);

      // Mock validation - in real app, this would call the actual API
      return {
        ok: true,
        message: 'Transfer validated successfully',
      };
    }),
});

