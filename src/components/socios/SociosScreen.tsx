'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/business/PageHeader';
import { SwitcherRestaurantes } from './SwitcherRestaurantes';
import { PanelsContainer, PanelsContainerRef } from './PanelsContainer';

export function SociosScreen() {
  const t = useTranslations('socios');
  const panelsContainerRef = useRef<PanelsContainerRef>(null);
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);
  const [comparisonRestaurantId, setComparisonRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    // Get initial restaurant ID from sessionStorage or default
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('activeRestaurant');
      setActiveRestaurantId(stored || 'restaurant-1');
    }
  }, []);

  const handleAddComparison = useCallback(
    (restaurantId: string, restaurantName: string) => {
      if (panelsContainerRef.current) {
        panelsContainerRef.current.addComparisonRestaurant(restaurantId, restaurantName);
        setComparisonRestaurantId(restaurantId);
      }
    },
    []
  );

  const handleRemoveComparison = useCallback(
    (restaurantId: string) => {
      if (panelsContainerRef.current) {
        panelsContainerRef.current.clearComparison();
        setComparisonRestaurantId(null);
      }
    },
    []
  );

  const handleSwitchComplete = useCallback((restaurantId: string, restaurantName: string) => {
    setActiveRestaurantId(restaurantId);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('activeRestaurant', restaurantId);
    }
    if (panelsContainerRef.current && panelsContainerRef.current.forceDataRefresh) {
      panelsContainerRef.current.forceDataRefresh();
    }
  }, []);

  return (
    <main className="flex-1">
      <SwitcherRestaurantes
        onAddComparison={handleAddComparison}
        onSwitchComplete={handleSwitchComplete}
        comparisonRestaurantId={comparisonRestaurantId}
        onRemoveComparison={handleRemoveComparison}
      />

      <PageHeader
        titleKey="socios.title"
        tooltipKey="socios.pageHeaderTooltip"
        showNotificationIcon={true}
      />

      <PanelsContainer ref={panelsContainerRef} restaurantId={activeRestaurantId} />
    </main>
  );
}

