'use client';

import { useTranslations } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import { trpc } from '@/lib/trpc';
import { PageHeader } from '@/components/business/PageHeader';
import { PaymentsSummary } from './PaymentsSummary';
import { PaymentsList } from './PaymentsList';
import { MercadoPagoConnect } from './MercadoPagoConnect';
import { Consejos } from './Consejos';
import { Skeleton } from '@/components/ui';

export function MozoDashboard() {
  const t = useTranslations('dashboard.mozo');
  const { user } = useUser();

  // Get user's CUIT from user metadata or mock it
  const userCuit = user?.publicMetadata?.cuit as string | undefined;

  const { data: weeklyData, isLoading } = trpc.dashboard.getMozoWeeklyData.useQuery(
    { cuit: userCuit },
    {
      staleTime: 30 * 1000,
    }
  );

  const groupedPayments = weeklyData?.groupedPayments || {};
  const totalPayments = weeklyData?.totalPayments || 0;
  const totalPropinas = weeklyData?.totalPropinas || 0;
  const totalPendiente = weeklyData?.totalPendiente || 0;
  const totalTransferido = weeklyData?.totalTransferido || 0;

  // Mock MP connection status - in real app, this would come from user data
  const isMercadoPagoConnected = false; // user?.publicMetadata?.vinculado_mp as boolean | undefined;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pt-3 pb-10">
        <PageHeader
          titleKey="dashboard.mozo.hello"
          tooltipKey="dashboard.mozo.pageHeaderTooltip"
        />
        <div className="w-11/12 mx-auto max-w-[600px] space-y-4">
          <Skeleton variant="rectangular" width="100%" height={200} className="rounded-lg" />
          <Skeleton variant="rectangular" width="100%" height={400} className="rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-100">
      <div className="w-full min-h-screen pt-3 pb-10">
        <PageHeader
          title={`${t('hello', { defaultValue: 'Hello' })}${user?.firstName ? `, ${user.firstName}` : ''}`}
          tooltipKey="dashboard.mozo.pageHeaderTooltip"
        />

        <PaymentsSummary
          totalPayments={totalPayments}
          totalPropinas={totalPropinas}
          totalPendiente={totalPendiente}
          totalTransferido={totalTransferido}
        />

        {Object.entries(groupedPayments).length > 0 && (
          <div className="text-center mt-3">
            <h2 className="text-white font-semibold">
              {t('accountStatus', { defaultValue: 'Account Status' })}
            </h2>
          </div>
        )}

        <div className="w-11/12 pt-5 mt-2 px-5 pb-5 min-h-full mx-auto bg-white shadow-lg shadow-gray-250 rounded-lg max-w-[600px]">
          {!isMercadoPagoConnected ? (
            <MercadoPagoConnect />
          ) : Object.entries(groupedPayments).length === 0 ? (
            <div className="text-center py-8">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  {t('noTipsThisWeek', { defaultValue: 'No tips this week' })}
                </p>
                <div className="mt-3 text-gray-600">
                  {t('dontDespair', { defaultValue: "Don't despair! Keep providing excellent service." })}{' '}
                  <Consejos />
                </div>
              </div>
            </div>
          ) : (
            <PaymentsList groupedPayments={groupedPayments} />
          )}
        </div>
      </div>
    </div>
  );
}

