'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import { RegisterScreen } from '@/components/register';

export default function RegisterPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/profile');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <SignedOut>
        <RegisterScreen />
      </SignedOut>
      <SignedIn>
        {/* Will redirect via useEffect */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      </SignedIn>
    </>
  );
}

