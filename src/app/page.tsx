'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import { LoginScreen } from "@/components/login/LoginScreen";
import { backendClient } from '@/lib/backend-client';

export default function Home() {
  const { isSignedIn, isLoaded: isClerkLoaded, user: clerkUser } = useUser();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  useEffect(() => {
    // Check both Clerk auth and localStorage token (for mock auth)
    if (typeof window === 'undefined') return;
    
    if (isClerkLoaded) {
      const hasToken = !!localStorage.getItem('token');
      const isClerkSignedIn = isSignedIn;
      
      if (isClerkSignedIn) {
        // User signed in with Clerk - check backend
        checkBackendUser();
      } else if (hasToken) {
        // User authenticated via mock auth
        router.push('/business');
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [isClerkLoaded, isSignedIn, router, clerkUser]);

  const checkBackendUser = async () => {
    if (!clerkUser?.id) {
      console.log('No Clerk user ID found');
      setIsCheckingAuth(false);
      return;
    }

    setIsCheckingBackend(true);
    console.log('🔍 Checking backend user for Clerk ID:', clerkUser.id);

    try {
      // Try to get user by Clerk ID
      const response = await backendClient.get(`/api/users/clerk/${clerkUser.id}`);
      const user = response.data.data;

      console.log('✅ User found in backend:', user);

      if (user) {
        // User exists in backend
        if (!user.profileCompleted) {
          // Profile not completed - redirect to complete profile
          console.log('Profile not completed, redirecting to /complete-profile');
          router.push('/complete-profile');
        } else {
          // Profile completed - check onboarding (you can add onboardingCompleted flag later)
          console.log('Profile completed, redirecting to /business');
          router.push('/business');
        }
      } else {
        // User doesn't exist in backend - create them (webhook might have failed)
        console.log('User not found in response, creating user...');
        await createUserFromClerk();
      }
    } catch (error: any) {
      console.log('⚠️ Error checking backend user:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 404) {
        // User not found - create them
        console.log('User not found (404), creating user...');
        await createUserFromClerk();
      } else {
        console.error('Unexpected error checking backend user:', error);
        // On error, try to create user anyway
        console.log('Attempting to create user despite error...');
        await createUserFromClerk();
      }
    } finally {
      setIsCheckingBackend(false);
      setIsCheckingAuth(false);
    }
  };

  const createUserFromClerk = async () => {
    if (!clerkUser) {
      console.error('No Clerk user found');
      setIsCheckingAuth(false);
      return;
    }

    try {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        console.error('No email found for Clerk user');
        setIsCheckingAuth(false);
        return;
      }

      console.log('Creating user from Clerk:', {
        clerkId: clerkUser.id,
        email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      });

      const userData: any = {
        clerkId: clerkUser.id,
        email,
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        profilePicture: clerkUser.imageUrl || undefined,
        profileCompleted: false,
      };

      const response = await backendClient.post('/api/register', userData);
      const user = response.data.data;

      console.log('✅ User created successfully:', user);

      // Redirect to complete profile
      router.push('/complete-profile');
    } catch (error: any) {
      console.error('❌ Error creating user from Clerk:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 409 && error.response?.data?.existingUser) {
        // User exists with email - unify login methods by linking Clerk ID
        console.log('User exists with email, attempting to unify login methods...');
        try {
          const unifyResponse = await backendClient.post('/api/register/unify-login', {
            email: clerkUser.emailAddresses[0]?.emailAddress,
            clerkId: clerkUser.id,
          });
          
          if (unifyResponse.data.success && unifyResponse.data.data) {
            console.log('✅ Login methods unified successfully');
            router.push('/complete-profile');
            return;
          }
        } catch (unifyError: any) {
          console.error('Error unifying login methods:', {
            status: unifyError.response?.status,
            data: unifyError.response?.data,
            message: unifyError.message,
          });
        }
        router.push('/complete-profile');
      } else if (error.response?.status === 409 && error.response?.data?.error?.includes('Clerk account already registered')) {
        // Clerk ID already exists - user was created, redirect to profile
        router.push('/complete-profile');
      } else {
        // On error, show error message but still try to redirect
        console.error('Failed to create user. Error details:', error.response?.data);
        alert(`Error creating user: ${error.response?.data?.message || error.message}. Please try again.`);
        setIsCheckingAuth(false);
      }
    }
  };

  if (isCheckingAuth || !isClerkLoaded || isCheckingBackend) {
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
