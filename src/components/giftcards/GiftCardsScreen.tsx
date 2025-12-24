'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Filter, Gift, Users, BarChart3, Megaphone, Plus, ChevronDown } from 'lucide-react';
import { tokens } from '@/styles/tokens';
import { trpc } from '@/lib/trpc';
import { PageHeader } from '@/components/business/PageHeader';
import { StatCard } from '@/components/business/StatCard';
import { GiftCardGrid } from './GiftCardGrid';
import { Skeleton } from '@/components/ui';

export function GiftCardsScreen() {
  const t = useTranslations('giftCards');
  const [activeTab, setActiveTab] = useState('giftCards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Debug: Check if translations are available
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    try {
      const tabsGiftCards = t('tabs.giftCards');
      const clientsTableSearch = t('clientsTable.searchPlaceholder');
      if (tabsGiftCards.includes('giftCards.') || clientsTableSearch.includes('giftCards.')) {
        console.warn('[GiftCardsScreen] Translation keys not found, using raw keys');
      }
    } catch (e) {
      // Ignore
    }
  }

  // Get gift cards
  const { data: giftCards = [], isLoading: isLoadingGiftCards, refetch } = trpc.giftcards.getGiftCards.useQuery(
    undefined,
    {
      staleTime: 30 * 1000,
    }
  );

  // Get stats
  const { data: stats } = trpc.giftcards.getStats.useQuery(undefined, {
    staleTime: 60 * 1000,
  });

  // Get clients
  const { data: clientsData } = trpc.giftcards.getClients.useQuery(
    {
      page: 1,
      limit: 100,
      search: searchTerm || undefined,
      sortBy: 'email',
      sortOrder: 1,
    },
    {
      enabled: activeTab === 'clients',
      staleTime: 30 * 1000,
    }
  );

  const formatGiftCardDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatMoney = (money: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(money);
  };

  const filteredGiftCards = useMemo(() => {
    const today = new Date();
    return giftCards.filter((card) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        card.code_used.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.name?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (!filterStatus) return true;

      const expirationDate = new Date(card.expiration_date);
      const isExpired = expirationDate < today;
      const isUsed = card.used === true;

      switch (filterStatus) {
        case 'vigentes':
          return !isUsed && !isExpired;
        case 'vencidas':
          return !isUsed && isExpired;
        case 'usadas':
          return isUsed;
        case 'no-usadas':
          return !isUsed;
        default:
          return true;
      }
    });
  }, [giftCards, searchTerm, filterStatus]);

  const tabs = [
    { id: 'giftCards', label: t('tabs.giftCards', { defaultValue: 'Gift Cards' }), icon: Gift },
    { id: 'clients', label: t('tabs.clients', { defaultValue: 'Clients' }), icon: Users },
    { id: 'statistics', label: t('tabs.statistics', { defaultValue: 'Statistics' }), icon: BarChart3 },
    { id: 'campaigns', label: t('tabs.campaigns', { defaultValue: 'Campaigns' }), icon: Megaphone },
  ];

  const handleCreate = () => {
    // TODO: Open create modal
    console.log('Create gift card');
  };

  const handleValidate = () => {
    // TODO: Open validate modal
    console.log('Validate gift card');
  };

  return (
    <div className="flex-1 w-full">
      <PageHeader
        titleKey="giftCards.mainTitle"
        tooltipKey="giftCards.pageHeaderTooltip"
        onRefresh={activeTab === 'giftCards' ? () => refetch() : undefined}
        isRefreshing={false}
      />

      {/* Gift Cards Tab Controls */}
      {activeTab === 'giftCards' && (
        <div className="w-[calc(100%-30px)] mx-[18px] bg-white rounded-lg border border-gray-200 pb-3 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-gray-800">
                <span className="mr-2" style={{ color: tokens.colors.primary }}>
                  {giftCards.length}
                </span>{' '}
                {t('giftCards')}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={t('clientsTable.searchPlaceholder', { defaultValue: 'Search...' })}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="relative">
                <select
                  className="w-full appearance-none flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 pr-8 cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">{t('filterBy', { defaultValue: 'Filter by' })}</option>
                  <option value="vigentes">{t('active')}</option>
                  <option value="vencidas">{t('expired')}</option>
                  <option value="usadas">{t('used')}</option>
                  <option value="no-usadas">Not Used</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
              <button
                className="flex items-center justify-center gap-1.5 w-[171px] h-[40px] bg-white border rounded-full text-sm hover:bg-pink-50 transition-colors"
                style={{
                  borderColor: tokens.colors.primary,
                  color: tokens.colors.primary,
                }}
                onClick={handleValidate}
              >
                <Gift size={18} />
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {t('validate')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex px-[24px] mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 pb-3 text-sm font-medium transition-colors focus:outline-none flex items-center gap-2 ${
                isActive
                  ? 'border-b-[3px] text-[#3D3D3D]'
                  : 'border-b border-[#D2D2D2] text-[#A3A3A3]'
              }`}
              style={isActive ? { borderBottomColor: tokens.colors.primary } : {}}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="w-[calc(100%-30px)] mx-[18px] bg-white rounded-lg border border-gray-200 p-4 mb-6">
        {activeTab === 'giftCards' && (
          <div className="mt-6">
            {isLoadingGiftCards ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">Loading gift cards...</div>
              </div>
            ) : (
              <GiftCardGrid
                giftCards={filteredGiftCards}
                onCreate={handleCreate}
                formatDate={formatGiftCardDate}
              />
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="mt-6">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder={t('clientsTable.searchPlaceholder', { defaultValue: 'Search clients...' })}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E1E1E1]">
              <table className="min-w-full text-sm rounded-2xl">
                <thead>
                  <tr className="bg-[#FAFAFA] text-left text-[#878787] tracking-wide text-xs">
                    <th className="px-4 py-3">{t('clientsTable.columns.client')}</th>
                    <th className="px-4 py-3">{t('clientsTable.columns.total')}</th>
                    <th className="px-4 py-3">{t('clientsTable.columns.used')}</th>
                    <th className="px-4 py-3">{t('clientsTable.columns.expired')}</th>
                    <th className="px-4 py-3">{t('clientsTable.columns.active')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E1E1E1] text-[#222222]">
                  {!clientsData?.clients || clientsData.clients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-[#878787]">
                        {t('clientsTable.empty')}
                      </td>
                    </tr>
                  ) : (
                    clientsData.clients.map((client: any) => {
                      const clientName =
                        client.name ||
                        client.email?.split('@')[0] ||
                        t('clientsTable.columns.client');
                      const metadata = client.metadata || {};

                      return (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{clientName}</span>
                              {(client.email || client.phone) && (
                                <span className="text-xs text-gray-500">
                                  {[client.email, client.phone].filter(Boolean).join(' · ')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">{metadata.total_giftcards || 0}</td>
                          <td className="px-4 py-3">{metadata.giftcards_used || 0}</td>
                          <td className="px-4 py-3">{metadata.giftcards_expired || 0}</td>
                          <td className="px-4 py-3">{metadata.giftcards_active || 0}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="flex flex-col gap-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard title={t('statistics.quantityGiftCards')}>
                <div className="text-2xl font-bold" style={{ color: tokens.colors.textPrimary }}>
                  {stats?.total || 0}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  <div>Active: {stats?.active || 0}</div>
                  <div>Used: {stats?.used || 0}</div>
                  <div>Expired: {stats?.expired || 0}</div>
                </div>
              </StatCard>
              <StatCard title={t('statistics.moneyInGiftCards')}>
                <div className="text-2xl font-bold" style={{ color: tokens.colors.textPrimary }}>
                  {stats ? formatMoney(stats.money) : '$0'}
                </div>
              </StatCard>
              <StatCard title={t('statistics.clientsUsingGiftCard')}>
                <div className="text-2xl font-bold" style={{ color: tokens.colors.textPrimary }}>
                  {stats?.clientsUsingGiftCards || 0}
                </div>
              </StatCard>
              <StatCard title={t('statistics.newClientsByGiftCard')}>
                <div className="text-2xl font-bold" style={{ color: tokens.colors.textPrimary }}>
                  {stats?.newClientsByGiftCard || 0}
                </div>
              </StatCard>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {t('statisticsComingSoon.title')}
              </h2>
              <p className="text-gray-500">{t('statisticsComingSoon.description')}</p>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {t('campaignsComingSoon.title')}
              </h2>
              <p className="text-gray-500">{t('campaignsComingSoon.description')}</p>
              <span className="text-sm font-medium" style={{ color: tokens.colors.primary }}>
                {t('campaignsComingSoon.cta')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

