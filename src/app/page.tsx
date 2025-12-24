'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import { LoginScreen } from "@/components/login/LoginScreen";

export default function Home() {
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check both Clerk auth and localStorage token (for mock auth)
    if (typeof window === 'undefined') return;
    
    if (isClerkLoaded) {
      const hasToken = !!localStorage.getItem('token');
      const isClerkSignedIn = isSignedIn;
      
      if (isClerkSignedIn || hasToken) {
        // User is authenticated (either via Clerk or mock auth)
        router.push('/business');
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [isClerkLoaded, isSignedIn, router]);

  if (isCheckingAuth || !isClerkLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <LoginScreen />
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
