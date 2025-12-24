'use client';

import { ReactNode } from 'react';

interface LoginCardFlipperProps {
  isFlipped: boolean;
  children: ReactNode;
}

export function LoginCardFlipper({ isFlipped, children }: LoginCardFlipperProps) {
  return (
    <div
      className={`${isFlipped ? 'flipped' : ''} transition-transform duration-500`}
      id="loginView"
    >
      <div className="flipper">{children}</div>
    </div>
  );
}

