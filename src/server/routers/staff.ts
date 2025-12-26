import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Employee Data
interface Employee {
  id: string;
  nombre: string;
  first_name?: string;
  last_name?: string;
  telefono?: string;
  email?: string;
  sucursal?: string;
  rol: string;
  foto?: string;
  cuit: string;
  dni?: string;
  alias?: string;
  active: boolean;
  joined_at?: string;
  vinculado_mp?: boolean;
  has_link_to_mp?: boolean;
}

// Mock Role Data
interface Role {
  id: string;
  name: string;
  color: string;
  percentage: number;
}

let mockEmployees: Employee[] = [
  {
    id: '1',
    nombre: 'Maria Garcia',
    first_name: 'Maria',
    last_name: 'Garcia',
    telefono: '+5491123456789',
    email: 'maria@example.com',
    sucursal: 'Sucursal Centro',
    rol: 'Mozo',
    foto: '/profile_she.jpg',
    cuit: '27-98765432-1',
    dni: '98765432',
    alias: 'Maria G',
    active: true,
    joined_at: '2024-01-15',
    vinculado_mp: true,
    has_link_to_mp: true,
  },
  {
    id: '2',
    nombre: 'Pedro Lopez',
    first_name: 'Pedro',
    last_name: 'Lopez',
    telefono: '+5491198765432',
    email: 'pedro@example.com',
    sucursal: 'Sucursal Norte',
    rol: 'Cocinero',
    foto: '/profile_he.jpg',
    cuit: '23-11223344-5',
    dni: '11223344',
    alias: 'Pedro L',
    active: true,
    joined_at: '2024-02-20',
    vinculado_mp: false,
    has_link_to_mp: false,
  },
  {
    id: '3',
    nombre: 'Ana Martinez',
    first_name: 'Ana',
    last_name: 'Martinez',
    telefono: '+5491155566778',
    email: 'ana@example.com',
    sucursal: 'Sucursal Centro',
    rol: 'Mozo',
    foto: undefined,
    cuit: '27-55667788-9',
    dni: '55667788',
    alias: 'Ana M',
    active: true,
    joined_at: '2024-03-10',
    vinculado_mp: true,
    has_link_to_mp: true,
  },
];

let mockRoles: Role[] = [
  { id: '1', name: 'Mozo', color: '#FF6B6B', percentage: 30 },
  { id: '2', name: 'Cocinero', color: '#4ECDC4', percentage: 25 },
  { id: '3', name: 'Bartender', color: '#45B7D1', percentage: 20 },
  { id: '4', name: 'Cajero', color: '#FFA07A', percentage: 15 },
];

