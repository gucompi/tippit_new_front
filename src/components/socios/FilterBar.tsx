'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';

interface Waiter {
  name: string;
  cuit: string;
}

interface FilterBarProps {
  onChangeDates: (fromDate: string, toDate: string) => void;
  filterOptionsName?: Waiter[];
  setSelectedCuits?: (waiters: Waiter[]) => void;
  activeTab?: 'tips' | 'reviews';
}

export function FilterBar({
  onChangeDates,
  filterOptionsName = [],
  setSelectedCuits,
  activeTab = 'tips',
}: FilterBarProps) {
  const t = useTranslations('socios.filterBar');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNames, setSelectedNames] = useState<Waiter[]>([]);
  const [selectedDates, setSelectedDates] = useState({ fromDate: '', toDate: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleApply = useCallback(() => {
    if (!errorMessage) {
      onChangeDates(selectedDates.fromDate, selectedDates.toDate);
      if (setSelectedCuits) {
        setSelectedCuits(selectedNames);
      }
      setIsOpen(false);
    }
  }, [onChangeDates, selectedDates, errorMessage, selectedNames, setSelectedCuits]);

  const handleDateSelect = useCallback(
    (fromDate: string, toDate: string) => {
      setSelectedDates({ fromDate, toDate });
      setErrorMessage('');

      const MIN_VALID_DATE = new Date('2023-01-01');

      if (fromDate) {
        const fromDateObj = new Date(fromDate);
        if (fromDateObj < MIN_VALID_DATE) {
          setErrorMessage(t('errorDateBefore2023', { defaultValue: 'Date cannot be before 2023' }));
          return;
        }

        if (toDate) {
          const toDateObj = new Date(toDate);
          if (toDateObj < fromDateObj) {
            setErrorMessage(t('errorToDateBeforeFromDate', { defaultValue: 'End date must be after start date' }));
            return;
          }
        }
      }

      if (!fromDate && toDate) {
        const toDateObj = new Date(toDate);
        if (toDateObj < MIN_VALID_DATE) {
          setErrorMessage(t('errorDateBefore2023', { defaultValue: 'Date cannot be before 2023' }));
        }
      }
    },
    [t]
  );

  const handleNameSelect = useCallback(
    (selectedFilters: Waiter[]) => {
      setSelectedNames(selectedFilters);
      if (setSelectedCuits) {
        setSelectedCuits(selectedFilters);
      }
    },
    [setSelectedCuits]
  );

  const isApplyButtonDisabled =
    (selectedNames.length === 0 && !selectedDates.fromDate && !selectedDates.toDate) || !!errorMessage;

  return (
    <div className="filter-bar bg-white rounded-2xl p-4 border border-[#E1E1E1] mb-6">
      <button
        type="button"
        className="filter-button flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={18} />
        {t('filter', { defaultValue: 'Filter' })}
      </button>

      {isOpen && (
        <div className="filters-container mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t('filters', { defaultValue: 'Filters' })}</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {filterOptionsName.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('sortBy', { defaultValue: 'Sort by' })}
                </label>
                <select
                  multiple
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={selectedNames.map((w) => w.cuit)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (option) => {
                      const waiter = filterOptionsName.find((w) => w.cuit === option.value);
                      return waiter || { name: option.value, cuit: option.value };
                    });
                    handleNameSelect(selected);
                  }}
                >
                  {filterOptionsName.map((option) => (
                    <option key={option.cuit} value={option.cuit}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('fromDate', { defaultValue: 'From Date' })}
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={selectedDates.fromDate}
                  onChange={(e) => handleDateSelect(e.target.value, selectedDates.toDate)}
                  min="2023-01-01"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('toDate', { defaultValue: 'To Date' })}
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={selectedDates.toDate}
                  onChange={(e) => handleDateSelect(selectedDates.fromDate, e.target.value)}
                  min={selectedDates.fromDate || '2023-01-01'}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedNames([]);
                  setSelectedDates({ fromDate: '', toDate: '' });
                  setErrorMessage('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('clear', { defaultValue: 'Clear' })}
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplyButtonDisabled}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {t('apply', { defaultValue: 'Apply' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

