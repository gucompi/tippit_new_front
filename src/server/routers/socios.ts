import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock restaurant data structure
interface RestaurantStatistics {
  total_tips_and_cash: number;
  count_tips: number;
  average_tip: number;
  active_qrs_count: number;
  roles_count: number;
  employees_count: number;
  count_reviews_no_tip: number;
  total_reviews_combined: number;
  count_tips_major_4_reviews: number;
  count_tips_minor_4_reviews: number;
  payment_methods_count: {
    efectivo: number;
    tarjeta: number;
    transferencia: number;
  };
  tip_historic_daily: Array<{ date: string; value: number }>;
  avg_tip_by_days: Array<{ day: string; value: number }>;
  daily_tip_count: Array<{ date: string; count: number }>;
  daily_avg_rating: Array<{ date: string; rating: number }>;
  tip_by_time: Array<{ time: string; value: number }>;
  top_5_tips_accumulated_waiter: Array<{ name: string; cuit: string; total: number }>;
  tip_average_age: Array<{ age_range: string; count: number }>;
  review_historic_daily: Array<{ date: string; count: number }>;
  rating_historic_daily: Array<{ date: string; rating: number }>;
}

// Mock data
const mockRestaurantData: Record<string, RestaurantStatistics> = {
  'restaurant-1': {
    total_tips_and_cash: 125000,
    count_tips: 342,
    average_tip: 365.5,
    active_qrs_count: 15,
    roles_count: 4,
    employees_count: 12,
    count_reviews_no_tip: 28,
    total_reviews_combined: 370,
    count_tips_major_4_reviews: 298,
    count_tips_minor_4_reviews: 44,
    payment_methods_count: {
      efectivo: 120,
      tarjeta: 180,
      transferencia: 42,
    },
    tip_historic_daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 5000) + 2000,
    })),
    avg_tip_by_days: [
      { day: 'Monday', value: 320 },
      { day: 'Tuesday', value: 350 },
      { day: 'Wednesday', value: 380 },
      { day: 'Thursday', value: 400 },
      { day: 'Friday', value: 450 },
      { day: 'Saturday', value: 500 },
      { day: 'Sunday', value: 420 },
    ],
    daily_tip_count: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 20) + 5,
    })),
    daily_avg_rating: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rating: Math.random() * 1 + 4.0,
    })),
    tip_by_time: [
      { time: '12:00', value: 15000 },
      { time: '13:00', value: 18000 },
      { time: '14:00', value: 12000 },
      { time: '19:00', value: 20000 },
      { time: '20:00', value: 25000 },
      { time: '21:00', value: 22000 },
      { time: '22:00', value: 18000 },
    ],
    top_5_tips_accumulated_waiter: [
      { name: 'Maria Garcia', cuit: '27-98765432-1', total: 25000 },
      { name: 'Pedro Lopez', cuit: '23-11223344-5', total: 22000 },
      { name: 'Ana Martinez', cuit: '27-55667788-9', total: 18000 },
      { name: 'Carlos Rodriguez', cuit: '20-99887766-4', total: 15000 },
      { name: 'Laura Fernandez', cuit: '27-11223344-7', total: 12000 },
    ],
    tip_average_age: [
      { age_range: '18-25', count: 45 },
      { age_range: '26-35', count: 120 },
      { age_range: '36-45', count: 98 },
      { age_range: '46-55', count: 56 },
      { age_range: '56+', count: 23 },
    ],
    review_historic_daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 15) + 5,
    })),
    rating_historic_daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rating: Math.random() * 1 + 4.0,
    })),
  },
  'restaurant-2': {
    total_tips_and_cash: 98000,
    count_tips: 267,
    average_tip: 367.0,
    active_qrs_count: 12,
    roles_count: 3,
    employees_count: 10,
    count_reviews_no_tip: 22,
    total_reviews_combined: 289,
    count_tips_major_4_reviews: 245,
    count_tips_minor_4_reviews: 22,
    payment_methods_count: {
      efectivo: 95,
      tarjeta: 140,
      transferencia: 32,
    },
    tip_historic_daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 4000) + 1500,
    })),
    avg_tip_by_days: [
      { day: 'Monday', value: 300 },
      { day: 'Tuesday', value: 330 },
      { day: 'Wednesday', value: 360 },
      { day: 'Thursday', value: 380 },
      { day: 'Friday', value: 420 },
      { day: 'Saturday', value: 470 },
      { day: 'Sunday', value: 400 },
    ],
    daily_tip_count: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 15) + 4,
    })),
    daily_avg_rating: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rating: Math.random() * 1 + 4.0,
    })),
    tip_by_time: [
      { time: '12:00', value: 12000 },
      { time: '13:00', value: 15000 },
      { time: '14:00', value: 10000 },
      { time: '19:00', value: 18000 },
      { time: '20:00', value: 22000 },
      { time: '21:00', value: 20000 },
      { time: '22:00', value: 16000 },
    ],
    top_5_tips_accumulated_waiter: [
      { name: 'Juan Perez', cuit: '20-12345678-9', total: 20000 },
      { name: 'Sofia Gomez', cuit: '27-22334455-6', total: 18000 },
      { name: 'Diego Torres', cuit: '20-33445566-7', total: 15000 },
      { name: 'Valentina Ruiz', cuit: '27-44556677-8', total: 13000 },
      { name: 'Lucas Diaz', cuit: '20-55667788-9', total: 11000 },
    ],
    tip_average_age: [
      { age_range: '18-25', count: 35 },
      { age_range: '26-35', count: 95 },
      { age_range: '36-45', count: 78 },
      { age_range: '46-55', count: 45 },
      { age_range: '56+', count: 14 },
    ],
    review_historic_daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 12) + 4,
    })),
    rating_historic_daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rating: Math.random() * 1 + 4.0,
    })),
  },
};

