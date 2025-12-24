'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { MoreVertical, Phone, Mail, User, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Employee {
  id: string;
  nombre: string;
  telefono?: string;
  email?: string;
  rol: string;
  foto?: string | null;
  cuit: string;
  alias?: string;
  vinculado_mp?: boolean;
  has_link_to_mp?: boolean;
}

interface Role {
  id: string;
  name: string;
  color: string;
  percentage: number;
}

interface EmployeeCardProps {
  employee: Employee;
  backendRoles: Role[];
  roleNames: string[];
  menuOpen: { type: string | null; id: string | null };
  onMenuOpen: (type: string | null, id: string | null) => void;
  onEditEmployee: (employee: Employee) => void;
  onVincularMP: (employee: Employee) => void;
  onDeleteEmployee: (type: string, id: string) => void;
  onRoleChange: (cuit: string, newRole: string) => void;
  cardMenuRef: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export function EmployeeCard({
  employee,
  backendRoles,
  roleNames,
  menuOpen,
  onMenuOpen,
  onEditEmployee,
  onVincularMP,
  onDeleteEmployee,
  onRoleChange,
  cardMenuRef,
}: EmployeeCardProps) {
  const t = useTranslations('staff');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardMenuRef && cardMenuRef.current) {
      cardMenuRef.current[`personal${employee.id}`] = cardRef.current;
    }
  }, [employee.id, cardMenuRef]);

  const isNoRoleAssigned = employee.rol === 'Sin Rol' || employee.rol === 'Rol eliminado';
  const roleColor = backendRoles.find((r) => r.name === employee.rol)?.color;
  const isMenuOpen = menuOpen.type === 'personal' && menuOpen.id === employee.id;
  const hasMP = employee.has_link_to_mp || employee.vinculado_mp;

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-2 max-w-[260px] relative border-[#E1E1E1] border h-[400px] sm:h-auto">
      {/* Header with badges and menu */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 flex-wrap">
          <button
            type="button"
            className="px-2 py-1 text-xs border rounded-full hover:opacity-80 transition whitespace-nowrap"
            style={{
              borderColor: hasMP ? '#86cd83' : '#d2d2d2',
              color: hasMP ? '#2d6b2b' : '#878787',
              backgroundColor: hasMP ? '#f4faf2' : '#f3f3f3',
            }}
            onClick={() => onVincularMP(employee)}
          >
            {hasMP ? t('withMP', { defaultValue: 'With MP' }) : t('withoutMP', { defaultValue: 'Without MP' })}
          </button>
        </div>

        <div className="relative" ref={cardRef}>
          <button
            type="button"
            onClick={() => onMenuOpen(isMenuOpen ? null : 'personal', isMenuOpen ? null : employee.id)}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <MoreVertical size={22} className="text-gray-500" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg py-2 text-sm animate-fade-in z-50">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onMenuOpen(null, null);
                  onEditEmployee(employee);
                }}
              >
                {t('edit', { defaultValue: 'Edit' })}
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onMenuOpen(null, null);
                  onVincularMP(employee);
                }}
              >
                {t('linkMP', { defaultValue: 'Link MP' })}
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                onClick={() => {
                  onMenuOpen(null, null);
                  onDeleteEmployee('personal', employee.id);
                }}
              >
                {t('delete', { defaultValue: 'Delete' })}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center flex-1 justify-between min-h-0">
        <div className="flex flex-col items-center w-full flex-1">
          {employee.foto && employee.foto !== 'public/Tippit-logo-cuadrado-trasparente-300x300.png' ? (
            <Image
              src={employee.foto}
              alt={employee.nombre}
              width={120}
              height={120}
              className="rounded-full object-cover mb-3 mt-1"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full mb-3 mt-1 flex items-center justify-center text-white text-4xl font-bold bg-pink-500">
              {employee.nombre.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="h-6 flex items-center justify-center w-48">
            <span className="font-bold text-md text-gray-800 truncate text-center">{employee.nombre}</span>
          </div>
          <div className="flex flex-col w-full text-[#ACACAC] text-[12px] mt-3 mb-3 space-y-1 justify-center items-center flex-1">
            {employee.telefono && (
              <div className="flex items-center gap-2 truncate w-48">
                <Phone size={12} className="text-[#ACACAC] flex-shrink-0" />
                <span>{employee.telefono}</span>
              </div>
            )}
            {employee.email && (
              <div className="flex items-center gap-2 truncate w-48">
                <Mail size={12} className="text-[#ACACAC] flex-shrink-0" />
                <span>{employee.email}</span>
              </div>
            )}
            {employee.alias && (
              <div className="flex items-center gap-2 truncate w-48">
                <User size={12} className="text-[#ACACAC] flex-shrink-0" />
                <span>{employee.alias}</span>
              </div>
            )}
          </div>
        </div>
        <div className="pt-1 pb-1 w-full flex-shrink-0">
          <div className={`flex items-center mt-auto mb-1 ${isNoRoleAssigned ? 'text-red-500' : ''}`}>
            {isNoRoleAssigned ? (
              <div className="flex items-center gap-2 w-full">
                <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-500">{t('noRole', { defaultValue: 'No Role' })}</span>
              </div>
            ) : (
              <>
                <span className="text-gray-500 font-bold text-sm flex-shrink-0">{t('role', { defaultValue: 'Role' })}:</span>
                {roleColor && (
                  <div
                    className="w-2 h-2 rounded-full ml-2 my-2 flex-shrink-0"
                    style={{ backgroundColor: roleColor }}
                  />
                )}
                <select
                  value={employee.rol}
                  onChange={(e) => onRoleChange(employee.cuit, e.target.value)}
                  className="flex-1 min-w-0 ml-2 border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  {roleNames.map((roleName) => (
                    <option key={roleName} value={roleName}>
                      {roleName}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

