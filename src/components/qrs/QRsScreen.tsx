'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { trpc } from '@/lib/trpc';
import { PageHeader } from '@/components/business/PageHeader';
import { AddCard } from './AddCard';
import { QRCard } from './QRCard';
import { FiltersAndTabs } from './FiltersAndTabs';
import { TagsPanel } from './TagsPanel';
import { CreateQRModal } from './CreateQRModal';
import { ViewQRModal } from './ViewQRModal';
import { WhatsAppQRForm } from './WhatsAppQRForm';
import { UnprintedQRsModal } from './UnprintedQRsModal';
import { Skeleton } from '@/components/ui';
import { toast } from 'react-hot-toast';

interface QRItem {
  mesa: number;
  mozo: {
    nombre: string;
    cuit: string | null;
    foto: string | null;
    fin_atencion: boolean;
    token_padre?: string;
    token_db?: string;
  };
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

export function QRsScreen() {
  const t = useTranslations('qrs');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCuit, setSelectedCuit] = useState('');
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  const [selectedQrForTags, setSelectedQrForTags] = useState<number | null>(null);
  const [draggedTag, setDraggedTag] = useState<Tag | null>(null);
  const [showCreateTagForm, setShowCreateTagForm] = useState(false);
  const [newTagForm, setNewTagForm] = useState({ name: '', color: '#FF6B6B' });
  const [showCreateQRModal, setShowCreateQRModal] = useState(false);
  const [showQRViewModal, setShowQRViewModal] = useState(false);
  const [selectedQRForView, setSelectedQRForView] = useState<QRItem | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [selectedQRForWhatsApp, setSelectedQRForWhatsApp] = useState<number | null>(null);
  const [showUnprintedModal, setShowUnprintedModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState<{ type: string | null; id: number | null }>({
    type: null,
    id: null,
  });
  const cardMenuRef = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch QRs
  const { data: qrsData, isLoading: isLoadingQRs, refetch: refetchQRs } = trpc.qrs.getQRs.useQuery(undefined, {
    staleTime: 30 * 1000,
  });

  // Fetch Tags
  const { data: tagsData, refetch: refetchTags } = trpc.qrs.getTags.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Staff
  const { data: staffData } = trpc.qrs.getStaff.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Unprinted QRs
  const { data: unprintedData, refetch: refetchUnprinted } = trpc.qrs.getUnprintedQRs.useQuery(undefined, {
    staleTime: 30 * 1000,
  });

  // Mutations
  const createQRMutation = trpc.qrs.createQR.useMutation({
    onSuccess: () => {
      toast.success(t('qrCreated', { defaultValue: 'QR created successfully' }));
      refetchQRs();
      setShowCreateQRModal(false);
    },
    onError: (error) => {
      toast.error(t('qrCreateError', { defaultValue: 'Error creating QR' }));
      console.error('Error creating QR:', error);
    },
  });

  const assignQRMutation = trpc.qrs.assignQR.useMutation({
    onSuccess: () => {
      toast.success(t('qrAssigned', { defaultValue: 'QR assigned successfully' }));
      refetchQRs();
      setSelectedCuit('');
    },
    onError: (error) => {
      toast.error(t('qrAssignError', { defaultValue: 'Error assigning QR' }));
      console.error('Error assigning QR:', error);
    },
  });

  const createTagMutation = trpc.qrs.createTag.useMutation({
    onSuccess: () => {
      toast.success(t('tagCreated', { defaultValue: 'Tag created successfully' }));
      refetchTags();
      setNewTagForm({ name: '', color: '#FF6B6B' });
      setShowCreateTagForm(false);
    },
    onError: (error) => {
      toast.error(t('tagCreateError', { defaultValue: 'Error creating tag' }));
      console.error('Error creating tag:', error);
    },
  });

  const assignTagMutation = trpc.qrs.assignTag.useMutation({
    onSuccess: () => {
      refetchQRs();
      refetchTags();
    },
    onError: (error) => {
      toast.error(t('tagAssignError', { defaultValue: 'Error assigning tag' }));
      console.error('Error assigning tag:', error);
    },
  });

  const removeTagMutation = trpc.qrs.removeTag.useMutation({
    onSuccess: () => {
      refetchQRs();
      refetchTags();
    },
    onError: (error) => {
      toast.error(t('tagRemoveError', { defaultValue: 'Error removing tag' }));
      console.error('Error removing tag:', error);
    },
  });

  const sendQRViaWhatsAppMutation = trpc.qrs.sendQRViaWhatsApp.useMutation({
    onSuccess: () => {
      toast.success(t('qrSent', { defaultValue: 'QR sent via WhatsApp' }));
      setShowWhatsAppForm(false);
      setSelectedQRForWhatsApp(null);
    },
    onError: (error) => {
      toast.error(t('qrSendError', { defaultValue: 'Error sending QR' }));
      console.error('Error sending QR:', error);
    },
  });

  const qrs = qrsData?.items || [];
  const availableTags = tagsData?.tags || [];
  const staff = staffData?.staff || [];
  const unprintedMesas = unprintedData?.mesas || [];

  // Build qrTags mapping from qrs
  const qrTags = useMemo(() => {
    const mapping: Record<string, string[]> = {};
    // In a real app, this would come from the API
    // For now, we'll use empty mapping
    return mapping;
  }, [qrs]);

  const orderOptions = useMemo(
    () => [
      t('tag', { defaultValue: 'Tag' }),
      t('table', { defaultValue: 'Table' }),
      t('cuit', { defaultValue: 'CUIT' }),
      t('assignmentStatus', { defaultValue: 'Assignment Status' }),
      t('active', { defaultValue: 'Active' }),
    ],
    [t]
  );

  const handleOrderChange = useCallback(
    (selectedOrder: string) => {
      if (selectedOrder === order) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setOrder(selectedOrder);
        setSortDirection('asc');
      }
    },
    [order]
  );

