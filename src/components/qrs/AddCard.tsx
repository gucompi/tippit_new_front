'use client';

import { Plus, LucideIcon } from 'lucide-react';

interface AddCardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  icon?: LucideIcon;
  className?: string;
}

export function AddCard({ title, description, buttonText, onClick, icon: Icon, className = '' }: AddCardProps) {
  return (
    <div
      className={`border-2 border-pink-300 rounded-xl flex flex-col items-center justify-center p-6 h-[400px] w-[260px] bg-white hover:shadow-lg transition cursor-pointer ${className}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-2">
        {Icon ? (
          <Icon className="w-12 h-12 opacity-30" />
        ) : (
          <Plus className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <span className="font-bold text-gray-700 text-lg mb-1 mt-3">{title}</span>
      <span className="text-[#B0CAD1] text-sm mb-6 text-center">{description}</span>
      <button className="bg-pink-500 text-white px-6 py-2 rounded-[16px] hover:bg-pink-600 transition w-[188px] text-[16px]">
        {buttonText}
      </button>
    </div>
  );
}

