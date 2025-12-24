'use client';

import { Skeleton, SkeletonInput, SkeletonButton } from '@/components/ui';
import { tokens } from '@/styles/tokens';

export function LoginFormSkeleton() {
  return (
    <div className="flex w-full flex-col items-center space-y-6">
      {/* Email Field Skeleton */}
      <div className="w-full max-w-[379px] space-y-2">
        <Skeleton variant="text" height="1rem" width="40px" />
        <Skeleton variant="rounded" height="48px" />
      </div>

      {/* Password Field Skeleton */}
      <div className="w-full max-w-[379px] space-y-2">
        <Skeleton variant="text" height="1rem" width="70px" />
        <Skeleton variant="rounded" height="48px" />
      </div>

      {/* Forgot Password Skeleton */}
      <div className="flex w-full max-w-[379px] items-center justify-end">
        <Skeleton variant="text" height="0.75rem" width="110px" />
      </div>

      {/* Submit Button Skeleton */}
      <Skeleton 
        variant="rounded" 
        height={tokens.sizing.buttonHeight.lg} 
        className="w-full max-w-[401px]"
      />
    </div>
  );
}

export function LoginHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Logo Skeleton */}
      <div className="relative mb-4">
        <Skeleton variant="rounded" width={150} height={50} />
      </div>

      {/* Title Skeleton */}
      <Skeleton variant="text" height="1.75rem" width="200px" className="mb-2" />

      {/* Toggle Skeleton */}
      <Skeleton variant="text" height="1rem" width="180px" />
    </div>
  );
}

export function LoginImageSkeleton() {
  return (
    <div 
      className="relative hidden lg:block lg:w-1/2 overflow-hidden"
      style={{ backgroundColor: '#f0f0f0' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton variant="circular" width={300} height={300} />
      </div>
    </div>
  );
}

export function LoginPageSkeleton() {
  return (
    <div 
      className="flex min-h-screen flex-col lg:flex-row"
      style={{ backgroundColor: tokens.colors.white }}
    >
      {/* Image Skeleton */}
      <LoginImageSkeleton />

      {/* Form Side */}
      <div
        className="flex flex-1 items-center justify-center"
        style={{ padding: `${tokens.spacing[10]} ${tokens.spacing[6]}` }}
      >
        <div className="w-full" style={{ maxWidth: tokens.sizing.maxWidth.form }}>
          <LoginHeaderSkeleton />
          <LoginFormSkeleton />
        </div>
      </div>
    </div>
  );
}

