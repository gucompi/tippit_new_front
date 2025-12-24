'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import { MozoDashboard } from './MozoDashboard';
import { RestauranteDashboard } from './RestauranteDashboard';

export function DashboardScreen() {
  const t = useTranslations('dashboard');
  const { user } = useUser();

  // Determine user role - in real app, this would come from user metadata or API
  const userRole = useMemo(() => {
    // Check user's role from metadata or default to restaurant owner
    const role = user?.publicMetadata?.role as string | undefined;
    return role || 'Restaurante';
  }, [user]);

  const dashboardConfig = useMemo(() => {
    if (userRole === 'Mozo' || userRole === 'Waiter' || userRole === 'Employee') {
      return { type: 'mozo' as const };
    } else if (
      userRole === 'Restaurante' ||
      userRole === 'Duenio' ||
      userRole === 'Manager' ||
      userRole === 'Owner'
    ) {
      return { type: 'restaurante' as const };
    } else {
      return {
        type: 'unauthorized' as const,
        message: t('notAuthUser', { defaultValue: 'You are not authorized to view this page.' }),
      };
    }
  }, [userRole, t]);

  if (dashboardConfig.type === 'unauthorized') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{dashboardConfig.message}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      {dashboardConfig.type === 'mozo' ? <MozoDashboard /> : <RestauranteDashboard />}
    </div>
  );
}

