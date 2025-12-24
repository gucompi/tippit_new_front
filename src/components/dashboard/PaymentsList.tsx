'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Coins, Coffee, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { trpc } from '@/lib/trpc';
import { toast } from 'react-hot-toast';

interface Payment {
  id: string;
  hora_aprovacion_pago: string;
  monto: number;
  tipo: 'Deposito' | 'Transferencia';
  estado: 'pendiente' | 'aprobado' | 'transferido';
  mesa?: number;
  mozo_nombre?: string;
  mozo_cuit?: string;
  id_transaccion?: string;
  cuit_acreedor?: string;
  calificacion?: number;
}

interface PaymentsListProps {
  groupedPayments: Record<string, Payment[]>;
}

export function PaymentsList({ groupedPayments }: PaymentsListProps) {
  const t = useTranslations('dashboard.mozo');
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<Payment | null>(null);
  const [numeroOperacion, setNumeroOperacion] = useState('');
  const [apiMessage, setApiMessage] = useState('');

  const validateTransferMutation = trpc.dashboard.validateTransfer.useMutation({
    onSuccess: () => {
      setApiMessage(t('transferValidated', { defaultValue: 'Transfer validated successfully' }));
      toast.success(t('transferValidated', { defaultValue: 'Transfer validated successfully' }));
    },
    onError: () => {
      setApiMessage(t('transferValidationError', { defaultValue: 'Error validating transfer' }));
      toast.error(t('transferValidationError', { defaultValue: 'Error validating transfer' }));
    },
  });

  const openModal = (data: Payment) => {
    setModalData(data);
    setIsOpen(true);
    setNumeroOperacion('');
    setApiMessage('');
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData(null);
    setApiMessage('');
    setNumeroOperacion('');
  };

  const getAbbreviatedDay = (date: string) => {
    const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    return days[new Date(date).getDay()];
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      <>
        {getAbbreviatedDay(dateString)}{' '}
        {date
          .toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
          })
          .toUpperCase()}{' '}
        {date
          .toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
          .toUpperCase()}
      </>
    );
  };

  const handleValidateTransfer = () => {
    if (!modalData || !numeroOperacion) return;

    validateTransferMutation.mutate({
      numero_operacion: numeroOperacion,
      id_transaccion: modalData.id_transaccion || '',
      cuit_destinatario: modalData.cuit_acreedor || '',
    });
  };

  const getPaymentClassName = (payment: Payment) => {
    if (payment.tipo === 'Deposito') {
      if (payment.estado === 'pendiente') {
        return 'text-gray-400';
      }
      return 'text-green-700';
    }

    if (payment.tipo === 'Transferencia') {
      return 'text-red-500';
    }

    return 'text-green-700';
  };

  const getPaymentIcon = (payment: Payment) => {
    if (payment.tipo === 'Deposito') {
      if (payment.estado === 'pendiente') {
        return <Clock size={20} className="text-gray-400" />;
      }
      return <CheckCircle size={20} className="text-green-700" />;
    }

    if (payment.tipo === 'Transferencia') {
      return <XCircle size={20} className="text-red-500" />;
    }

    return <Coins size={20} className="text-green-700" />;
  };

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedPayments)
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([date, payments]) => (
            <div key={date} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {formatDateTime(date)}
              </h3>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => payment.tipo === 'Transferencia' && openModal(payment)}
                  >
                    <div className="flex-shrink-0">{getPaymentIcon(payment)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {payment.mesa && (
                          <div className="relative">
                            <Coffee size={32} className="text-pink-500" />
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-mono">
                              {payment.mesa}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className={`font-semibold ${getPaymentClassName(payment)}`}>
                            {payment.tipo === 'Deposito'
                              ? t('accreditedTip', { defaultValue: 'Accredited Tip' })
                              : t('transfer', { defaultValue: 'Transfer' })}
                          </div>
                          {payment.mozo_nombre && (
                            <div className="text-sm text-gray-600">{payment.mozo_nombre}</div>
                          )}
                          {payment.calificacion !== undefined && (
                            <div className="flex gap-0.5 mt-1">
                              {Array.from({ length: 5 }, (_, index) => (
                                <span
                                  key={index}
                                  className={`text-sm ${
                                    index < payment.calificacion
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getPaymentClassName(payment)}`}>
                        {payment.tipo === 'Transferencia' ? '-' : '+'}${payment.monto.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(payment.hora_aprovacion_pago).toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {isOpen && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              {t('validateTransfer', { defaultValue: 'Validate Transfer' })}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('operationNumber', { defaultValue: 'Operation Number' })}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={numeroOperacion}
                  onChange={(e) => setNumeroOperacion(e.target.value)}
                  placeholder={t('enterOperationNumber', { defaultValue: 'Enter operation number' })}
                />
              </div>
              {apiMessage && (
                <div
                  className={`p-3 rounded-lg ${
                    apiMessage.includes('success')
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {apiMessage}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  onClick={closeModal}
                >
                  {t('cancel', { defaultValue: 'Cancel' })}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleValidateTransfer}
                  disabled={!numeroOperacion || validateTransferMutation.isLoading}
                >
                  {validateTransferMutation.isLoading
                    ? t('validating', { defaultValue: 'Validating...' })
                    : t('validate', { defaultValue: 'Validate' })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

