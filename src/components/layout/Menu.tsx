'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  Home,
  BarChart3,
  Clock,
  CreditCard,
  QrCode,
  Users,
  User,
  Bell,
  Menu as MenuIcon,
  X,
  LogOut,
} from 'lucide-react';
import { tokens } from '@/styles/tokens';
import { trpc } from '@/lib/trpc';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Skeleton } from '@/components/ui';

// Icon map for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Home,
  BarChart3,
  Clock,
  CreditCard,
  QrCode,
  Users,
  User,
  Bell,
};

interface MenuItemData {
  id: string;
  key: string;
  label: string;
  path: string;
  icon: string;
  order: number;
  enabled: boolean;
  roles: string[];
  badge?: React.ReactNode;
}

interface MenuItemProps {
  item: MenuItemData;
  isActive: boolean;
  onClick?: () => void;
}

function MenuItem({ item, isActive, onClick }: MenuItemProps) {
  const IconComponent = iconMap[item.icon] || Home;

  return (
    <li>
      <Link
        href={item.path}
        onClick={onClick}
        className={`
          flex items-center p-3 rounded-[22px] transition-colors duration-200 relative
          ${isActive 
            ? 'bg-[#EB5998] text-white' 
            : 'text-[#ACACAC] hover:bg-[#EB5998]/20 hover:text-[#EB5998]'
          }
        `}
      >
        <span className="mr-3">
          <IconComponent size={18} />
        </span>
        <span className="font-normal">{item.label}</span>
        {item.badge && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
}

interface UserSessionProps {
  user: {
    name: string;
    role: string;
    photo: string;
  } | null;
  onLogout: () => void;
}

function UserSession({ user, onLogout }: UserSessionProps) {
  const t = useTranslations('menu');

  if (!user) return null;

  return (
    <div
      className="bg-[#FAFAFA] border border-[#e1e1e1] rounded-[16px] p-4"
      style={{ width: '218px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={user.photo || '/profile_she.jpg'}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <div className="ml-3">
            <div className="text-black text-sm font-medium truncate max-w-[100px]">
              {user.name}
            </div>
            <div className="text-gray-400 text-xs">
              {t('session', { role: user.role })}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-gray-400 hover:text-[#EB5998] transition-colors p-1"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Skeleton key={i} variant="rectangular" height="44px" className="rounded-[22px]" />
      ))}
    </div>
  );
}

export function Menu() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('menu');
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('Manager');
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signOut } = useClerk();

  // Get user role from Clerk user metadata or localStorage fallback
  useEffect(() => {
    if (isUserLoaded && user) {
      // Try to get role from Clerk user metadata
      const role = (user.publicMetadata?.role as string) || 
                   (user.unsafeMetadata?.role as string) ||
                   localStorage.getItem('rol') || 
                   'Manager';
      setUserRole(role);
    } else if (typeof window !== 'undefined') {
      const role = localStorage.getItem('rol') || 'Manager';
      setUserRole(role);
    }
  }, [user, isUserLoaded]);

  // Get menu items from Strapi via tRPC
  const { data: menuData, isLoading: isLoadingMenu, error: menuError } = trpc.strapi.getMenuItems.useQuery(
    { locale, role: userRole },
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      retry: 1,
    }
  );

  // Debug logging
  useEffect(() => {
    console.log('[Menu] State:', {
      isLoading: isLoadingMenu,
      hasMenuData: !!menuData,
      menuDataKeys: menuData ? Object.keys(menuData) : [],
      menuDataItems: menuData?.items,
      menuDataItemsLength: menuData?.items?.length,
      menuError: menuError ? String(menuError) : null,
    });
    if (menuData) {
      console.log('[Menu] Menu data received:', {
        source: menuData.source,
        itemCount: menuData.items?.length || 0,
        items: menuData.items?.map(i => `${i.key}: ${i.label}`).join(', '),
        fullData: JSON.stringify(menuData, null, 2),
      });
    }
    if (menuError) {
      console.error('[Menu] Error fetching menu items:', menuError);
    }
  }, [menuData, menuError, isLoadingMenu]);

  // Get notification stats
  const { data: notificationStats } = trpc.business.getNotificationStats.useQuery(undefined, {
    staleTime: 30 * 1000,
  });

  // Get current restaurant info
  const { data: restaurantInfo } = trpc.business.getCurrentRestaurant.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const handleLogout = useCallback(async () => {
    setIsOpen(false);
    try {
      await signOut();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('user');
      }
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut, router]);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Process menu items with notification badge
  const menuItems: MenuItemData[] = useMemo(() => {
    // Handle different possible data structures
    let items: any[] = [];
    
    if (menuData) {
      // Try different possible structures
      if (Array.isArray(menuData.items)) {
        items = menuData.items;
      } else if (Array.isArray(menuData)) {
        items = menuData;
      } else if ('data' in menuData && Array.isArray((menuData as any).data)) {
        items = (menuData as any).data;
      }
    }
    
    console.log('[Menu] Processing menu items:', {
      menuDataExists: !!menuData,
      menuDataType: menuData ? typeof menuData : 'null',
      menuDataKeys: menuData ? Object.keys(menuData) : [],
      menuDataItems: menuData?.items,
      menuDataItemsType: menuData?.items ? typeof menuData.items : 'null',
      menuDataItemsIsArray: Array.isArray(menuData?.items),
      itemsLength: items.length,
      isLoading: isLoadingMenu,
      rawMenuData: (() => {
        try {
          const str = JSON.stringify(menuData, null, 2);
          return str ? str.substring(0, 500) : 'Unable to stringify';
        } catch (e) {
          return 'Error stringifying: ' + String(e);
        }
      })(),
    });
    
    if (items.length === 0 && menuData) {
      console.warn('[Menu] No items found in menuData, but menuData exists:', menuData);
    }
    
    const processed = items.map((item: any) => ({
      id: String(item.id || item.key || Math.random()),
      key: item.key,
      label: item.label,
      path: item.path,
      icon: item.icon,
      order: item.order || 0,
      enabled: item.enabled !== false,
      roles: Array.isArray(item.roles) ? item.roles : [],
      badge: item.key === 'notifications' && notificationStats?.unread && notificationStats.unread > 0 ? (
        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {notificationStats.unread > 9 ? '9+' : notificationStats.unread}
        </span>
      ) : undefined,
    }));
    
    console.log('[Menu] Processed menu items:', processed.length, processed.map(i => `${i.key}: ${i.label}`));
    return processed;
  }, [menuData, notificationStats, isLoadingMenu]);

  const userData = useMemo(() => {
    // Prioritize Clerk user data, fallback to restaurantInfo
    if (isUserLoaded && user) {
      const fullName = user.fullName || 
                      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                      user.emailAddresses[0]?.emailAddress ||
                      'User';
      const photo = user.imageUrl || restaurantInfo?.photo || '/profile_she.jpg';
      const role = (user.publicMetadata?.role as string) || 
                   (user.unsafeMetadata?.role as string) ||
                   restaurantInfo?.role ||
                   'Manager';
      
      return {
        name: fullName,
        role: role,
        photo: photo,
      };
    }
    
    if (restaurantInfo) {
      return {
        name: restaurantInfo.name,
        role: restaurantInfo.role,
        photo: restaurantInfo.photo,
      };
    }
    
    return null;
  }, [user, isUserLoaded, restaurantInfo]);

  const MenuPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={`flex flex-col p-4 space-y-2 w-full ${isMobile ? '' : 'h-screen'}`}>
      {/* Logo */}
      <div className={`${isMobile ? 'mb-6' : 'mb-10 mt-7 pr-5 pl-2'}`}>
        <Image
          src="/Tippit-logo-Texto-1024x242.png"
          alt="Tippit Logo"
          width={isMobile ? 176 : 200}
          height={isMobile ? 42 : 47}
          priority
        />
      </div>

      {/* Close button for mobile */}
      {isMobile && (
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      )}

      {/* Menu Title */}
      <span className="text-[#878787] font-normal text-sm pl-[2px] pb-4">
        {t('title')}
      </span>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mb-2 p-2 bg-gray-50 rounded">
          <div>Loading: {String(isLoadingMenu)}</div>
          <div>Has Data: {String(!!menuData)}</div>
          <div>Items: {menuData?.items?.length || 0}</div>
          <div>Processed: {menuItems.length}</div>
          <div>Source: {menuData?.source || 'none'}</div>
        </div>
      )}

      {/* Menu Items */}
      {(() => {
        console.log('[Menu] Rendering menu items section:', {
          isLoadingMenu,
          menuItemsLength: menuItems.length,
          menuDataExists: !!menuData,
          menuDataItemsLength: menuData?.items?.length,
        });
        return null;
      })()}
      {isLoadingMenu ? (
        <MenuSkeleton />
      ) : menuItems.length > 0 ? (
        <ul className="space-y-2 flex-1">
          {menuItems.map((item) => {
            console.log('[Menu] Rendering menu item:', item.key, item.label);
            return (
              <MenuItem
                key={item.id}
                item={item}
                isActive={pathname === item.path}
                onClick={isMobile ? closeMenu : undefined}
              />
            );
          })}
        </ul>
      ) : (
        <div className="text-gray-400 text-sm p-4">
          {menuError ? (
            <div>
              <div>Error loading menu</div>
              <div className="text-xs mt-2">{String(menuError)}</div>
            </div>
          ) : (
            <div>
              <div>No menu items available</div>
              <div className="text-xs mt-2">
                menuData: {menuData ? 'exists' : 'null'}, 
                items: {menuData?.items?.length || 0}, 
                isLoading: {String(isLoadingMenu)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Language Switcher */}
      <div 
        className="mt-4 pt-4 border-t border-[#E1E1E1]"
        style={{ 
          position: 'relative',
          zIndex: 20,
          pointerEvents: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <LanguageSwitcher variant="buttons" showNames={false} />
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Menu */}
      <div
        className="hidden xl:flex fixed left-0 top-0 h-screen bg-white text-gray-200 text-sm font-sans z-40 flex-col"
        style={{ width: '250px' }}
      >
        <MenuPanel />
        
        {/* User Session - Fixed at bottom */}
        <div className="absolute bottom-4 left-4">
          <UserSession user={userData} onLogout={handleLogout} />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="xl:hidden fixed bottom-0 right-0 z-50">
        <button
          className="text-white bg-[#EB5998] p-2 rounded-full m-4 shadow-lg hover:bg-[#d94985] transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <MenuIcon size={32} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/50 z-40 flex justify-start animate-fade-in"
          onClick={closeMenu}
        >
          <div
            className="bg-white w-64 h-full overflow-y-auto relative animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuPanel isMobile />
            
            {/* User Session for mobile */}
            <div className="absolute bottom-4 left-4 right-4">
              <UserSession user={userData} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
