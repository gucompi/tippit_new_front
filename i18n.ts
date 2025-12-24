import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { strapi } from './src/lib/strapi';

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  
  // Then try Accept-Language header
  const headerStore = await headers();
  const acceptLanguage = headerStore.get('Accept-Language');
  
  // Determine the locale
  let locale: Locale = defaultLocale;
  
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    locale = localeCookie as Locale;
  } else if (acceptLanguage) {
    // Parse Accept-Language header
    const browserLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (locales.includes(browserLocale as Locale)) {
      locale = browserLocale as Locale;
    }
  }

  // Load translations from Strapi
  try {
    const translations = await strapi.getAllTranslations(locale);
    
    // Convert Strapi format to next-intl format
    // Strapi returns: { namespace: { key: value } }
    // next-intl expects nested structure without dots in namespace keys
    // Namespaces with dots (e.g., 'auth.login') need to become nested: auth: { login: { ... } }
    const messages: Record<string, any> = {};
    
    Object.entries(translations).forEach(([namespace, keys]) => {
      // Handle namespace with dots (e.g., 'auth.login' -> auth.login structure)
      const namespaceParts = namespace.split('.');
      
      // Get or create the nested namespace structure
      let namespaceTarget = messages;
      for (let i = 0; i < namespaceParts.length; i++) {
        if (!namespaceTarget[namespaceParts[i]]) {
          namespaceTarget[namespaceParts[i]] = {};
        }
        namespaceTarget = namespaceTarget[namespaceParts[i]];
      }
      
      // Now add keys to the target namespace
      Object.entries(keys).forEach(([key, value]) => {
        // Handle nested keys within the namespace (e.g., 'tabs.giftCards' -> tabs: { giftCards: value })
        // or 'clientsTable.searchPlaceholder' -> clientsTable: { searchPlaceholder: value })
        const keyParts = key.split('.');
        if (keyParts.length > 1) {
          // Build nested structure for the key
          let current = namespaceTarget;
          for (let i = 0; i < keyParts.length - 1; i++) {
            const part = keyParts[i];
            if (!current[part]) {
              current[part] = {};
            }
            // If the current part is already a string (not an object), we need to preserve it
            // This shouldn't happen with our data structure, but handle it gracefully
            if (typeof current[part] !== 'object' || current[part] === null) {
              current[part] = {};
            }
            current = current[part] as Record<string, any>;
          }
          // Set the final value
          current[keyParts[keyParts.length - 1]] = value;
        } else {
          // Simple key (no dots) - only set if it doesn't already exist as an object
          if (!namespaceTarget[key] || typeof namespaceTarget[key] === 'string') {
            namespaceTarget[key] = value;
          }
        }
      });
    });

    // If we got translations from Strapi, use them
    if (Object.keys(messages).length > 0) {
      // Debug: Log giftCards namespace structure
      if (messages.giftCards) {
        console.log('[i18n] giftCards namespace structure:', {
          hasTabs: !!messages.giftCards.tabs,
          hasClientsTable: !!messages.giftCards.clientsTable,
          tabsKeys: messages.giftCards.tabs ? Object.keys(messages.giftCards.tabs) : [],
          clientsTableKeys: messages.giftCards.clientsTable ? Object.keys(messages.giftCards.clientsTable) : [],
        });
      }
      return {
        locale,
        messages,
      };
    }
  } catch (error) {
    console.error('Error loading translations from Strapi:', error);
    // Fall through to empty messages - components should handle missing translations gracefully
  }

  // Fallback to empty messages if Strapi fails
  // Components using useTranslations will need to handle missing keys
  return {
    locale,
    messages: {},
  };
});

