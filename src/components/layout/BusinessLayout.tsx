'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Menu } from './Menu';
import { tokens } from '@/styles/tokens';
import { Skeleton } from '@/components/ui';

interface BusinessLayoutProps {
  children: React.ReactNode;
}

export function BusinessLayout({ children }: BusinessLayoutProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check both Clerk auth and localStorage token (for mock auth)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isClerkLoaded) {
      const hasToken = !!localStorage.getItem('token');
      const isClerkSignedIn = isSignedIn;
      
      if (isClerkSignedIn || hasToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/');
      }
    }
  }, [isClerkLoaded, isSignedIn, router]);

  // Show loading while checking auth
  if (!isClerkLoaded || isAuthenticated === null) {
    return <BusinessLayoutSkeleton />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <Menu />
      <main className="w-full transition-all duration-300 ease-in-out xl:w-[calc(100%-250px)] xl:ml-[250px] min-h-screen">
        {children}
      </main>
    </div>
  );
}

function BusinessLayoutSkeleton() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Sidebar Skeleton */}
      <div className="hidden xl:flex fixed left-0 top-0 h-screen bg-white w-[250px] flex-col p-4">
        <Skeleton variant="rounded" width={200} height={47} className="mb-10 mt-7" />
        <Skeleton variant="text" width={60} height={16} className="mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rounded" height={44} />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="w-full xl:w-[calc(100%-250px)] xl:ml-[250px] min-h-screen p-4">
        <Skeleton variant="rounded" height={80} className="mb-6 mx-[18px]" />
        <div className="w-11/12 max-w-[900px] mx-auto">
          <Skeleton variant="rounded" height={400} />
        </div>
      </main>
    </div>
  );
}

export { BusinessLayoutSkeleton };

