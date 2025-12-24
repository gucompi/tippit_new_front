import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data for restaurant stats
const mockMonthlyData: Record<number, { total: number; count: number; averageRating: number }> = {
  1: { total: 4500, count: 120, averageRating: 4.5 },
  2: { total: 5200, count: 145, averageRating: 4.6 },
  3: { total: 4800, count: 130, averageRating: 4.4 },
  4: { total: 6100, count: 160, averageRating: 4.7 },
  5: { total: 5500, count: 150, averageRating: 4.5 },
  6: { total: 7200, count: 180, averageRating: 4.8 },
  7: { total: 6800, count: 175, averageRating: 4.6 },
  8: { total: 7500, count: 190, averageRating: 4.7 },
  9: { total: 6200, count: 165, averageRating: 4.5 },
  10: { total: 5800, count: 155, averageRating: 4.4 },
  11: { total: 6500, count: 170, averageRating: 4.6 },
  12: { total: 8200, count: 210, averageRating: 4.8 },
};

// Mock QR data
const mockQRs = [
  { id: '1', name: 'Table 1', active: true, waiter: 'John' },
  { id: '2', name: 'Table 2', active: true, waiter: 'Maria' },
  { id: '3', name: 'Table 3', active: false, waiter: null },
  { id: '4', name: 'Table 4', active: true, waiter: 'Carlos' },
  { id: '5', name: 'Table 5', active: false, waiter: null },
  { id: '6', name: 'Table 6', active: true, waiter: 'Ana' },
  { id: '7', name: 'Table 7', active: true, waiter: 'Pedro' },
  { id: '8', name: 'Table 8', active: false, waiter: null },
];

// Mock ranking data
const mockRankingData = [
  { id: '1', name: 'Maria Garcia', photo: '/profile_she.jpg', totalTips: 2450.50, avgRating: 4.9 },
  { id: '2', name: 'Carlos Rodriguez', photo: '/profile_he.jpg', totalTips: 2180.00, avgRating: 4.8 },
  { id: '3', name: 'Ana Martinez', photo: '/profile_she.jpg', totalTips: 1950.75, avgRating: 4.7 },
  { id: '4', name: 'Pedro Sanchez', photo: '/profile_he.jpg', totalTips: 1820.00, avgRating: 4.6 },
  { id: '5', name: 'Laura Lopez', photo: '/profile_she.jpg', totalTips: 1650.25, avgRating: 4.5 },
];

// Mock notifications
const mockNotifications = [
  { id: '1', title: 'New tip received', message: 'You received a $15 tip from Table 3', read: false, createdAt: new Date() },
  { id: '2', title: 'Shift started', message: 'Carlos started his shift', read: false, createdAt: new Date() },
  { id: '3', title: 'Review received', message: 'New 5-star review!', read: true, createdAt: new Date() },
];

export const businessRouter = router({
  // ============================================
  // QUERIES
  // ============================================

  /**
   * Get restaurant dashboard stats
   */
  getStats: publicProcedure
    .input(
      z.object({
        range: z.enum(['last30Days', 'last3Months', 'last6Months', 'lastYear']),
      })
    )
    .query(async ({ input }) => {
      await delay(800); // Simulate API latency

      const currentMonth = new Date().getMonth() + 1;
      let months: number[] = [];

      switch (input.range) {
        case 'last30Days':
          months = [currentMonth];
          break;
        case 'last3Months':
          months = [currentMonth, currentMonth - 1, currentMonth - 2].map(m => m < 1 ? m + 12 : m);
          break;
        case 'last6Months':
          months = Array.from({ length: 6 }, (_, i) => {
            const m = currentMonth - i;
            return m < 1 ? m + 12 : m;
          });
          break;
        case 'lastYear':
          months = Array.from({ length: 12 }, (_, i) => i + 1);
          break;
      }

      let totalAmount = 0;
      let totalCount = 0;
      let totalRating = 0;
      let ratingCount = 0;

      months.forEach((month) => {
        const data = mockMonthlyData[month];
        if (data) {
          totalAmount += data.total;
          totalCount += data.count;
          totalRating += data.averageRating * data.count;
          ratingCount += data.count;
        }
      });

      const avgRating = ratingCount > 0 ? totalRating / ratingCount : 0;

      return {
        totalTips: totalAmount.toFixed(2),
        tipCount: totalCount,
        averageRating: avgRating.toFixed(2),
        totalQRs: mockQRs.length,
        activeQRs: mockQRs.filter(qr => qr.active).length,
      };
    }),

  /**
   * Get QR codes list
   */
  getQRs: publicProcedure.query(async () => {
    await delay(600);
    return {
      qrs: mockQRs,
      total: mockQRs.length,
      active: mockQRs.filter(qr => qr.active).length,
    };
  }),

  /**
   * Get staff rankings
   */
  getRankings: publicProcedure
    .input(
      z.object({
        type: z.enum(['performance', 'tips']),
        range: z.enum(['last30Days', 'last3Months', 'last6Months', 'lastYear']),
      })
    )
    .query(async ({ input }) => {
      await delay(700);

      // Sort based on type
      const sorted = [...mockRankingData].sort((a, b) => {
        if (input.type === 'performance') {
          return b.avgRating - a.avgRating;
        }
        return b.totalTips - a.totalTips;
      });

      return {
        rankings: sorted.slice(0, 5),
        type: input.type,
      };
    }),

  /**
   * Get notification stats
   */
  getNotificationStats: publicProcedure.query(async () => {
    await delay(400);
    const unread = mockNotifications.filter(n => !n.read).length;
    return {
      total: mockNotifications.length,
      unread,
    };
  }),

  /**
   * Get notifications list
   */
  getNotifications: publicProcedure.query(async () => {
    await delay(500);
    return {
      notifications: mockNotifications,
    };
  }),

  /**
   * Get current user/restaurant info
   */
  getCurrentRestaurant: publicProcedure.query(async () => {
    await delay(400);
    return {
      id: 'rest-1',
      name: 'La Parrilla de Juan',
      photo: '/tippit-owner-woman.webp',
      role: 'Manager',
      plan: 'Premium',
      planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }),
});

