/**
 * Strapi API Client
 * Handles all communication with the Strapi CMS backend
 */

const STRAPI_API_URL = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://strapi-tippit-u63628.vm.elestio.app';
const STRAPI_API_KEY = process.env.STRAPI_API_KEY || '4782a39b0872850ac4e89df9e6e7874233751e5c98da64587e83181d4ee408930abd95d92c3cb0afaece2a322e17b0fa669c84638c2f1ab460a8f885dc21211e9673119b4550b27c11819497c2bc51d33f666ecd33e626026348f456ac664500506b762dc7670a2e5f7760424c7efbcb1fe6c526247ceebc0ae62f0822c73fea';

// Types for Strapi responses
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface StrapiMenuItem {
  id: number;
  documentId?: string;
  key: string;
  label: string;
  path: string;
  icon: string;
  order: number;
  enabled: boolean;
  roles: string[];
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  localizations?: Array<{
    id: number;
    documentId?: string;
    label: string;
    locale: string;
  }>;
}

export interface StrapiTranslation {
  id: number;
  documentId?: string;
  key: string;
  value: string;
  namespace: string;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface StrapiPermission {
  id: number;
  role: string;
  resource: string;
  action: string;
  allowed: boolean;
}

export interface StrapiAppConfig {
  id: number;
  appName: string;
  defaultLocale: string;
  supportedLocales: string[];
  maintenanceMode: boolean;
  features: Record<string, boolean>;
}

// Default fallback data
const DEFAULT_MENU_ITEMS: StrapiMenuItem[] = [
  { id: 1, key: 'dashboard', label: 'Home', path: '/dashboard', icon: 'Home', order: 1, enabled: true, roles: ['Manager', 'Restaurante', 'Mozo'] },
  { id: 2, key: 'business', label: 'My Restaurant', path: '/business', icon: 'BarChart3', order: 2, enabled: true, roles: ['Duenio', 'Manager'] },
  { id: 3, key: 'shift', label: 'Shift Record', path: '/shift', icon: 'Clock', order: 3, enabled: true, roles: ['Manager', 'Restaurante'] },
  { id: 4, key: 'giftcards', label: 'Gift Cards', path: '/giftcards', icon: 'CreditCard', order: 4, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio'] },
  { id: 5, key: 'qrs', label: 'My QR Codes', path: '/qrs', icon: 'QrCode', order: 5, enabled: true, roles: ['Manager', 'Restaurante'] },
  { id: 6, key: 'staff', label: 'My Staff', path: '/staff', icon: 'Users', order: 6, enabled: true, roles: ['Manager', 'Restaurante'] },
  { id: 7, key: 'profile', label: 'View My Profile', path: '/profile', icon: 'User', order: 7, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio', 'Mozo'] },
  { id: 8, key: 'notifications', label: 'Notifications', path: '/notifications', icon: 'Bell', order: 8, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio', 'Mozo'] },
];

const DEFAULT_MENU_ITEMS_ES: Record<string, string> = {
  'dashboard': 'Inicio',
  'business': 'Mi Restaurante',
  'shift': 'Registro de Turno',
  'giftcards': 'Tarjetas de Regalo',
  'qrs': 'Mis Códigos QR',
  'staff': 'Mi Personal',
  'profile': 'Ver Mi Perfil',
  'notifications': 'Notificaciones',
};

class StrapiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = STRAPI_API_URL;
    this.apiKey = STRAPI_API_KEY;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        cache: 'no-store', // Disable cache for dynamic data
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Strapi API error (${response.status}):`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Strapi fetch error for ${endpoint}:`, error);
      throw error;
    }
  }

  // ============================================
  // Menu Items
  // ============================================

  async getMenuItems(locale: string = 'en'): Promise<StrapiMenuItem[]> {
    try {
      const endpoint = `/menu-items?locale=${locale}&sort=order:asc&publicationState=live`;
      console.log(`[Strapi] Fetching menu items from: ${endpoint}`);
      const response = await this.fetch<StrapiResponse<any[]>>(endpoint);
      
      console.log(`[Strapi] Received ${response.data?.length || 0} menu items`);
      
      if (response.data && response.data.length > 0) {
        // Transform Strapi v5 response format to our format
        const allItems = response.data.map((item: any) => {
          // Handle both formats: direct properties or nested in attributes
          const attributes = item.attributes || item;
          return {
            id: item.id,
            documentId: item.documentId,
            key: attributes.key,
            label: attributes.label,
            path: attributes.path,
            icon: attributes.icon,
            order: attributes.order || 0,
            enabled: attributes.enabled !== false, // Default to true if not specified
            roles: Array.isArray(attributes.roles) ? attributes.roles : [],
            locale: attributes.locale || locale,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            publishedAt: item.publishedAt,
          };
        });
        
        // If Strapi returns items for multiple locales, deduplicate by key
        // Use known label mappings to detect locale
        const itemsByKey = new Map<string, StrapiMenuItem>();
        allItems.forEach((item: StrapiMenuItem) => {
          const existing = itemsByKey.get(item.key);
          
          // Determine if this item matches the requested locale using known mappings
          const expectedSpanishLabel = DEFAULT_MENU_ITEMS_ES[item.key];
          const isSpanishLabel = expectedSpanishLabel && item.label === expectedSpanishLabel;
          const isEnglishLabel = !isSpanishLabel; // If it's not the known Spanish label, assume English
          const matchesLocale = (locale === 'en' && isEnglishLabel) || (locale === 'es' && isSpanishLabel);
          
          if (!existing) {
            itemsByKey.set(item.key, item);
          } else {
            // Prefer the item that matches the requested locale
            const existingExpectedSpanishLabel = DEFAULT_MENU_ITEMS_ES[existing.key];
            const existingIsSpanishLabel = existingExpectedSpanishLabel && existing.label === existingExpectedSpanishLabel;
            const existingIsEnglishLabel = !existingIsSpanishLabel;
            const existingMatchesLocale = (locale === 'en' && existingIsEnglishLabel) || (locale === 'es' && existingIsSpanishLabel);
            
            if (matchesLocale && !existingMatchesLocale) {
              itemsByKey.set(item.key, item);
            }
          }
        });
        
        const items = Array.from(itemsByKey.values());
        
        console.log(`[Strapi] After deduplication: ${items.length} menu items for locale ${locale}`);
        if (items.length > 0) {
          console.log(`[Strapi] Returning menu items:`, items.map(i => `${i.key}: ${i.label}`).join(', '));
          return items;
        }
      }
      
      // Return default items if Strapi returns empty
      return this.getDefaultMenuItems(locale);
    } catch (error) {
      console.error('Error fetching menu items from Strapi, using defaults:', error);
      return this.getDefaultMenuItems(locale);
    }
  }