export const sociosRouter = router({
  getRestaurantStatistics: publicProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        period: z.string().optional(),
        selectedCuits: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      await delay(800);
      console.log('[tRPC Socios] getRestaurantStatistics called with:', input);

      const restaurantId = input.restaurantId || 'restaurant-1';
      const data = mockRestaurantData[restaurantId] || mockRestaurantData['restaurant-1'];

      // Apply filters if provided
      let filteredData = { ...data };

      if (input.startDate && input.endDate) {
        // Filter date-based arrays
        filteredData.tip_historic_daily = data.tip_historic_daily.filter(
          (item) => item.date >= input.startDate! && item.date <= input.endDate!
        );
        filteredData.daily_tip_count = data.daily_tip_count.filter(
          (item) => item.date >= input.startDate! && item.date <= input.endDate!
        );
        filteredData.daily_avg_rating = data.daily_avg_rating.filter(
          (item) => item.date >= input.startDate! && item.date <= input.endDate!
        );
        filteredData.review_historic_daily = data.review_historic_daily.filter(
          (item) => item.date >= input.startDate! && item.date <= input.endDate!
        );
        filteredData.rating_historic_daily = data.rating_historic_daily.filter(
          (item) => item.date >= input.startDate! && item.date <= input.endDate!
        );
      }

      if (input.selectedCuits && input.selectedCuits.length > 0) {
        // Filter waiter-specific data
        filteredData.top_5_tips_accumulated_waiter = data.top_5_tips_accumulated_waiter.filter((waiter) =>
          input.selectedCuits!.includes(waiter.cuit)
        );
      }

      return filteredData;
    }),

  getTipsHistory: publicProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        page: z.number().default(1),
        per_page: z.number().default(20),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        selectedCuits: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      await delay(600);
      console.log('[tRPC Socios] getTipsHistory called with:', input);

      // Mock tips history data
      const mockTips = Array.from({ length: 100 }, (_, i) => ({
        id: `tip-${i + 1}`,
        date: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString(),
        amount: Math.floor(Math.random() * 1000) + 100,
        waiter_name: ['Maria Garcia', 'Pedro Lopez', 'Ana Martinez', 'Carlos Rodriguez', 'Laura Fernandez'][
          Math.floor(Math.random() * 5)
        ],
        waiter_cuit: ['27-98765432-1', '23-11223344-5', '27-55667788-9', '20-99887766-4', '27-11223344-7'][
          Math.floor(Math.random() * 5)
        ],
        payment_method: ['efectivo', 'tarjeta', 'transferencia'][Math.floor(Math.random() * 3)],
        rating: Math.random() * 1 + 4.0,
      }));

      let filtered = mockTips;

      if (input.startDate && input.endDate) {
        filtered = filtered.filter(
          (tip) => tip.date >= input.startDate! && tip.date <= input.endDate!
        );
      }

      if (input.selectedCuits && input.selectedCuits.length > 0) {
        filtered = filtered.filter((tip) => input.selectedCuits!.includes(tip.waiter_cuit));
      }

      const total = filtered.length;
      const startIndex = (input.page - 1) * input.per_page;
      const endIndex = startIndex + input.per_page;
      const paginated = filtered.slice(startIndex, endIndex);

      return {
        tips: paginated,
        page: input.page,
        per_page: input.per_page,
        total,
        has_next: endIndex < total,
        has_prev: startIndex > 0,
      };
    }),

  getRestaurants: publicProcedure.query(async () => {
    await delay(300);
    console.log('[tRPC Socios] getRestaurants called');
    // Mock restaurants list
    return {
      restaurants: [
        { id: 'restaurant-1', name: 'Restaurant Centro', address: 'Av. Corrientes 1234' },
        { id: 'restaurant-2', name: 'Restaurant Norte', address: 'Av. Libertador 5678' },
        { id: 'restaurant-3', name: 'Restaurant Sur', address: 'Av. San Martin 9012' },
      ],
    };
  }),
});

