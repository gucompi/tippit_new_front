'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useClerk, useUser } from '@clerk/nextjs';
import { Bell, ChevronDown, RefreshCw, HelpCircle } from 'lucide-react';
import { tokens } from '@/styles/tokens';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/ui';

interface PageHeaderProps {
  titleKey?: string;
  title?: string;
  tooltipKey?: string;
  tooltipContent?: string;
  showHelpIcon?: boolean;
  showNotificationIcon?: boolean;
  showProfileIcon?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function PageHeader({
  titleKey,
  title,
  tooltipKey,
  tooltipContent,
  showHelpIcon = true,
  showNotificationIcon = true,
  showProfileIcon = true,
  onRefresh,
  isRefreshing = false,
}: PageHeaderProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const t = useTranslations();
  const tAuth = useTranslations('auth');
  const [showTooltip, setShowTooltip] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get notification stats
  const { data: notificationStats, isLoading: isLoadingNotifications } =
    trpc.business.getNotificationStats.useQuery(undefined, {
      staleTime: 30 * 1000,
    });

  // Get restaurant info
  const { data: restaurantInfo } = trpc.business.getCurrentRestaurant.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      // Sign out from Clerk
      await signOut();
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Still redirect even if signOut fails
      router.push('/');
    }
  };

  // Prioritize Clerk user image, fallback to restaurantInfo, then default
  const photoSrc = user?.imageUrl || restaurantInfo?.photo || '/profile_she.jpg';
  
  // Resolve title and tooltip from translation keys or direct values
  const displayTitle = titleKey ? t(titleKey) : title;
  const displayTooltip = tooltipKey ? t(tooltipKey) : tooltipContent;

  return (
    <div className="w-[calc(100%-36px)] bg-white rounded-[16px] border border-[#E1E1E1] py-4 px-4 md:px-12 mb-6 mx-[18px] mt-4">
      <div className="flex items-center justify-between">
        {/* Left side: Title with help icon */}
        <div className="flex items-center space-x-3">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">{displayTitle}</h1>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={t('common.refresh')}
              aria-label={t('common.refresh')}
            >
              <RefreshCw
                className={`w-5 h-5 text-[#EB5998] ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          )}

          {showHelpIcon && displayTooltip && (
            <div className="relative">
              <button
                className="w-6 h-6 rounded-full flex items-center justify-center cursor-help hover:bg-gray-200 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Help"
              >
                <HelpCircle className="w-5 h-5 text-gray-400" />
              </button>

              {showTooltip && (
                <div className="absolute top-full left-0 mt-2 px-4 py-3 bg-[#EB5998] text-white text-sm rounded-lg shadow-lg z-[9999] max-w-md w-[350px] animate-fade-in">
                  <div className="text-left whitespace-normal">{displayTooltip}</div>
                  <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#EB5998]" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Notification and Profile */}
        <div className="flex items-center space-x-3">
          {showNotificationIcon && (
            <div className="relative">
              <button
                className="w-10 h-10 md:w-12 md:h-12 border border-[#E1E1E1] rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={handleNotificationClick}
                title={t('notifications.title')}
                aria-label={t('notifications.title')}
              >
                <Bell className="w-4 h-4 text-gray-600" />
              </button>

              {notificationStats && notificationStats.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {notificationStats.unread > 99 ? '99+' : notificationStats.unread}
                </div>
              )}

              {isLoadingNotifications && (
                <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          )}

          {showProfileIcon && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center border border-[#E1E1E1] rounded-full hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
                  <Image
                    src={photoSrc}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown className="ml-2 mr-3 text-[#222222] w-3 h-3" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-[#E1E1E1] rounded-lg shadow-lg z-50 animate-fade-in">
                  <button
                    onClick={() => router.push('/profile')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg text-sm"
                  >
                    {t('profile.title')}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg text-sm"
                  >
                    {tAuth('logout')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="w-[calc(100%-36px)] bg-white rounded-[16px] border border-[#E1E1E1] py-4 px-4 md:px-12 mb-6 mx-[18px] mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton variant="text" width={200} height={28} />
          <Skeleton variant="circular" width={24} height={24} />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton variant="circular" width={48} height={48} />
        </div>
      </div>
    </div>
  );
}