  const filteredQRs = useMemo(() => {
    let result = qrs;

    // Search filter
    if (searchTerm && searchTerm.length >= 3) {
      const searchLowerCase = searchTerm.toLowerCase();
      result = result.filter((qr) => {
        const mesaKey = String(qr.mesa);
        const mesaTags = qrTags[mesaKey] || [];
        const tagNames = mesaTags
          .map((tagId) => availableTags.find((tag) => tag.id === tagId)?.name)
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return (
          tagNames.includes(searchLowerCase) ||
          qr.mozo.nombre?.toLowerCase().includes(searchLowerCase) ||
          qr.mesa?.toString().includes(searchLowerCase) ||
          qr.mozo.cuit?.toString().includes(searchLowerCase)
        );
      });
    }

    // Sort
    if (order && result.length > 0) {
      result = [...result].sort((a, b) => {
        let comparison = 0;

        if (order === t('table', { defaultValue: 'Table' })) {
          comparison = (Number(a.mesa) || 0) - (Number(b.mesa) || 0);
        } else if (order === t('cuit', { defaultValue: 'CUIT' })) {
          comparison = (a.mozo.cuit || '').localeCompare(b.mozo.cuit || '', 'es', {
            numeric: true,
          });
        } else if (order === t('assignmentStatus', { defaultValue: 'Assignment Status' })) {
          const aAssigned = a.mozo.cuit ? 1 : 0;
          const bAssigned = b.mozo.cuit ? 1 : 0;
          comparison = aAssigned - bAssigned;
        } else if (order === t('active', { defaultValue: 'Active' })) {
          comparison = Number(a.mozo.fin_atencion) - Number(b.mozo.fin_atencion);
        } else if (order === t('tag', { defaultValue: 'Tag' })) {
          const mesaKeyA = String(a.mesa);
          const mesaKeyB = String(b.mesa);
          const tagsA = qrTags[mesaKeyA] || [];
          const tagsB = qrTags[mesaKeyB] || [];
          comparison = tagsA.length - tagsB.length;
        }

        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [qrs, qrTags, availableTags, searchTerm, order, sortDirection, t]);

  const handleOpenCreateQRModal = useCallback(() => {
    setShowCreateQRModal(true);
  }, []);

  const handleCloseCreateQRModal = useCallback(() => {
    setShowCreateQRModal(false);
  }, []);

  const handleCreateQR = useCallback(() => {
    createQRMutation.mutate({});
  }, [createQRMutation]);

  const handleSelectChange = useCallback(
    (cuit: string, mesa: number, currentCuit: string | null) => {
      assignQRMutation.mutate({ mesa, cuit });
    },
    [assignQRMutation]
  );

  const handleCardClick = useCallback(
    (mesa: number, mozo: QRItem['mozo']) => {
      // Toggle active/inactive
      // In a real app, this would call an API
      refetchQRs();
    },
    [refetchQRs]
  );

  const handlePencilClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const card = e.currentTarget.closest('.card');
    const details = card?.querySelector('.details') as HTMLElement;
    if (details) {
      details.style.transform = 'translateX(0)';
      details.style.opacity = '1';
    }
  }, []);

  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const card = e.currentTarget.closest('.card');
    const details = card?.querySelector('.details') as HTMLElement;
    if (details) {
      details.style.transform = 'translateX(100%)';
      details.style.opacity = '0';
    }
  }, []);

