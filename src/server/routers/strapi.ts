import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { strapi } from '@/lib/strapi';

// Types for menu configuration
export interface MenuItemConfig {
  id: string;
  key: string;
  label: string;
  path: string;
  icon: string;
  order: number;
  enabled: boolean;
  roles: string[];
}

// Default translations organized by namespace
const DEFAULT_TRANSLATIONS: Record<string, Record<string, Record<string, string>>> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      refresh: 'Refresh',
      version: 'v2.0.0',
    },
    'auth.login': {
      title: 'Hi, business owner!',
      titleWorker: 'Hi, team member!',
      toggleOwner: 'Actually I am a business owner',
      toggleWorker: 'Actually I am a team member',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotPassword: 'Forgot password?',
      submit: 'Enter',
      submitting: 'Signing in...',
      createAccount: "Don't have an account yet?",
      createAccountLink: 'Create one',
      'errors.emailRequired': 'Email is required',
      'errors.emailInvalid': 'Please enter a valid email',
      'errors.passwordRequired': 'Password is required',
      'errors.passwordMin': 'Password must be at least 6 characters',
    },
    'auth.forgotPassword': {
      title: 'Forgot your password?',
      description: "Enter your email address and we'll send you a link to reset your password.",
      submit: 'Send Reset Link',
      submitting: 'Sending...',
      backToLogin: 'Back to login',
      success: 'Password reset link sent to your email.',
    },
    auth: {
      logout: 'Logout',
    },
    menu: {
      title: 'Menu',
      session: 'Session: {role}',
      'items.home': 'Home',
      'items.myRestaurant': 'My Restaurant',
      'items.shiftRecord': 'Shift Record',
      'items.giftCards': 'Gift Cards',
      'items.myQRCodes': 'My QR Codes',
      'items.myStaff': 'My Staff',
      'items.viewMyProfile': 'View My Profile',
      'items.notifications': 'Notifications',
    },
    business: {
      'pageHeader.title': 'My Restaurant',
      'pageHeader.tooltip': "View your restaurant's performance metrics, including total tips, active QR codes, and staff rankings.",
      'filters.last30Days': 'Last 30 days',
      'filters.last3Months': 'Last 3 months',
      'filters.last6Months': 'Last 6 months',
      'filters.lastYear': 'Last year',
      'stats.totalTips': 'Total Tips',
      'stats.qrCodes': 'QR Codes',
      'stats.activeQRs': 'Active QR codes',
      'stats.tips': 'Tips',
      'stats.receivedTips': 'Received tips',
      'stats.service': 'Service',
      'stats.averageRating': 'Average rating',
      'rankings.bestPerformance': 'Best Performance',
      'rankings.bestTips': 'Best Tips',
      'rankings.noData': 'No data available for this period',
    },
    notifications: {
      title: 'Notifications',
      empty: 'No notifications',
    },
    profile: {
      title: 'My Profile',
    },
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Ocurrió un error',
      retry: 'Reintentar',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Volver',
      next: 'Siguiente',
      submit: 'Enviar',
      refresh: 'Actualizar',
      version: 'v2.0.0',
    },
    'auth.login': {
      title: '¡Hola, dueño de negocio!',
      titleWorker: '¡Hola, miembro del equipo!',
      toggleOwner: 'En realidad soy dueño de negocio',
      toggleWorker: 'En realidad soy miembro del equipo',
      email: 'Correo electrónico',
      emailPlaceholder: 'Ingresa tu correo',
      password: 'Contraseña',
      passwordPlaceholder: 'Ingresa tu contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      submit: 'Entrar',
      submitting: 'Iniciando sesión...',
      createAccount: '¿Aún no tienes cuenta?',
      createAccountLink: 'Crear una',
      'errors.emailRequired': 'El correo es obligatorio',
      'errors.emailInvalid': 'Ingresa un correo válido',
      'errors.passwordRequired': 'La contraseña es obligatoria',
      'errors.passwordMin': 'La contraseña debe tener al menos 6 caracteres',
    },
    'auth.forgotPassword': {
      title: '¿Olvidaste tu contraseña?',
      description: 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.',
      submit: 'Enviar enlace',
      submitting: 'Enviando...',
      backToLogin: 'Volver al inicio',
      success: 'Se envió el enlace de restablecimiento a tu correo.',
    },
    auth: {
      logout: 'Cerrar sesión',
    },
    menu: {
      title: 'Menú',
      session: 'Sesión: {role}',
      'items.home': 'Inicio',
      'items.myRestaurant': 'Mi Restaurante',
      'items.shiftRecord': 'Registro de Turno',
      'items.giftCards': 'Tarjetas de Regalo',
      'items.myQRCodes': 'Mis Códigos QR',
      'items.myStaff': 'Mi Personal',
      'items.viewMyProfile': 'Ver Mi Perfil',
      'items.notifications': 'Notificaciones',
    },
    business: {
      'pageHeader.title': 'Mi Restaurante',
      'pageHeader.tooltip': 'Ve las métricas de rendimiento de tu restaurante, incluyendo propinas totales, códigos QR activos y rankings del personal.',
      'filters.last30Days': 'Últimos 30 días',
      'filters.last3Months': 'Últimos 3 meses',
      'filters.last6Months': 'Últimos 6 meses',
      'filters.lastYear': 'Último año',
      'stats.totalTips': 'Propinas Totales',
      'stats.qrCodes': 'Códigos QR',
      'stats.activeQRs': 'QRs activos',
      'stats.tips': 'Propinas',
      'stats.receivedTips': 'Propinas recibidas',
      'stats.service': 'Servicio',
      'stats.averageRating': 'Calificación promedio',
      'rankings.bestPerformance': 'Mejor Rendimiento',
      'rankings.bestTips': 'Mejores Propinas',
      'rankings.noData': 'No hay datos disponibles para este período',
    },
    notifications: {
      title: 'Notificaciones',
      empty: 'Sin notificaciones',
    },
    profile: {
      title: 'Mi Perfil',
    },
  },
};

