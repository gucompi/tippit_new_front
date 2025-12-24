'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { tokens } from '@/styles/tokens';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalContent: {
    nombre: string;
    foto: string;
    cuit: string;
  } | null;
  roles: Array<{ id: string; nombre_rol: string }>;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  cuitInput: string;
  onCuitInputChange: (cuit: string) => void;
  onSearch?: () => void;
  onAdd: () => void;
  onDelete: () => void;
  errorMessage?: string;
  successMessage?: string;
  showSearch?: boolean;
}

export function ProfileModal({
  isOpen,
  onClose,
  modalContent,
  roles,
  selectedRole,
  onRoleChange,
  cuitInput,
  onCuitInputChange,
  onSearch,
  onAdd,
  onDelete,
  errorMessage,
  successMessage,
  showSearch = false,
}: ProfileModalProps) {
  const t = useTranslations('profile.staff');
  const tCommon = useTranslations('common');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-[450px] w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-4 px-4 pb-4">
          <h1 className="text-lg font-bold mb-4 text-center" style={{ color: tokens.colors.textPrimary }}>
            {t('addStaffToRestaurant')}
          </h1>

          {showSearch && !modalContent && (
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cuitInput}
                  onChange={(e) => onCuitInputChange(e.target.value)}
                  placeholder="Enter CUIT"
                  className="flex-1 border rounded px-2 py-1"
                  style={{
                    borderColor: tokens.colors.border,
                    color: tokens.colors.textInput,
                  }}
                />
                <button
                  type="button"
                  onClick={onSearch}
                  className="px-4 py-1 text-white rounded"
                  style={{ backgroundColor: tokens.colors.primary }}
                >
                  Search
                </button>
              </div>
            </div>
          )}

          {modalContent ? (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px]">
                  <Image
                    src={modalContent.foto || '/profile_he.jpg'}
                    alt={modalContent.nombre}
                    fill
                    className="object-cover rounded-full border-4"
                    style={{ borderColor: tokens.colors.primary }}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: tokens.colors.textPrimary }}>
                    {modalContent.nombre}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: tokens.colors.textMuted }}>
                    {t('cuitLabel')} {cuitInput}
                  </p>
                  <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    style={{
                      borderColor: tokens.colors.border,
                      color: tokens.colors.textInput,
                    }}
                    value={selectedRole}
                    onChange={(e) => onRoleChange(e.target.value)}
                  >
                    <option value="" disabled>
                      {t('chooseRole')}
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.nombre_rol}>
                        {role.nombre_rol}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col md:flex-row gap-2 mt-4">
                  <button
                    type="button"
                    onClick={onAdd}
                    className="w-full px-4 py-2 text-sm text-white font-semibold rounded-lg transition-all hover:scale-105"
                    style={{ backgroundColor: tokens.colors.primary }}
                  >
                    {t('add')}
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="w-full px-4 py-2 text-sm text-white font-semibold rounded-lg transition-all hover:scale-105 bg-red-500 hover:bg-red-600"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: tokens.colors.textMuted }}>
              {t('noDataAvailable')}
            </div>
          )}

          {errorMessage && (
            <p className="text-red-500 mt-4 text-center text-sm">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 mt-4 text-center text-sm">{successMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