export const staffRouter = router({
  getEmployees: publicProcedure
    .input(
      z
        .object({
          page: z.number().default(1),
          per_page: z.number().default(10),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      await delay(500);
      console.log('[tRPC Staff] getEmployees called with:', input);

      const { page = 1, per_page: perPage = 10, search } = input || {};

      let filtered = [...mockEmployees];

      // Search filter
      if (search && search.length >= 3) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (emp) =>
            emp.nombre.toLowerCase().includes(searchLower) ||
            emp.cuit.includes(search) ||
            emp.email?.toLowerCase().includes(searchLower) ||
            emp.telefono?.includes(search)
        );
      }

      const total = filtered.length;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginated = filtered.slice(startIndex, endIndex);

      return {
        employees: paginated,
        page,
        per_page: perPage,
        total,
        has_next: endIndex < total,
        has_prev: startIndex > 0,
      };
    }),

  getAllEmployees: publicProcedure.query(async () => {
    await delay(300);
    console.log('[tRPC Staff] getAllEmployees called');
    return { employees: mockEmployees };
  }),

  getRoles: publicProcedure.query(async () => {
    await delay(300);
    console.log('[tRPC Staff] getRoles called');
    return { roles: mockRoles };
  }),

  createRole: publicProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
        percentage: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input }) => {
      await delay(500);
      console.log('[tRPC Staff] createRole called with:', input);

      // Validate total percentage
      const currentTotal = mockRoles.reduce((sum, r) => sum + r.percentage, 0);
      if (currentTotal + input.percentage > 100) {
        return {
          success: false,
          error: 'Total percentage cannot exceed 100%',
        };
      }

      const newRole: Role = {
        id: String(mockRoles.length + 1),
        name: input.name,
        color: input.color,
        percentage: input.percentage,
      };
      mockRoles.push(newRole);
      return { success: true, role: newRole };
    }),

  updateRole: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        color: z.string().optional(),
        percentage: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ input }) => {
      await delay(500);
      console.log('[tRPC Staff] updateRole called with:', input);

      const role = mockRoles.find((r) => r.id === input.id);
      if (!role) {
        return { success: false, error: 'Role not found' };
      }

      // Validate total percentage if percentage is being updated
      if (input.percentage !== undefined) {
        const currentTotal = mockRoles.reduce((sum, r) => sum + r.percentage, 0);
        const newTotal = currentTotal - role.percentage + input.percentage;
        if (newTotal > 100) {
          return {
            success: false,
            error: 'Total percentage cannot exceed 100%',
          };
        }
      }

      if (input.name !== undefined) role.name = input.name;
      if (input.color !== undefined) role.color = input.color;
      if (input.percentage !== undefined) role.percentage = input.percentage;

      return { success: true, role };
    }),

  deleteRole: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await delay(500);
      console.log('[tRPC Staff] deleteRole called with:', input);

      const index = mockRoles.findIndex((r) => r.id === input.id);
      if (index === -1) {
        return { success: false, error: 'Role not found' };
      }

      // Update employees with this role to "Sin Rol"
      const roleName = mockRoles[index].name;
      mockEmployees = mockEmployees.map((emp) =>
        emp.rol === roleName ? { ...emp, rol: 'Sin Rol' } : emp
      );

      mockRoles.splice(index, 1);
      return { success: true };
    }),

  createEmployee: publicProcedure
    .input(
      z.object({
        cuit: z.string(),
        nombre: z.string(),
        email: z.string().email().optional(),
        telefono: z.string().optional(),
        role_id: z.string(),
        foto: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await delay(500);
      console.log('[tRPC Staff] createEmployee called with:', input);

      // Check if employee already exists
      const existing = mockEmployees.find((e) => e.cuit === input.cuit);
      if (existing) {
        return {
          success: false,
          error: 'Employee with this CUIT already exists',
        };
      }

      const role = mockRoles.find((r) => r.id === input.role_id);
      const newEmployee: Employee = {
        id: String(mockEmployees.length + 1),
        nombre: input.nombre,
        cuit: input.cuit,
        email: input.email,
        telefono: input.telefono,
        rol: role?.name || 'Sin Rol',
        foto: input.foto,
        active: true,
        joined_at: new Date().toISOString().split('T')[0],
        vinculado_mp: false,
        has_link_to_mp: false,
      };
      mockEmployees.push(newEmployee);
      return { success: true, employee: newEmployee };
    }),

  updateEmployee: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string().optional(),
        email: z.string().email().optional(),
        telefono: z.string().optional(),
        role_id: z.string().optional(),
        foto: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await delay(500);
      console.log('[tRPC Staff] updateEmployee called with:', input);

      const employee = mockEmployees.find((e) => e.id === input.id);
      if (!employee) {
        return { success: false, error: 'Employee not found' };
      }

      if (input.nombre !== undefined) employee.nombre = input.nombre;
      if (input.email !== undefined) employee.email = input.email;
      if (input.telefono !== undefined) employee.telefono = input.telefono;
      if (input.foto !== undefined) employee.foto = input.foto;
      if (input.active !== undefined) employee.active = input.active;

      if (input.role_id !== undefined) {
        const role = mockRoles.find((r) => r.id === input.role_id);
        employee.rol = role?.name || 'Sin Rol';
      }

      return { success: true, employee };
    }),

  deleteEmployee: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await delay(500);
      console.log('[tRPC Staff] deleteEmployee called with:', input);

      const index = mockEmployees.findIndex((e) => e.id === input.id);
      if (index === -1) {
        return { success: false, error: 'Employee not found' };
      }

      mockEmployees.splice(index, 1);
      return { success: true };
    }),

  linkMercadoPago: publicProcedure
    .input(
      z.object({
        employee_id: z.string(),
        mp_data: z.object({
          access_token: z.string(),
          user_id: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      await delay(1000);
      console.log('[tRPC Staff] linkMercadoPago called with:', input);

      const employee = mockEmployees.find((e) => e.id === input.employee_id);
      if (!employee) {
        return { success: false, error: 'Employee not found' };
      }

      employee.vinculado_mp = true;
      employee.has_link_to_mp = true;

      return { success: true, employee };
    }),

  updateEmployeeRole: publicProcedure
    .input(
      z.object({
        employee_id: z.string(),
        role_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await delay(300);
      console.log('[tRPC Staff] updateEmployeeRole called with:', input);

      const employee = mockEmployees.find((e) => e.id === input.employee_id);
      if (!employee) {
        return { success: false, error: 'Employee not found' };
      }

      const role = mockRoles.find((r) => r.id === input.role_id);
      if (!role) {
        return { success: false, error: 'Role not found' };
      }

      employee.rol = role.name;
      return { success: true, employee };
    }),

  searchEmployeeByCuit: publicProcedure
    .input(z.object({ cuit: z.string() }))
    .query(async ({ input }) => {
      await delay(500);
      console.log('[tRPC Staff] searchEmployeeByCuit called with:', input);

      // Mock: simulate searching external API
      // In real app, this would call an external service
      return {
        found: true,
        employee: {
          cuit: input.cuit,
          nombre: 'Juan Example',
          email: 'juan@example.com',
          telefono: '+5491111111111',
        },
      };
    }),
});