  const handleTagsClick = useCallback((mesa: number) => {
    setSelectedQrForTags(mesa);
    setShowTagsPanel(true);
  }, []);

  const handleMenuOpen = useCallback((type: string | null, id: number | null) => {
    setMenuOpen({ type, id });
  }, []);

  const handleAddTag = useCallback(
    (mesa: number, tagId: string) => {
      assignTagMutation.mutate({ mesa, tagId });
    },
    [assignTagMutation]
  );

  const handleRemoveTag = useCallback(
    (mesa: number, tagId: string) => {
      removeTagMutation.mutate({ mesa, tagId });
    },
    [removeTagMutation]
  );

  const handleCreateAndAssignTag = useCallback(
    (mesa: number, name: string, color: string) => {
      createTagMutation.mutate(
        { name, color },
        {
          onSuccess: (data) => {
            if (data.tag) {
              assignTagMutation.mutate({ mesa, tagId: data.tag.id });
            }
          },
        }
      );
    },
    [createTagMutation, assignTagMutation]
  );

  const handleDragStart = useCallback((e: React.DragEvent, tag: Tag) => {
    setDraggedTag(tag);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, mesa: number) => {
      e.preventDefault();
      if (draggedTag) {
        handleAddTag(mesa, draggedTag.id);
      }
      setDraggedTag(null);
    },
    [draggedTag, handleAddTag]
  );

