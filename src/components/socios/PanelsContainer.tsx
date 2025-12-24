'use client';

import { useState, useCallback, useMemo, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Panel } from './Panel';
import { TabsPill } from './TabsPill';
import { X } from 'lucide-react';

interface PanelsContainerProps {
  restaurantId: string | null;
}

export interface PanelsContainerRef {
  addComparisonRestaurant: (restaurantId: string, restaurantName: string) => void;
  clearComparison: () => void;
  getComparisonRestaurantId: () => string | null;
  forceDataRefresh: () => void;
}

export const PanelsContainer = forwardRef<PanelsContainerRef, PanelsContainerProps>(
  ({ restaurantId }, ref) => {
    const t = useTranslations('socios');
    const [activeRestaurant, setActiveRestaurant] = useState(restaurantId);
    const [activeRestaurantName, setActiveRestaurantName] = useState('');
    const [comparisonRestaurantId, setComparisonRestaurantId] = useState<string | null>(null);
    const [comparisonRestaurantName, setComparisonRestaurantName] = useState('');
    const [mainRestaurantData, setMainRestaurantData] = useState<any[]>([]);
    const [comparisonRestaurantData, setComparisonRestaurantData] = useState<any[]>([]);
    const [waiterSelecteds, setWaiterSelecteds] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'tips' | 'reviews'>('tips');

    useEffect(() => {
      if (restaurantId && restaurantId !== activeRestaurant) {
        setActiveRestaurant(restaurantId);
      }
    }, [restaurantId, activeRestaurant]);

    const handleMainDataLoaded = useCallback((data: any[]) => {
      setMainRestaurantData(data);
    }, []);

    const handleComparisonDataLoaded = useCallback((data: any[]) => {
      setComparisonRestaurantData(data);
    }, []);

    const handleWaiterSelectionsChange = useCallback((waiters: any[]) => {
      setWaiterSelecteds(waiters);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        addComparisonRestaurant: (restId: string, restName: string) => {
          setComparisonRestaurantId(restId);
          setComparisonRestaurantName(restName);
        },
        clearComparison: () => {
          setComparisonRestaurantId(null);
          setComparisonRestaurantName('');
          setComparisonRestaurantData([]);
        },
        getComparisonRestaurantId: () => comparisonRestaurantId,
        forceDataRefresh: () => {
          // Trigger refresh by updating a timestamp
          setMainRestaurantData((prev) => [...prev]);
        },
      }),
      [comparisonRestaurantId]
    );

    return (
      <div className="panels-outer-container">
        <div className="panels-header-container mb-6">
          <TabsPill activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div
          className={`panels-container ${comparisonRestaurantId ? 'comparison-mode' : ''}`}
          style={{
            display: 'flex',
            flexDirection: comparisonRestaurantId ? 'row' : 'column',
            gap: '20px',
            width: '100%',
          }}
        >
          <div className="panel-wrapper flex-1">
            {comparisonRestaurantId && (
              <div className="panel-header-container mb-4">
                <div className="panel-header text-lg font-semibold text-gray-800">
                  {activeRestaurantName || t('mainRestaurant', { defaultValue: 'Main Restaurant' })}
                </div>
              </div>
            )}
            <Panel
              restaurantId={activeRestaurant}
              isComparisonMode={!!comparisonRestaurantId}
              onDataLoaded={handleMainDataLoaded}
              onWaiterSelectionsChange={handleWaiterSelectionsChange}
              waitersSelected={waiterSelecteds}
              activeTab={activeTab}
            />
          </div>

          {comparisonRestaurantId && (
            <div className="panel-wrapper flex-1">
              <div className="comparison-header mb-4 flex items-center justify-between">
                <div className="panel-header text-lg font-semibold text-gray-800">
                  {comparisonRestaurantName || t('comparisonRestaurant', { defaultValue: 'Comparison Restaurant' })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setComparisonRestaurantId(null);
                    setComparisonRestaurantName('');
                    setComparisonRestaurantData([]);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title={t('removeComparison', { defaultValue: 'Remove comparison' })}
                >
                  <X size={20} />
                </button>
              </div>
              <Panel
                restaurantId={comparisonRestaurantId}
                isComparisonMode={true}
                onDataLoaded={handleComparisonDataLoaded}
                onWaiterSelectionsChange={handleWaiterSelectionsChange}
                waitersSelected={waiterSelecteds}
                activeTab={activeTab}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

PanelsContainer.displayName = 'PanelsContainer';

