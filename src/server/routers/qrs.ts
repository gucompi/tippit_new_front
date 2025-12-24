import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock QR Data
interface QRItem {
  mesa: number;
  mozo: {
    nombre: string;
    cuit: string | null;
    foto: string | null;
    fin_atencion: boolean;
    token_padre?: string;
    token_db?: string;
  };
}

// Mock Tags
interface Tag {
  id: string;
  name: string;
  color: string;
}

let mockQRs: QRItem[] = [
  {
    mesa: 1,
    mozo: {
      nombre: 'Maria Garcia',
      cuit: '27-98765432-1',
      foto: '/profile_she.jpg',
      fin_atencion: false,
      token_padre: 'token-1',
      token_db: 'token-db-1',
    },
  },
  {
    mesa: 2,
    mozo: {
      nombre: 'Pedro Lopez',
      cuit: '23-11223344-5',
      foto: '/profile_he.jpg',
      fin_atencion: false,
      token_padre: 'token-2',
      token_db: 'token-db-2',
    },
  },
  {
    mesa: 3,
    mozo: {
      nombre: '',
      cuit: null,
      foto: null,
      fin_atencion: true,
    },
  },
  {
    mesa: 4,
    mozo: {
      nombre: 'Ana Martinez',
      cuit: '27-55667788-9',
      foto: null,
      fin_atencion: false,
      token_padre: 'token-4',
      token_db: 'token-db-4',
    },
  },
  {
    mesa: 5,
    mozo: {
      nombre: '',
      cuit: null,
      foto: null,
      fin_atencion: true,
    },
  },
];

let mockTags: Tag[] = [
  { id: '1', name: 'Patio', color: '#FF6B6B' },
  { id: '2', name: 'Salón VIP', color: '#4ECDC4' },
  { id: '3', name: 'Terraza', color: '#45B7D1' },
  { id: '4', name: 'Barra', color: '#FFA07A' },
];

let mockQRTags: Record<string, string[]> = {
  '1': ['1', '2'],
  '2': ['3'],
  '4': ['1', '4'],
};

let mockUnprintedMesas: number[] = [3, 5];

export const qrsRouter = router({
  getQRs: publicProcedure.query(async () => {
    await delay(500);
    console.log('[tRPC QRs] getQRs called');
    return { items: mockQRs };
  }),

  createQR: publicProcedure
    .input(z.object({ mesa: z.number().optional() }))
    .mutation(async ({ input }) => {
      await delay(500);
      console.log('[tRPC QRs] createQR called with:', input);
      
      // Find next available mesa number
      const existingMesas = mockQRs.map(qr => qr.mesa);
      const nextMesa = input.mesa || (Math.max(...existingMesas, 0) + 1);
      
      const newQR: QRItem = {
        mesa: nextMesa,
        mozo: {
          nombre: '',
          cuit: null,
          foto: null,
          fin_atencion: true, // New QR starts as inactive
        },
      };
      
      mockQRs.push(newQR);
      return { success: true, qr: newQR };
    }),

  assignQR: publicProcedure
    .input(z.object({ mesa: z.number(), cuit: z.string() }))
    .mutation(async ({ input }) => {
      await delay(500);
      console.log('[tRPC QRs] assignQR called with:', input);
      
      const qr = mockQRs.find(q => q.mesa === input.mesa);
      if (qr) {
        // Mock: find staff by CUIT (in real app, this would fetch from API)
        const mockStaff = {
          '27-98765432-1': { nombre: 'Maria Garcia', foto: '/profile_she.jpg' },
          '23-11223344-5': { nombre: 'Pedro Lopez', foto: '/profile_he.jpg' },
          '27-55667788-9': { nombre: 'Ana Martinez', foto: null },
        };
        
        const staff = mockStaff[input.cuit as keyof typeof mockStaff];
        if (staff) {
          qr.mozo = {
            ...qr.mozo,
            nombre: staff.nombre,
            cuit: input.cuit,
            foto: staff.foto || null,
            fin_atencion: false,
            token_padre: `token-${input.mesa}`,
            token_db: `token-db-${input.mesa}`,
          };
        }
        return { success: true, qr };
      }
      return { success: false, message: 'QR not found' };
    }),

  getTags: publicProcedure.query(async () => {
    await delay(300);
    console.log('[tRPC QRs] getTags called');
    return { tags: mockTags };
  }),

  createTag: publicProcedure
    .input(z.object({ name: z.string(), color: z.string() }))
    .mutation(async ({ input }) => {
      await delay(300);
      console.log('[tRPC QRs] createTag called with:', input);
      const newTag: Tag = {
        id: String(mockTags.length + 1),
        name: input.name,
        color: input.color,
      };
      mockTags.push(newTag);
      return { success: true, tag: newTag };
    }),

  assignTag: publicProcedure
    .input(z.object({ mesa: z.number(), tagId: z.string() }))
    .mutation(async ({ input }) => {
      await delay(300);
      console.log('[tRPC QRs] assignTag called with:', input);
      const mesaKey = String(input.mesa);
      if (!mockQRTags[mesaKey]) {
        mockQRTags[mesaKey] = [];
      }
      if (!mockQRTags[mesaKey].includes(input.tagId)) {
        mockQRTags[mesaKey].push(input.tagId);
      }
      return { success: true };
    }),

  removeTag: publicProcedure
    .input(z.object({ mesa: z.number(), tagId: z.string() }))
    .mutation(async ({ input }) => {
      await delay(300);
      console.log('[tRPC QRs] removeTag called with:', input);
      const mesaKey = String(input.mesa);
      if (mockQRTags[mesaKey]) {
        mockQRTags[mesaKey] = mockQRTags[mesaKey].filter(id => id !== input.tagId);
      }
      return { success: true };
    }),

  getQRImage: publicProcedure
    .input(z.object({ mesa: z.number() }))
    .query(async ({ input }) => {
      await delay(500);
      console.log('[tRPC QRs] getQRImage called with:', input);
      // Mock: return a placeholder QR image URL
      // In a real app, this would fetch the actual QR code image
      return { 
        imageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=mesa-${input.mesa}` 
      };
    }),

  sendQRViaWhatsApp: publicProcedure
    .input(z.object({ mesa: z.number(), phoneNumber: z.string() }))
    .mutation(async ({ input }) => {
      await delay(1000);
      console.log('[tRPC QRs] sendQRViaWhatsApp called with:', input);
      // Mock: simulate sending QR via WhatsApp
      return { success: true, message: `QR de la mesa ${input.mesa} enviado por WhatsApp` };
    }),

  getUnprintedQRs: publicProcedure.query(async () => {
    await delay(500);
    console.log('[tRPC QRs] getUnprintedQRs called');
    return { mesas: mockUnprintedMesas };
  }),

  getStaff: publicProcedure.query(async () => {
    await delay(300);
    console.log('[tRPC QRs] getStaff called');
    // Mock staff list
    return {
      staff: [
        { id: '1', nombre: 'Maria Garcia', cuit: '27-98765432-1', foto: '/profile_she.jpg' },
        { id: '2', nombre: 'Pedro Lopez', cuit: '23-11223344-5', foto: '/profile_he.jpg' },
        { id: '3', nombre: 'Ana Martinez', cuit: '27-55667788-9', foto: null },
      ],
    };
  }),
});

