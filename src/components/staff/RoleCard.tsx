'use client';

import { useRef, useEffect } from 'react';
import { MoreVertical, QrCode, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Role {
  id: string;
  name: string;
  color: string;
  percentage: number;
}

interface RoleCardProps {
  role: Role;
  index: number;
  menuOpen: { type: string | null; id: string | null };
  onMenuOpen: (type: string | null, id: string | null) => void;
  onEditRole: (type: string, id: string, role: Role) => void;
  onDeleteRole: (type: string, id: string) => void;
  cardMenuRef: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  totalRoles: number;
  employeesCount: number;
}

export function RoleCard({
  role,
  index,
  menuOpen,
  onMenuOpen,
  onEditRole,
  onDeleteRole,
  cardMenuRef,
  totalRoles,
  employeesCount,
}: RoleCardProps) {
  const t = useTranslations('staff');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardMenuRef && cardMenuRef.current) {
      cardMenuRef.current[`rol${role.id}`] = cardRef.current;
    }
  }, [role.id, cardMenuRef]);

  const canDelete = totalRoles > 1 && employeesCount === 0;
  const isMenuOpen = menuOpen.type === 'rol' && menuOpen.id === role.id;

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-2 h-[400px] max-w-[260px] relative border-[#E1E1E1] border">
      {/* Menu */}
      <div className="absolute top-4 right-4 z-10" ref={cardRef}>
        <button
          type="button"
          onClick={() => onMenuOpen(isMenuOpen ? null : 'rol', isMenuOpen ? null : role.id)}
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <MoreVertical size={22} className="text-gray-500" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg py-2 text-sm animate-fade-in z-50">
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onMenuOpen(null, null);
                onEditRole('rol', role.id, role);
              }}
            >
              {t('edit', { defaultValue: 'Edit' })}
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => {
                onMenuOpen(null, null);
                // TODO: Implement QR generation
              }}
            >
              <QrCode size={16} className="mr-2" />
              {t('qrOnboarding', { defaultValue: 'QR Onboarding' })}
            </button>
            <button
              type="button"
              className={`w-full text-left px-4 py-2 ${
                canDelete ? 'text-red-500 hover:bg-red-50 cursor-pointer' : 'text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => canDelete && onDeleteRole('rol', role.id)}
              disabled={!canDelete}
            >
              {t('delete', { defaultValue: 'Delete' })}
            </button>
          </div>
        )}
      </div>

      {/* Role number */}
      <div
        className="absolute top-4 left-4 px-3 py-1 rounded-full border flex items-center justify-center"
        style={{
          borderColor: '#FF4B9F',
          backgroundColor: '#FF4B9F1A',
          color: '#930045',
        }}
      >
        <span className="font-bold text-xs">#{String(index + 1).padStart(3, '0')}</span>
      </div>

      <div className="flex flex-col items-center pt-4">
        <div
          className="w-[120px] h-[120px] rounded-full flex items-center justify-center mt-5 mb-4 text-4xl text-white"
          style={{ backgroundColor: role.color }}
        >
          <span className="text-2xl font-bold">{(role.name || '?').charAt(0).toUpperCase()}</span>
        </div>
        <span className="font-bold text-m text-gray-800">{role.name}</span>

        {/* Employees count */}
        <div className="mt-2 text-xs text-center text-gray-600 h-6 flex items-center justify-center">
          {employeesCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full border border-[#AEE8F7] text-[#5991CE] bg-[#F2F9FF]">
              <Users size={12} className="mr-1" />
              {employeesCount} {t('employees', { defaultValue: 'employees' })}
            </span>
          )}
        </div>

        <div className="flex items-center justify-center mt-4">
          <span className="bg-pink-500 text-white px-6 py-1 rounded-full mt-[50px]">{role.percentage}%</span>
        </div>
      </div>
    </div>
  );
}