  const handleGetQrImage = useCallback(async (mesa: number) => {
    try {
      // Use fetch directly since this is a download action
      const response = await fetch(`/api/trpc/qrs.getQRImage?input=${encodeURIComponent(JSON.stringify({ json: { mesa } }))}`);
      const data = await response.json();
      const imageUrl = data?.result?.data?.json?.imageUrl;
      if (imageUrl) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `qr_mesa_${mesa}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t('qrDownloaded', { defaultValue: 'QR downloaded successfully' }));
      }
    } catch (error) {
      console.error('Error getting QR image:', error);
      toast.error(t('qrDownloadError', { defaultValue: 'Error downloading QR' }));
    }
  }, [t]);

  const handleViewQR = useCallback(async (mesa: number) => {
    const qrItem = qrs.find((item) => String(item.mesa) === String(mesa));
    if (!qrItem) return;

    setSelectedQRForView(qrItem);
    setShowQRViewModal(true);

    try {
      const response = await fetch(`/api/trpc/qrs.getQRImage?input=${encodeURIComponent(JSON.stringify({ json: { mesa } }))}`);
      const data = await response.json();
      const imageUrl = data?.result?.data?.json?.imageUrl;
      if (imageUrl) {
        setQrImageUrl(imageUrl);
      }
    } catch (error) {
      console.error('Error loading QR image:', error);
      toast.error(t('qrLoadError', { defaultValue: 'Error loading QR' }));
    }
  }, [qrs, t]);

  const handleCloseQRViewModal = useCallback(() => {
    setShowQRViewModal(false);
    setSelectedQRForView(null);
    if (qrImageUrl) {
      URL.revokeObjectURL(qrImageUrl);
      setQrImageUrl(null);
    }
  }, [qrImageUrl]);

  const handleOpenWhatsAppForm = useCallback((mesa: number) => {
    setSelectedQRForWhatsApp(mesa);
    setShowWhatsAppForm(true);
  }, []);

  const handleCloseWhatsAppForm = useCallback(() => {
    setShowWhatsAppForm(false);
    setSelectedQRForWhatsApp(null);
  }, []);

  const handleSendQrViaWhatsApp = useCallback(
    (phoneNumber: string, mesa: number) => {
      sendQRViaWhatsAppMutation.mutate({ mesa, phoneNumber });
    },
    [sendQRViaWhatsAppMutation]
  );

  const handleOpenUnprintedModal = useCallback(() => {
    setShowUnprintedModal(true);
  }, []);

  const handleCloseUnprintedModal = useCallback(() => {
    setShowUnprintedModal(false);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen.type && cardMenuRef.current) {
        const menuKey = menuOpen.type + menuOpen.id;
        const cardElement = cardMenuRef.current[menuKey];
        if (cardElement && !cardElement.contains(event.target as Node)) {
          setMenuOpen({ type: null, id: null });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <main className="flex-1">
      <PageHeader
        titleKey="qrs.title"
        tooltipKey="qrs.pageHeaderTooltip"
        showNotificationIcon={true}
      />

      <FiltersAndTabs
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        order={order}
        setOrder={handleOrderChange}
        orderOptions={orderOptions}
        sortDirection={sortDirection}
        filteredItems={filteredQRs}
        totalItems={qrs.length}
        extraActions={
          <button
            type="button"
            onClick={handleOpenUnprintedModal}
            disabled={unprintedMesas.length === 0}
            className={`px-3 py-2 rounded-full border flex items-center gap-2 text-sm ${
              unprintedMesas.length > 0
                ? 'border-pink-400 text-pink-700'
                : 'border-gray-300 text-gray-400 bg-gray-50'
            }`}
          >
            <span>{t('unprintedQRs', { defaultValue: "QR's not printed" })}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                unprintedMesas.length > 0 ? 'bg-pink-500 text-white' : 'bg-gray-300 text-white'
              }`}
            >
              {unprintedMesas.length}
            </span>
          </button>
        }
      />

      <div className="w-[calc(100%-36px)] bg-white rounded-lg border border-gray-200 p-4 mb-6 mx-[18px] overflow-x-hidden">
        <p className="text-md md:text-lg">{t('description', { defaultValue: 'From here, you can activate and deactivate the QRs for each of your staff.' })}</p>
        <hr className="my-5" style={{ width: '100%' }} />
        <div>
          <div className="flex flex-wrap gap-4 justify-center">
            <AddCard
              title={t('addNewQR', { defaultValue: 'Add New QR' })}
              description={t('addNewQRDescription', { defaultValue: 'Create a new QR code for a table' })}
              buttonText={t('createQR', { defaultValue: 'Create QR' })}
              onClick={handleOpenCreateQRModal}
              icon={Plus}
            />
            {isLoadingQRs ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="rectangular" width={260} height={420} className="rounded-2xl" />
                ))}
              </div>
            ) : (
              filteredQRs.map((item) => (
                <QRCard
                  key={item.mesa}
                  item={item}
                  onCardClick={handleCardClick}
                  onSelectChange={handleSelectChange}
                  onPencilClick={handlePencilClick}
                  onCloseClick={handleCloseClick}
                  staff={staff}
                  selectedCuit={selectedCuit}
                  setSelectedCuit={setSelectedCuit}
                  availableTags={availableTags}
                  qrTags={qrTags}
                  onTagRemove={handleRemoveTag}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onTagsClick={handleTagsClick}
                  onGetQrImage={handleGetQrImage}
                  onOpenWhatsAppForm={handleOpenWhatsAppForm}
                  onViewQR={handleViewQR}
                  menuOpen={menuOpen}
                  onMenuOpen={handleMenuOpen}
                  cardMenuRef={cardMenuRef}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <TagsPanel
        isOpen={showTagsPanel}
        onClose={() => {
          setShowTagsPanel(false);
          setSelectedQrForTags(null);
        }}
        selectedQrMesa={selectedQrForTags || 0}
        availableTags={availableTags}
        qrTags={qrTags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onCreateAndAssignTag={handleCreateAndAssignTag}
        isCreatingTag={createTagMutation.isLoading}
        draggedTag={draggedTag}
        onDragStart={handleDragStart}
      />

      <CreateQRModal
        isOpen={showCreateQRModal}
        onClose={handleCloseCreateQRModal}
        onCreate={handleCreateQR}
        isCreating={createQRMutation.isLoading}
      />

      <ViewQRModal
        isOpen={showQRViewModal}
        onClose={handleCloseQRViewModal}
        mesa={selectedQRForView?.mesa || null}
        qrImageUrl={qrImageUrl}
        isLoading={false}
        onDownload={() => selectedQRForView && handleGetQrImage(selectedQRForView.mesa)}
        qrUrl={
          selectedQRForView?.mozo.token_padre && selectedQRForView?.mozo.token_db
            ? `${process.env.NEXT_PUBLIC_QR_BASE_URL || ''}/tree/?token=${selectedQRForView.mozo.token_padre}&token_db=${selectedQRForView.mozo.token_db}`
            : undefined
        }
      />

      <WhatsAppQRForm
        isOpen={showWhatsAppForm}
        onClose={handleCloseWhatsAppForm}
        onSubmit={handleSendQrViaWhatsApp}
        mesa={selectedQRForWhatsApp}
        onDownloadQR={handleGetQrImage}
      />

      <UnprintedQRsModal
        isOpen={showUnprintedModal}
        onClose={handleCloseUnprintedModal}
        unprintedMesas={unprintedMesas}
        checkingUnprinted={false}
      />
    </main>
  );
}

