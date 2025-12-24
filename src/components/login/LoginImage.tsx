'use client';

import Image from 'next/image';
import { tokens } from '@/styles/tokens';

interface LoginImageProps {
  isOwner: boolean;
}

export function LoginImage({ isOwner }: LoginImageProps) {
  return (
    <div
      className="flex-1 flex-col justify-end hidden lg:flex relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        background: isOwner
          ? `radial-gradient(circle at top, ${tokens.colors.ownerGradientStart}, ${tokens.colors.ownerGradientEnd})`
          : `radial-gradient(circle at top, ${tokens.colors.waiterGradientStart}, ${tokens.colors.waiterGradientEnd})`,
      }}
    >
      {/* Owner Image */}
      <Image
        src="/tippit-owner-woman.webp"
        alt="Restaurant owner"
        fill
        sizes="50vw"
        draggable={false}
        className={`object-contain object-bottom transition-opacity duration-300 ease-in-out ${
          isOwner ? 'opacity-100' : 'opacity-0'
        }`}
        priority
      />

      {/* Waiter Image */}
      <Image
        src="/tippit-waiter.webp"
        alt="Restaurant waiter"
        fill
        sizes="50vw"
        draggable={false}
        className={`object-contain object-bottom transition-opacity duration-300 ease-in-out ${
          isOwner ? 'opacity-0' : 'opacity-100'
        }`}
        priority
      />
    </div>
  );
}
