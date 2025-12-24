'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import { trpc } from '@/lib/trpc';
import { PageHeader } from '@/components/business/PageHeader';
import { AmountDisplay } from './AmountDisplay';
import { RestauranteBotones } from './RestauranteBotones';
import { Tiempo } from './Tiempo';
import { Mesa } from './Mesa';
import { Mozo } from './Mozo';
import { Payments } from './Payments';
import { Skeleton } from '@/components/ui';

export function RestauranteDashboard() {
  const t = useTranslations('dashboard.restaurant');
  const { user } = useUser();
  const [activeButton, setActiveButton] = useState<'Tiempo' | 'Mesa' | 'Mozo'>('Tiempo');
  const [activeSubButton, setActiveSubButton] = useState<'UltimaSemana' | 'UltimaMes' | 'UltimoAnio'>(
    'UltimaSemana'
  );
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const { data: paymentsData, isLoading } = trpc.dashboard.getRestaurantPayments.useQuery(
    {
      restaurantId: 'restaurant-1', // In real app, get from user context
      activeButton,
      activeSubButton,
    },
    {
      staleTime: 30 * 1000,
    }
  );

  const handleButtonClick = useCallback((button: 'Tiempo' | 'Mesa' | 'Mozo') => {
    setActiveButton(button);
  }, []);

  const handleSubButtonClick = useCallback(
    (button: 'UltimaSemana' | 'UltimaMes' | 'UltimoAnio') => {
      setActiveSubButton(button);
    },
    []
  );

  const toggleExpand = useCallback((key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pt-3 pb-10 overflow-x-hidden">
        <PageHeader
          titleKey="dashboard.restaurant.yourRestaurant"
          tooltipKey="dashboard.restaurant.pageHeaderTooltip"
        />
        <div className="w-11/12 mx-auto max-w-[900px] space-y-4">
          <Skeleton variant="rectangular" width="100%" height={120} className="rounded-lg" />
          <Skeleton variant="rectangular" width="100%" height={400} className="rounded-lg" />
        </div>
      </div>
    );
  }

  const groupedPayments = paymentsData?.groupedPayments || {};
  const totalPayments = paymentsData?.totalPayments || 0;
  const mozoDetails = paymentsData?.mozoDetails || {};
  const mesaDetails = paymentsData?.mesaDetails || {};
  const groupedPaymentsArray = paymentsData?.groupedPaymentsArray || [];

  return (
    <div>
      <div className="w-full min-h-screen pt-3 pb-10 overflow-x-hidden">
        <PageHeader
          title={t('yourRestaurant', { name: user?.firstName || 'Restaurant' })}
          tooltipKey="dashboard.restaurant.pageHeaderTooltip"
        />

        <div className="flex flex-col md:flex-row gap-4 w-11/12 mx-auto items-center justify-center max-w-[900px] mt-6 mb-6">
          <AmountDisplay activeSubButton={activeSubButton} totalPayments={totalPayments} />
          <div className="text-center bg-white w-11/12 mx-auto rounded-lg py-3 md:p-0 md:h-[120px] border border-[#E1E1E1] flex items-center justify-center">
            <RestauranteBotones activeButton={activeButton} handleButtonClick={handleButtonClick} />
          </div>
        </div>

        <div className="w-11/12 pt-5 mt-2 px-5 pb-5 min-h-full mx-auto bg-white border border-[#E1E1E1] rounded-lg max-w-[900px] overflow-x-hidden">
          {activeButton === 'Tiempo' && (
            <Tiempo activeSubButton={activeSubButton} handleSubButtonClick={handleSubButtonClick} />
          )}

          {Object.entries(groupedPayments).map(([key, payments]) => (
            <div key={key}>
              {activeButton === 'Mesa' && <Mesa pos={key} mesaDetails={mesaDetails} />}

              {activeButton === 'Mozo' && (
                <Mozo
                  pos={key}
                  mozoDetails={mozoDetails}
                  groupedPaymentsArray={groupedPaymentsArray}
                />
              )}

              {activeButton !== 'Mesa' && (
                <h3 className="bg-gray-100 rounded-md p-2 text-sm mt-2">{key}</h3>
              )}
              <div>
                {payments
                  .sort(
                    (a, b) =>
                      new Date(b.hora_aprovacion_pago).getTime() -
                      new Date(a.hora_aprovacion_pago).getTime()
                  )
                  .slice(0, expandedGroups[key] ? payments.length : 5)
                  .map((payment, paymentIndex) => (
                    <Payments
                      key={payment.id}
                      paymentIndex={paymentIndex}
                      activeButton={activeButton}
                      activeSubButton={activeSubButton}
                      mesaDetails={mesaDetails}
                      payment={payment}
                      cantPayments={payments.length}
                      pos={key}
                    />
                  ))}
                {!expandedGroups[key] && payments.length > 5 && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="transition-all duration-300 ease-in-out mt-5 mb-12 text-sm md:text-lg text-white py-3 px-5 w-full md:w-1/4 bg-[#FF5EA3] rounded-md hover:bg-[#FF7DF2] hover:scale-105"
                      onClick={() => toggleExpand(key)}
                    >
                      {t('showAll', { defaultValue: 'Show All' })}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

