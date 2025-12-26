'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import {
  QrCode,
  XCircle,
  Hash,
  CreditCard,
  Plus,
  X,
  Tag,
  MoreVertical,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

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

interface QRCardProps {
  item: QRItem;
  onCardClick: (mesa: number, mozo: QRItem['mozo']) => void;
  onSelectChange: (cuit: string, mesa: number, currentCuit: string | null) => void;
  onPencilClick: (e: React.MouseEvent) => void;
  onCloseClick: (e: React.MouseEvent) => void;
  staff: Array<{ id: string; nombre: string; cuit: string; foto?: string | null }>;
  selectedCuit: string;
  setSelectedCuit: (cuit: string) => void;
  availableTags: Tag[];
  qrTags: Record<string, string[]>;
  onTagRemove: (mesa: number, tagId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, mesa: number) => void;
  onTagsClick: (mesa: number) => void;
  onGetQrImage: (mesa: number) => void;
  onOpenWhatsAppForm: (mesa: number) => void;
  onViewQR: (mesa: number) => void;
  menuOpen: { type: string | null; id: number | null };
  onMenuOpen: (type: string | null, id: number | null) => void;
  cardMenuRef: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export function QRCard({
  item,
  onCardClick,
  onSelectChange,
  onPencilClick,
  onCloseClick,
  staff,
  selectedCuit,
  setSelectedCuit,
  availableTags,
  qrTags,
  onTagRemove,
  onDragOver,
  onDrop,
  onTagsClick,
  onGetQrImage,
  onOpenWhatsAppForm,
  onViewQR,
  menuOpen,
  onMenuOpen,
  cardMenuRef,
}: QRCardProps) {
  const t = useTranslations('qrs');
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (cardMenuRef && cardMenuRef.current) {
      cardMenuRef.current[`qr${item.mesa}`] = cardRef.current;
    }
  }, [item.mesa, cardMenuRef]);

  const handleSelectOnChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setSelectedCuit(e.target.value);
    },
    [setSelectedCuit]
  );

  const handleAssignClick = useCallback(() => {
    if (selectedCuit) {
      onSelectChange(selectedCuit, item.mesa, item.mozo.cuit);
    }
  }, [selectedCuit, onSelectChange, item.mesa, item.mozo.cuit]);

  const handleImageError = () => {
    setImageError(true);
  };

  const mesaKey = String(item.mesa);
  const cardTags = qrTags[mesaKey] || [];
  const cardTagsData = cardTags
    .map((tagId) => availableTags.find((tag) => tag.id === tagId))
    .filter(Boolean) as Tag[];

  const isMenuOpen = menuOpen.type === 'qr' && menuOpen.id === item.mesa;

  return (
    <div
      ref={cardRef}
      data-id={item.mesa}
      className={`card relative bg-white rounded-2xl p-5 flex flex-col gap-2 max-w-[260px] w-full sm:w-[260px] border-[#E1E1E1] border h-[420px] sm:h-auto transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer select-none ${
        item.mozo.cuit === null ? 'grayscale' : ''
      }`}
      onClick={() => onCardClick(item.mesa, item.mozo)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, item.mesa)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="px-3 py-1 rounded-full border flex items-center justify-center"
            style={{
              borderColor: '#FF4B9F',
              backgroundColor: '#FF4B9F1A',
              color: '#930045',
            }}
          >
            <span className="font-bold text-xs">#{item.mesa}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 text-xs border rounded-full hover:opacity-80 transition whitespace-nowrap"
            style={{
              borderColor: !item.mozo.fin_atencion ? '#86cd83' : '#fc7980',
              color: !item.mozo.fin_atencion ? '#2d6b2b' : '#a3030a',
              backgroundColor: !item.mozo.fin_atencion ? '#f4faf2' : '#ffebeb',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {!item.mozo.fin_atencion ? t('active', { defaultValue: 'Active' }) : t('inactive', { defaultValue: 'Inactive' })}
          </button>

          <div className="relative" ref={cardRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMenuOpen(isMenuOpen ? null : 'qr', isMenuOpen ? null : item.mesa);
              }}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <MoreVertical size={22} className="text-gray-500" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg py-2 text-sm animate-fade-in z-50">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMenuOpen(null, null);
                    onPencilClick(e);
                  }}
                >
                  {t('assignQR', { defaultValue: 'Assign QR' })}
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMenuOpen(null, null);
                    onViewQR(item.mesa);
                  }}
                >
                  {t('viewQR', { defaultValue: 'View QR' })}
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenWhatsAppForm(item.mesa);
                  }}
                >
                  {t('request3DPrint', { defaultValue: 'Request 3D Print' })}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center flex-1 justify-between min-h-0">
        <div className="flex flex-col items-center w-full flex-1 min-h-0">
          {!imageError && item.mozo.foto ? (
            <Image
              src={item.mozo.foto}
              alt={item.mozo.nombre}
              width={120}
              height={120}
              className={`rounded-full object-cover mb-3 mt-1 ${
                item.mozo.fin_atencion ? 'grayscale' : ''
              }`}
              onError={handleImageError}
            />
          ) : (
            <div
              className={`w-[120px] h-[120px] rounded-full mb-3 mt-1 flex items-center justify-center text-white text-4xl font-bold ${
                item.mozo.fin_atencion ? 'grayscale' : ''
              }`}
              style={{
                backgroundColor: !item.mozo.fin_atencion ? '#86cd83' : '#fc7980',
              }}
            >
              {item.mozo.nombre ? item.mozo.nombre.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <span className="font-bold text-md text-gray-800 truncate text-center capitalize w-48">
            {item.mozo.nombre || t('unassigned', { defaultValue: 'Unassigned' })}
          </span>

          <div className="flex flex-col w-full text-[#ACACAC] text-[12px] mt-3 mb-3 space-y-1 justify-center items-center flex-1">
            <div className="flex items-center gap-2 truncate w-48">
              <Hash size={12} className="text-[#ACACAC] flex-shrink-0" />
              <span>{t('table', { defaultValue: 'Table' })}: {item.mesa}</span>
            </div>
            {item.mozo.cuit && (
              <div className="flex items-center gap-2 truncate w-48">
                <CreditCard size={12} className="text-[#ACACAC] flex-shrink-0" />
                <span>{t('cuit', { defaultValue: 'CUIT' })}: {item.mozo.cuit}</span>
              </div>
            )}

            <div className="w-full mt-2">
              <div className="flex items-center gap-1 mb-2">
                <Tag size={12} className="text-[#ACACAC]" />
                <span className="text-[10px] text-[#ACACAC]">{t('tags', { defaultValue: 'Tags' })}:</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagsClick(item.mesa);
                  }}
                  className="ml-auto p-1.5 rounded-full bg-pink-500 hover:bg-pink-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110 active:scale-95"
                  title={t('manageTags', { defaultValue: 'Manage tags' })}
                >
                  <Plus size={10} className="text-white" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 min-h-[20px]">
                {cardTagsData.length > 0 ? (
                  cardTagsData.map((tag) => (
                    <div
                      key={tag.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white font-medium"
                      style={{ backgroundColor: tag.color }}
                    >
                      <span>{tag.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onTagRemove(item.mesa, tag.id);
                        }}
                        className="hover:bg-black hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#CCCCCC] italic">
                    {t('dragTagsHere', { defaultValue: 'Drag tags here or click +' })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Panel (for reassigning QR) */}
      <div
        className="details bg-pink-500 absolute top-0 left-0 right-0 bottom-0 shadow-lg rounded-2xl p-4 transform translate-x-full transition-transform duration-300 ease-in-out z-10 opacity-0"
        onClick={onCloseClick}
        style={{ transform: 'translateX(100%)', opacity: 0 }}
      >
        <h3 className="text-white mb-1">{t('reassignQR', { defaultValue: 'Reassign QR' })}</h3>

        <select
          value={selectedCuit}
          onChange={handleSelectOnChange}
          onClick={(e) => e.stopPropagation()}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        >
          <option value="">{t('selectStaff', { defaultValue: 'Choose staff' })}</option>
          {staff
            .filter((mozo) => mozo && mozo.cuit && mozo.nombre)
            .sort((a, b) => {
              const nameA = (a.nombre || '').toLowerCase();
              const nameB = (b.nombre || '').toLowerCase();
              return nameA.localeCompare(nameB);
            })
            .map((mozo, index) => (
              <option key={`${mozo.id || index}-${mozo.cuit}`} value={mozo.cuit}>
                {mozo.nombre}
              </option>
            ))}
        </select>

        <button
          type="button"
          className={`bg-white text-black px-4 py-2 rounded-md ${
            selectedCuit ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          }`}
          onClick={handleAssignClick}
          disabled={!selectedCuit}
        >
          {t('assignQR', { defaultValue: 'Assign QR' })}
        </button>

        <button
          type="button"
          className="text-sm mt-6 text-white underline w-full hover:text-gray-400 cursor-pointer bg-transparent border-none"
          onClick={onCloseClick}
        >
          <XCircle
            size={23}
            className="mx-auto text-white duration-200 opacity-70 hover:opacity-100"
          />
        </button>
      </div>
    </div>
  );
}

