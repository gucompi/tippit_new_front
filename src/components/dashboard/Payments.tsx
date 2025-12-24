'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Coffee } from 'lucide-react';

interface Payment {
  id: string;
  hora_aprovacion_pago: string;
  monto: number;
  tipo: 'Deposito' | 'Transferencia';
  estado: 'pendiente' | 'aprobado' | 'transferido';
  mesa?: number;
  mozo_nombre?: string;
  mozo_cuit?: string;
  calificacion?: number;
  Mozo?: {
    nombre?: string;
    apellido?: string;
    photo?: string;
  };
  Restaurante?: string;
}

interface PaymentsProps {
  paymentIndex: number;
  activeButton: 'Tiempo' | 'Mesa' | 'Mozo';
  activeSubButton: 'UltimaSemana' | 'UltimaMes' | 'UltimoAnio';
  mesaDetails?: Record<string, any>;
  payment: Payment;
  cantPayments: number;
  pos: string;
}

export function Payments({
  paymentIndex,
  activeButton,
  activeSubButton,
  mesaDetails,
  payment,
  cantPayments,
  pos,
}: PaymentsProps) {
  const t = useTranslations('dashboard.payments');

  const mozoName = payment.Mozo
    ? `${payment.Mozo.nombre || ''} ${payment.Mozo.apellido || ''}`.trim()
    : payment.mozo_nombre || 'Unknown';
  const mozoPhoto = payment.Mozo?.photo || '/profile_he.jpg';

  return (
    <div
      className={`flex flex-row items-center text-sm ${
        activeButton !== 'Mesa' ? 'py-5' : 'py-3'
      } ${paymentIndex !== cantPayments - 1 ? 'border-b border-gray-200' : ''}`}
    >
      {activeButton !== 'Mesa' && (
        <div className="xs:w-1/6 md:w-1/6 relative md:transform md:scale-[1.25]">
          <div className="absolute w-full h-full flex items-end justify-center text-lg text-white font-mono ml-[-3px] z-10">
            {payment.mesa || '?'}
          </div>
          <Coffee size={42} className="text-pink-500 mx-auto" />
        </div>
      )}

      <div className="w-20">
        <Image
          src={activeButton === 'Mesa' && mesaDetails?.[pos]?.photo ? mesaDetails[pos].photo : mozoPhoto}
          alt={mozoName}
          width={48}
          height={48}
          className="rounded-full shadow-md border-2 border-pink-500 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/Tippit-logo-cuadrado-trasparente-300x300.png';
          }}
        />
      </div>
      <div className="w-60 text-gray-600 pl-3">
        {payment.estado === 'aprobado' ? (
          <div className="text-green-600">
            {t('accreditedTip', { defaultValue: 'Accredited Tip' })} ✓
          </div>
        ) : (
          <div>{t('pendingTipLabel', { defaultValue: 'Pending Tip' })}</div>
        )}

        <div className="text-md text-gray-500 capitalize">{mozoName}</div>
        {payment.Restaurante && (
          <div className="text-xs text-gray-400 capitalize">{payment.Restaurante}</div>
        )}

        {activeSubButton === 'UltimoAnio' && (
          <div className="text-xs text-gray-400">
            {new Date(payment.hora_aprovacion_pago).toLocaleDateString('es-AR', {
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}

        {payment.calificacion !== undefined && (
          <div className="flex mt-1">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={`text-sm ${
                  index < payment.calificacion! ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="w-1/2 md:w-full md:text-xl text-right pr-5 bg-transparent">
        <span className="text-green-700">+${payment.monto.toFixed(2)}</span>
        <br />
        <span className="text-gray-400 text-xs">
          {new Date(payment.hora_aprovacion_pago).toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </span>
      </div>
    </div>
  );
}

