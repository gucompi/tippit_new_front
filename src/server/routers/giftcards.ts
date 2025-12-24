import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock gift cards data
const mockGiftCards = [
  {
    id: '1',
    code_used: 'GC001',
    benefit: 5000,
    expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Gift card for $50',
    used: false,
    email: 'customer1@example.com',
    phone_number: '+54111234567',
    name: 'John Doe',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    code_used: 'GC002',
    benefit: 10000,
    expiration_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Gift card for $100',
    used: false,
    email: 'customer2@example.com',
    phone_number: '+54111234568',
    name: 'Jane Smith',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    code_used: 'GC003',
    benefit: 7500,
    expiration_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Gift card for $75',
    used: true,
    email: 'customer3@example.com',
    phone_number: '+54111234569',
    name: 'Bob Johnson',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock clients data
const mockClients = [
  {
    id: '1',
    email: 'customer1@example.com',
    phone: '+54111234567',
    name: 'John Doe',
    metadata: {
      total_giftcards: 5,
      giftcards_used: 2,
      giftcards_expired: 1,
      giftcards_active: 2,
    },
  },
  {
    id: '2',
    email: 'customer2@example.com',
    phone: '+54111234568',
    name: 'Jane Smith',
    metadata: {
      total_giftcards: 3,
      giftcards_used: 1,
      giftcards_expired: 0,
      giftcards_active: 2,
    },
  },
];

export const giftcardsRouter = router({
  /**
   * Get all gift cards
   */
  getGiftCards: publicProcedure.query(async () => {
    await delay(800);
    return mockGiftCards;
  }),

  /**
   * Create a new gift card
   */
  createGiftCard: publicProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        phone_number: z.string().optional(),
        benefit: z.number(),
        expiration_date: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await delay(1000);
      const newCard = {
        id: String(mockGiftCards.length + 1),
        code_used: `GC${String(mockGiftCards.length + 1).padStart(3, '0')}`,
        benefit: input.benefit,
        expiration_date: input.expiration_date,
        description: input.description || `Gift card for $${input.benefit / 100}`,
        used: false,
        email: input.email,
        phone_number: input.phone_number,
        name: input.email?.split('@')[0] || 'Customer',
        created_at: new Date().toISOString(),
      };
      return newCard;
    }),

  /**
   * Validate a gift card by code
   */
  validateGiftCard: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      await delay(600);
      const card = mockGiftCards.find((c) => c.code_used === input.code);
      if (!card) {
        throw new Error('Gift card not found');
      }
      return card;
    }),

  /**
   * Mark gift card as used
   */
  markAsUsed: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      await delay(800);
      const card = mockGiftCards.find((c) => c.code_used === input.code);
      if (!card) {
        throw new Error('Gift card not found');
      }
      return {
        ...card,
        used: true,
      };
    }),

  /**
   * Get clients with gift card statistics
   */
  getClients: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().optional(),
        sortBy: z.string().default('email'),
        sortOrder: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      await delay(600);
      let filtered = [...mockClients];

      // Apply search filter
      if (input.search) {
        const searchLower = input.search.toLowerCase();
        filtered = filtered.filter(
          (client) =>
            client.email?.toLowerCase().includes(searchLower) ||
            client.phone?.toLowerCase().includes(searchLower) ||
            client.name?.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const aValue = a[input.sortBy as keyof typeof a] || '';
        const bValue = b[input.sortBy as keyof typeof b] || '';
        const comparison = String(aValue).localeCompare(String(bValue));
        return input.sortOrder === 1 ? comparison : -comparison;
      });

      // Apply pagination
      const start = (input.page - 1) * input.limit;
      const end = start + input.limit;
      const paginated = filtered.slice(start, end);

      return {
        clients: paginated,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / input.limit),
      };
    }),

  /**
   * Get gift card statistics
   */
  getStats: publicProcedure.query(async () => {
    await delay(500);
    const today = new Date();
    let active = 0;
    let expired = 0;
    let used = 0;
    let money = 0;
    const clientsUsingGiftCards = new Set<string>();

    mockGiftCards.forEach((card) => {
      const expirationDate = new Date(card.expiration_date);
      const isExpired = expirationDate < today;
      const isUsed = card.used === true;

      if (isUsed) {
        used++;
        money += card.benefit;
        const clientKey = card.email || card.phone_number || card.name || '';
        if (clientKey) {
          clientsUsingGiftCards.add(clientKey);
        }
      } else if (isExpired) {
        expired++;
      } else {
        active++;
      }
    });

    return {
      total: mockGiftCards.length,
      active,
      expired,
      used,
      money,
      clientsUsingGiftCards: clientsUsingGiftCards.size,
      newClientsByGiftCard: Math.max(0, mockClients.length - clientsUsingGiftCards.size),
    };
  }),
});

