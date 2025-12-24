'use client';

import { tokens } from '@/styles/tokens';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  width,
  height,
  variant = 'text',
  animation = 'pulse',
}: SkeletonProps) {
  const baseStyles: React.CSSProperties = {
    backgroundColor: '#E0E0E0',
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    text: { borderRadius: '4px' },
    circular: { borderRadius: '50%' },
    rectangular: { borderRadius: '0' },
    rounded: { borderRadius: tokens.borderRadius.lg },
  };

  const animationClass = animation === 'pulse' 
    ? 'animate-pulse' 
    : animation === 'wave' 
    ? 'animate-shimmer' 
    : '';

  return (
    <div
      className={`${animationClass} ${className}`}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
      }}
    />
  );
}

// Pre-built skeleton patterns
export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          height="1rem"
          width={i === lines - 1 && lines > 1 ? '70%' : '100%'} 
        />
      ))}
    </div>
  );
}

export function SkeletonButton({ className = '' }: { className?: string }) {
  return (
    <Skeleton
      variant="rounded"
      height={tokens.sizing.buttonHeight.lg}
      className={className}
    />
  );
}

export function SkeletonInput({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Skeleton variant="text" height="1rem" width="30%" />
      <Skeleton variant="rounded" height="48px" />
    </div>
  );
}

export function SkeletonAvatar({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 space-y-4 ${className}`}>
      <Skeleton variant="text" height="1.5rem" width="60%" />
      <SkeletonText lines={3} />
      <SkeletonButton />
    </div>
  );
}

