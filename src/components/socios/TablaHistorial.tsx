'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Tip {
  id: string;
  date: string;
  amount: number;
  waiter_name: string;
  waiter_cuit: string;
  payment_method: string;
  rating: number;
}

interface TablaHistorialProps {
  data?: Tip[];
  total?: number;
  getTips?: (page: number) => void;
  isFiltered?: boolean;
  isComparisonMode?: boolean;
}

export function TablaHistorial({
  data = [],
  total = 0,
  getTips,
  isFiltered = false,
  isComparisonMode = false,
}: TablaHistorialProps) {
  const t = useTranslations('socios');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      if (getTips) {
        getTips(page);
      }
    },
    [getTips]
  );

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1]">
      <h3 className="text-lg font-semibold mb-4">
        {t('tipsHistory', { defaultValue: 'Tips History' })}
      </h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-400">
          {t('noDataAvailable', { defaultValue: 'No data available' })}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Waiter</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody>
                {data.map((tip) => (
                  <tr key={tip.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(tip.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{tip.waiter_name}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                      ${tip.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 capitalize">{tip.payment_method}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {tip.rating.toFixed(1)} ⭐
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                {t('previous', { defaultValue: 'Previous' })}
              </button>
              <span className="text-sm text-gray-600">
                {t('page', { defaultValue: 'Page' })} {currentPage} {t('of', { defaultValue: 'of' })} {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {t('next', { defaultValue: 'Next' })}
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

