'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useCallback } from 'react';

interface EmployeePaginationProps {
  totalEmployees?: number;
  currentPage?: number;
  employeesPerPage?: number;
  onPageChange: (page: number) => void;
}

export function EmployeePagination({
  totalEmployees = 0,
  currentPage = 1,
  employeesPerPage = 10,
  onPageChange,
}: EmployeePaginationProps) {
  const totalPages = Math.ceil(totalEmployees / employeesPerPage);

  const getVisiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

  const handlePrev = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  }, [currentPage, totalPages, onPageChange]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-row space-x-1 px-2">
      <button
        type="button"
        onClick={handlePrev}
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentPage === 1 ? 'invisible' : ''
        }`}
      >
        <ChevronLeft size={14} />
      </button>

      <div className="flex items-center justify-center space-x-1 flex-wrap">
        {getVisiblePages.map((p, index) => (
          <button
            key={index}
            type="button"
            onClick={() => p !== '...' && typeof p === 'number' && onPageChange(p)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              p === currentPage ? 'bg-pink-500 text-white' : 'text-gray-700'
            } ${p === '...' ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100'}`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleNext}
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentPage === totalPages ? 'invisible' : ''
        }`}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