// Default menu items with translations
const DEFAULT_MENU_ITEMS: Record<string, MenuItemConfig[]> = {
  en: [
    { id: '1', key: 'dashboard', label: 'Home', path: '/dashboard', icon: 'Home', order: 1, enabled: true, roles: ['Manager', 'Restaurante', 'Mozo'] },
    { id: '2', key: 'business', label: 'My Restaurant', path: '/business', icon: 'BarChart3', order: 2, enabled: true, roles: ['Duenio', 'Manager'] },
    { id: '3', key: 'shift', label: 'Shift Record', path: '/shift', icon: 'Clock', order: 3, enabled: true, roles: ['Manager', 'Restaurante'] },
    { id: '4', key: 'giftcards', label: 'Gift Cards', path: '/giftcards', icon: 'CreditCard', order: 4, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio'] },
    { id: '5', key: 'qrs', label: 'My QR Codes', path: '/qrs', icon: 'QrCode', order: 5, enabled: true, roles: ['Manager', 'Restaurante'] },
    { id: '6', key: 'staff', label: 'My Staff', path: '/staff', icon: 'Users', order: 6, enabled: true, roles: ['Manager', 'Restaurante'] },
    { id: '7', key: 'profile', label: 'View My Profile', path: '/profile', icon: 'User', order: 7, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio', 'Mozo'] },
    { id: '8', key: 'notifications', label: 'Notifications', path: '/notifications', icon: 'Bell', order: 8, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio', 'Mozo'] },
  ],
  es: [
    { id: '1', key: 'dashboard', label: 'Inicio', path: '/dashboard', icon: 'Home', order: 1, enabled: true, roles: ['Manager', 'Restaurante', 'Mozo'] },
    { id: '2', key: 'business', label: 'Mi Restaurante', path: '/business', icon: 'BarChart3', order: 2, enabled: true, roles: ['Duenio', 'Manager'] },
    { id: '3', key: 'shift', label: 'Registro de Turno', path: '/shift', icon: 'Clock', order: 3, enabled: true, roles: ['Manager', 'Restaurante'] },
    { id: '4', key: 'giftcards', label: 'Tarjetas de Regalo', path: '/giftcards', icon: 'CreditCard', order: 4, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio'] },
    { id: '5', key: 'qrs', label: 'Mis Códigos QR', path: '/qrs', icon: 'QrCode', order: 5, enabled: true, roles: ['Manager', 'Restaurante'] },
    { id: '6', key: 'staff', label: 'Mi Personal', path: '/staff', icon: 'Users', order: 6, enabled: true, roles: ['Manager', 'Restaurante'] },
    { id: '7', key: 'profile', label: 'Ver Mi Perfil', path: '/profile', icon: 'User', order: 7, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio', 'Mozo'] },
    { id: '8', key: 'notifications', label: 'Notificaciones', path: '/notifications', icon: 'Bell', order: 8, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio', 'Mozo'] },
  ],
};

export const strapiRouter = router({
  // ============================================
  // Menu Items
  // ============================================

  /**
   * Get menu items from Strapi with role-based filtering
   */
  getMenuItems: publicProcedure
    .input(
      z.object({
        locale: z.string().default('en'),
        role: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        console.log(`[tRPC] getMenuItems called with locale=${input.locale}, role=${input.role || 'none'}`);
        const items = await strapi.getMenuItems(input.locale);
        console.log(`[tRPC] Received ${items.length} items from Strapi client`);
        
        if (items.length === 0) {
          console.log(`[tRPC] No items from Strapi, will use fallback`);
        }
        
        // Transform Strapi items to our format
        const allItems = items
          .filter((item) => {
            const isEnabled = item.enabled;
            if (!isEnabled) {
              console.log(`[tRPC] Filtering out disabled item: ${item.key}`);
            }
            return isEnabled;
          })
          .filter((item) => {
            if (!input.role) return true;
            const hasRole = item.roles.includes(input.role);
            if (!hasRole) {
              console.log(`[tRPC] Filtering out item ${item.key}: roles=${JSON.stringify(item.roles)}, required=${input.role}`);
            }
            return hasRole;
          })
          .sort((a, b) => a.order - b.order)
          .map((item) => ({
            id: String(item.id),
            key: item.key,
            label: item.label,
            path: item.path,
            icon: item.icon,
            order: item.order,
            enabled: item.enabled,
            roles: item.roles,
          }));

        console.log(`[tRPC] After filtering: ${allItems.length} items (total from Strapi=${items.length}, enabled=${items.filter(i => i.enabled).length}, role-filtered=${items.filter(i => !input.role || i.roles.includes(input.role)).length})`);

        if (allItems.length > 0) {
          console.log(`[tRPC] Returning ${allItems.length} items from Strapi`);
          return { items: allItems, source: 'strapi' as const };
        }

        // Fallback to default items
        const locale = input.locale === 'es' ? 'es' : 'en';
        const defaultItems = DEFAULT_MENU_ITEMS[locale] || DEFAULT_MENU_ITEMS['en'];
        console.log(`[tRPC] Using fallback. Default items: ${defaultItems.length}, role: ${input.role || 'none'}`);
        
        let filtered = input.role 
          ? defaultItems.filter((item) => {
              const matches = item.roles.includes(input.role!);
              if (!matches) {
                console.log(`[tRPC] Fallback: Item ${item.key} filtered out (roles=${JSON.stringify(item.roles)}, required=${input.role})`);
              }
              return matches;
            })
          : defaultItems;

        // If role filtering removed all items, return all items anyway (safety fallback)
        if (filtered.length === 0 && defaultItems.length > 0) {
          console.warn(`[tRPC] Role filter removed all items! Returning all default items as fallback. Role: ${input.role}`);
          filtered = defaultItems;
        }

        console.log(`[tRPC] Fallback returning ${filtered.length} items`);
        return { items: filtered, source: 'fallback' as const };
      } catch (error) {
        console.error('Error fetching menu from Strapi, using fallback:', error);
        
        const locale = input.locale === 'es' ? 'es' : 'en';
        const defaultItems = DEFAULT_MENU_ITEMS[locale] || DEFAULT_MENU_ITEMS['en'];
        const filtered = input.role 
          ? defaultItems.filter((item) => item.roles.includes(input.role!))
          : defaultItems;

        return { items: filtered, source: 'fallback' as const };
      }
    }),

  // ============================================
  // Translations
  // ============================================

  /**
   * Get translations from Strapi
   */
  getTranslations: publicProcedure
    .input(
      z.object({
        locale: z.string().default('en'),
        namespace: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const translations = await strapi.getTranslations(input.locale, input.namespace);
        
        if (Object.keys(translations).length > 0) {
          return { translations, source: 'strapi' as const };
        }
        
        // Fallback to defaults
        const locale = input.locale === 'es' ? 'es' : 'en';
        const defaults = DEFAULT_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS['en'];
        
        if (input.namespace) {
          return { 
            translations: defaults[input.namespace] || {}, 
            source: 'fallback' as const 
          };
        }
        
        // Flatten all namespaces
        const flatTranslations: Record<string, string> = {};
        Object.entries(defaults).forEach(([ns, values]) => {
          Object.entries(values).forEach(([key, value]) => {
            flatTranslations[`${ns}.${key}`] = value;
          });
        });
        
        return { translations: flatTranslations, source: 'fallback' as const };
      } catch (error) {
        console.error('Error fetching translations from Strapi:', error);
        
        const locale = input.locale === 'es' ? 'es' : 'en';
        const defaults = DEFAULT_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS['en'];
        
        if (input.namespace) {
          return { 
            translations: defaults[input.namespace] || {}, 
            source: 'fallback' as const 
          };
        }
        
        return { translations: {}, source: 'fallback' as const };
      }
    }),

  /**
   * Get all translations grouped by namespace
   */
  getAllTranslations: publicProcedure
    .input(z.object({ locale: z.string().default('en') }))
    .query(async ({ input }) => {
      try {
        const grouped = await strapi.getAllTranslations(input.locale);
        
        if (Object.keys(grouped).length > 0) {
          return { translations: grouped, source: 'strapi' as const };
        }
        
        const locale = input.locale === 'es' ? 'es' : 'en';
        return { 
          translations: DEFAULT_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS['en'], 
          source: 'fallback' as const 
        };
      } catch (error) {
        console.error('Error fetching all translations:', error);
        
        const locale = input.locale === 'es' ? 'es' : 'en';
        return { 
          translations: DEFAULT_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS['en'], 
          source: 'fallback' as const 
        };
      }
    }),

  // ============================================
  // Permissions
  // ============================================

  /**
   * Check if a role has permission for a specific action
   */
  checkPermission: publicProcedure
    .input(
      z.object({
        role: z.string(),
        resource: z.string(),
        action: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const allowed = await strapi.checkPermission(input.role, input.resource, input.action);
        return { allowed, source: 'strapi' as const };
      } catch (error) {
        console.error('Error checking permission:', error);
        return { allowed: true, source: 'fallback' as const };
      }
    }),

  // ============================================
  // Locales
  // ============================================

  /**
   * Get available locales
   */
  getLocales: publicProcedure.query(async () => {
    try {
      const locales = await strapi.getLocales();
      return { locales, source: 'strapi' as const };
    } catch (error) {
      console.error('Error fetching locales:', error);
      return { 
        locales: [
          { code: 'en', name: 'English', isDefault: true },
          { code: 'es', name: 'Español', isDefault: false },
        ], 
        source: 'fallback' as const 
      };
    }
  }),

  // ============================================
  // App Config
  // ============================================

  /**
   * Get app configuration from Strapi
   */
  getAppConfig: publicProcedure.query(async () => {
    try {
      const config = await strapi.getAppConfig();
      if (config) {
        return {
          config: {
            appName: config.appName,
            defaultLocale: config.defaultLocale,
            supportedLocales: config.supportedLocales,
            maintenanceMode: config.maintenanceMode,
            features: config.features,
          },
          source: 'strapi' as const,
        };
      }
      throw new Error('No config found');
    } catch (error) {
      console.error('Error fetching app config:', error);
      return {
        config: {
          appName: 'Tippit',
          defaultLocale: 'en',
          supportedLocales: ['en', 'es'],
          maintenanceMode: false,
          features: {
            giftCards: true,
            digitalMenu: false,
            notifications: true,
          },
        },
        source: 'fallback' as const,
      };
    }
  }),

  // ============================================
  // Health Check
  // ============================================

  /**
   * Check if Strapi is available
   */
  healthCheck: publicProcedure.query(async () => {
    const isHealthy = await strapi.healthCheck();
    return { healthy: isHealthy };
  }),
});