  private getDefaultMenuItems(locale: string = 'en'): StrapiMenuItem[] {
    if (locale === 'es') {
      return DEFAULT_MENU_ITEMS.map(item => ({
        ...item,
        label: DEFAULT_MENU_ITEMS_ES[item.key] || item.label,
        locale: 'es',
      }));
    }
    return DEFAULT_MENU_ITEMS.map(item => ({ ...item, locale: 'en' }));
  }

  // ============================================
  // Translations
  // ============================================

  async getTranslations(locale: string = 'en', namespace?: string): Promise<Record<string, string>> {
    try {
      let endpoint = `/translations?locale=${locale}&pagination[limit]=1000`;
      if (namespace) {
        endpoint += `&filters[namespace][$eq]=${namespace}`;
      }
      
      const response = await this.fetch<StrapiResponse<StrapiTranslation[]>>(endpoint);
      
      if (response.data && response.data.length > 0) {
        // Convert array to key-value object
        const translations: Record<string, string> = {};
        response.data.forEach((item) => {
          const key = namespace 
            ? item.key 
            : `${item.namespace}.${item.key}`;
          translations[key] = item.value;
        });
        return translations;
      }
      
      return {};
    } catch (error) {
      console.error('Error fetching translations from Strapi:', error);
      return {};
    }
  }

  async getAllTranslations(locale: string = 'en'): Promise<Record<string, Record<string, string>>> {
    try {
      const response = await this.fetch<StrapiResponse<StrapiTranslation[]>>(
        `/translations?locale=${locale}&pagination[limit]=1000`
      );
      
      if (response.data && response.data.length > 0) {
        // Group by namespace
        const grouped: Record<string, Record<string, string>> = {};
        response.data.forEach((item) => {
          if (!grouped[item.namespace]) {
            grouped[item.namespace] = {};
          }
          grouped[item.namespace][item.key] = item.value;
        });
        return grouped;
      }
      
      return {};
    } catch (error) {
      console.error('Error fetching all translations:', error);
      return {};
    }
  }

  // ============================================
  // Permissions
  // ============================================

  async getPermissions(role?: string): Promise<StrapiPermission[]> {
    try {
      let endpoint = '/permissions?populate=*';
      if (role) {
        endpoint += `&filters[role][$eq]=${role}`;
      }
      
      const response = await this.fetch<StrapiResponse<StrapiPermission[]>>(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  }

  async checkPermission(role: string, resource: string, action: string): Promise<boolean> {
    try {
      const permissions = await this.getPermissions(role);
      return permissions.some(
        (p) =>
          p.resource === resource &&
          p.action === action &&
          p.allowed
      );
    } catch (error) {
      console.error('Error checking permission:', error);
      return true; // Default allow on error
    }
  }

  // ============================================
  // App Configuration
  // ============================================

  async getAppConfig(): Promise<StrapiAppConfig | null> {
    try {
      const response = await this.fetch<StrapiResponse<StrapiAppConfig>>('/app-config');
      return response.data;
    } catch (error) {
      console.error('Error fetching app config:', error);
      return null;
    }
  }

  // ============================================
  // Locales
  // ============================================

  async getLocales(): Promise<Array<{ code: string; name: string; isDefault: boolean }>> {
    try {
      const response = await this.fetch<Array<{ code: string; name: string; isDefault: boolean }>>(
        '/i18n/locales'
      );
      return response || [{ code: 'en', name: 'English', isDefault: true }];
    } catch (error) {
      console.error('Error fetching locales:', error);
      return [
        { code: 'en', name: 'English', isDefault: true },
        { code: 'es', name: 'Español', isDefault: false },
      ];
    }
  }

  // ============================================
  // Health Check
  // ============================================

  async healthCheck(): Promise<boolean> {
    try {
      await fetch(`${this.baseUrl}/_health`);
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const strapi = new StrapiClient();

// Export types
export type { StrapiClient };
