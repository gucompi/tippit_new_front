'use client';

import { ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { Skeleton } from '@/components/ui';

interface StatCardProps {
  title: string;
  children: ReactNode;
  id?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  isLoading?: boolean;
}

export function StatCard({
  title,
  children,
  id,
  collapsed = false,
  onToggle,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  return (
    <div
      id={id}
      className="border border-[#EAEAEA] rounded-lg text-center text-gray-500 flex-grow transition-shadow duration-300 hover:shadow-lg group hover:border-pink-500 bg-white py-8 px-6 lg:px-10 w-full"
    >
      {onToggle ? (
        <button
          className="text-lg lg:text-xl xl:text-2xl font-semibold text-[#5C5C5C] group-hover:text-pink-500 transition-colors duration-300 pb-4 lg:pb-6 cursor-pointer bg-transparent border-none p-0 w-full text-center"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand section' : 'Collapse section'}
        >
          {title}
        </button>
      ) : (
        <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold text-[#5C5C5C] group-hover:text-pink-500 transition-colors duration-300 pb-4 lg:pb-6">
          {title}
        </h2>
      )}
      <div
        className={`flex flex-col relative w-full transition-all duration-300 ease-in-out ${
          collapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-full opacity-100 overflow-visible'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="border border-[#EAEAEA] rounded-lg text-center bg-white py-8 px-6 lg:px-10 w-full flex-grow">
      <Skeleton variant="text" height="2rem" width="70%" className="mx-auto mb-8" />
      <Skeleton variant="text" height="3rem" width="50%" className="mx-auto mb-2" />
      <Skeleton variant="text" height="1rem" width="40%" className="mx-auto" />
    </div>
  );
}

