'use client';

import { CompleteProfileForm } from '@/components/register/CompleteProfileForm';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoaded && !clerkUser) {
      router.push('/');
    } else if (isLoaded) {
      setIsChecking(false);
    }
  }, [isLoaded, clerkUser, router]);

  if (isChecking || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <CompleteProfileForm
      onComplete={() => {
        router.push('/onboarding');
      }}
    />
  );
}

