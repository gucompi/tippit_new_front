'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { locales, localeNames, localeFlags, Locale } from '@/i18n';
import { tokens } from '@/styles/tokens';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
  showFlags?: boolean;
  showNames?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  variant = 'dropdown',
  showFlags = true,
  showNames = true,
  className = '',
}: LanguageSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    // Set locale cookie for next-intl
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    
    // Reload the page to apply the new locale
    // This ensures all server components re-render with the new locale
    window.location.reload();
  }, []);

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-2 ${className}`} style={{ position: 'relative', zIndex: 10 }}>
        {locales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('[LanguageSwitcher] Button clicked:', locale);
              handleLocaleChange(locale);
            }}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors cursor-pointer
              ${currentLocale === locale
                ? 'bg-[#EB5998] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            style={{ 
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 11,
            }}
            aria-label={`Switch to ${localeNames[locale]}`}
          >
            {showFlags && <span style={{ pointerEvents: 'none' }}>{localeFlags[locale]}</span>}
            {showNames && <span style={{ pointerEvents: 'none' }}>{localeNames[locale]}</span>}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef} style={{ zIndex: 10 }}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E1E1E1] hover:bg-gray-50 transition-colors cursor-pointer"
        style={{ pointerEvents: 'auto' }}
        aria-label="Change language"
      >
        <Globe size={18} className="text-gray-500" />
        {showFlags && <span>{localeFlags[currentLocale]}</span>}
        {showNames && (
          <span className="text-sm text-gray-700">{localeNames[currentLocale]}</span>
        )}
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-[#E1E1E1] rounded-lg shadow-lg overflow-hidden animate-fade-in" style={{ zIndex: 100 }}>
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[LanguageSwitcher] Dropdown option clicked:', locale);
                handleLocaleChange(locale);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer
                ${currentLocale === locale
                  ? 'bg-pink-50 text-[#EB5998]'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
              style={{ pointerEvents: 'auto' }}
            >
              <div className="flex items-center gap-2">
                {showFlags && <span>{localeFlags[locale]}</span>}
                <span>{localeNames[locale]}</span>
              </div>
              {currentLocale === locale && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

