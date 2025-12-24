'use client';

import { BusinessLayout } from '@/components/layout/BusinessLayout';
import { DashboardScreen } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <BusinessLayout>
      <DashboardScreen />
    </BusinessLayout>
  );
}

