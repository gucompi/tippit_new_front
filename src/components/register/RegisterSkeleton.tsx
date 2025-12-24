'use client';

import { Skeleton, SkeletonAvatar } from '@/components/ui';
import { tokens } from '@/styles/tokens';

export function StepIndicatorSkeleton() {
  return (
    <div className="w-full max-w-[379px] text-center mb-6">
      <Skeleton variant="text" height="1rem" width="80px" className="mx-auto" />
    </div>
  );
}

export function Step1Skeleton() {
  return (
    <div className="flex w-full flex-col items-center space-y-6 px-4 sm:px-0">
      <StepIndicatorSkeleton />

      {/* Name Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <Skeleton variant="text" height="1rem" width="80px" />
        <Skeleton variant="rounded" height="48px" />
      </div>

      {/* Email Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <Skeleton variant="text" height="1rem" width="50px" />
        <Skeleton variant="rounded" height="48px" />
      </div>

      {/* Password Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <Skeleton variant="text" height="1rem" width="200px" />
        <Skeleton variant="rounded" height="48px" />
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-[379px] flex items-center justify-between">
        <Skeleton variant="text" height="1rem" width="50px" />
        <Skeleton variant="rounded" height="56px" width="200px" />
      </div>
    </div>
  );
}

export function Step2Skeleton() {
  return (
    <div className="flex w-full flex-col items-center space-y-6 px-4 sm:px-0">
      <StepIndicatorSkeleton />

      {/* CUIT Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <Skeleton variant="text" height="1rem" width="90px" />
        <Skeleton variant="rounded" height="48px" />
      </div>

      {/* Alias Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <Skeleton variant="text" height="1rem" width="100px" />
        <Skeleton variant="rounded" height="48px" />
      </div>

      {/* Phone Field */}
      <div className="w-full max-w-[379px] space-y-2">
        <Skeleton variant="text" height="1rem" width="100px" />
        <Skeleton variant="rounded" height="48px" />
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-[379px] flex items-center justify-between">
        <Skeleton variant="text" height="1rem" width="50px" />
        <Skeleton variant="rounded" height="56px" width="200px" />
      </div>
    </div>
  );
}

export function Step3Skeleton() {
  return (
    <div className="flex w-full flex-col items-center space-y-6 px-4 sm:px-0">
      <StepIndicatorSkeleton />

      {/* Avatar Circle */}
      <div className="w-full max-w-[379px] flex flex-col items-center mb-6">
        <SkeletonAvatar size={120} />
      </div>

      {/* Upload Area */}
      <div className="w-full max-w-[379px] space-y-2">
        <Skeleton variant="text" height="1rem" width="100px" />
        <Skeleton variant="rounded" height="116px" />
      </div>

      {/* Camera Link */}
      <div className="w-full max-w-[379px] text-center">
        <Skeleton variant="text" height="1rem" width="100px" className="mx-auto" />
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-[379px] flex items-center justify-between">
        <Skeleton variant="text" height="1rem" width="50px" />
        <Skeleton variant="rounded" height="56px" width="200px" />
      </div>
    </div>
  );
}

export function RegisterHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Logo */}
      <div className="relative mb-4">
        <Skeleton variant="rounded" width={150} height={35} />
      </div>

      {/* Title */}
      <Skeleton variant="text" height="1.75rem" width="200px" className="mb-2" />

      {/* Subtitle */}
      <Skeleton variant="text" height="1rem" width="220px" />
    </div>
  );
}

export function RegisterImageSkeleton() {
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

export function RegisterPageSkeleton({ step = 1 }: { step?: number }) {
  return (
    <div 
      className="flex min-h-screen flex-col lg:flex-row"
      style={{ backgroundColor: tokens.colors.white }}
    >
      {/* Image Skeleton */}
      <RegisterImageSkeleton />

      {/* Form Side */}
      <div
        className="flex flex-1 items-center justify-center"
        style={{ padding: `${tokens.spacing[10]} ${tokens.spacing[6]}` }}
      >
        <div className="w-full" style={{ maxWidth: tokens.sizing.maxWidth.form }}>
          <RegisterHeaderSkeleton />
          {step === 1 && <Step1Skeleton />}
          {step === 2 && <Step2Skeleton />}
          {step === 3 && <Step3Skeleton />}
        </div>
      </div>
    </div>
  );
}

export function RegistrationSuccessSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] px-4 py-8">
      {/* Logo */}
      <Skeleton variant="rounded" width={200} height={47} className="mb-8" />

      {/* Title */}
      <Skeleton variant="text" height="1.75rem" width="250px" className="mb-6" />

      {/* Text */}
      <div className="mb-8 text-center max-w-[506px] space-y-2">
        <Skeleton variant="text" height="1rem" width="100%" />
        <Skeleton variant="text" height="1rem" width="80%" className="mx-auto" />
      </div>

      {/* Buttons */}
      <div className="flex flex-row gap-4 mb-6">
        <Skeleton variant="rounded" width={155} height={50} />
        <Skeleton variant="rounded" width={155} height={50} />
      </div>

      {/* Troubleshooting Text */}
      <Skeleton variant="text" height="0.875rem" width="300px" />
    </div>
  );
}

