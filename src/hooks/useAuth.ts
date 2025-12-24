'use client';

import { useCallback } from 'react';
import { trpc } from '@/lib/trpc';

/**
 * Custom hook for authentication using tRPC + TanStack Query
 * 
 * This demonstrates how tRPC integrates with TanStack Query:
 * - useQuery() for GET operations (fetching data)
 * - useMutation() for POST/PUT/DELETE operations (modifying data)
 */
export function useAuth() {
  // ============================================
  // QUERIES - Cached, auto-refetched data
  // ============================================

  /**
   * Get current session - TanStack Query handles:
   * - Caching
   * - Background refetching
   * - Loading/error states
   * - Deduplication (multiple components using this won't cause multiple requests)
   */
  const sessionQuery = trpc.auth.getSession.useQuery(undefined, {
    // TanStack Query options
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // ============================================
  // MUTATIONS - For data modification
  // ============================================

  /**
   * Login mutation with TanStack Query features:
   * - onSuccess/onError callbacks
   * - Automatic loading state (isPending)
   * - Can invalidate queries after success
   */
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Invalidate session query to refetch user data
      trpc.useUtils().auth.getSession.invalidate();
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });

  /**
   * Logout mutation
   */
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      // Invalidate session query after logout
      trpc.useUtils().auth.getSession.invalidate();
    },
  });

  /**
   * Forgot password mutation
   */
  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation();

  // ============================================
  // DERIVED STATE
  // ============================================

  const isAuthenticated = sessionQuery.data?.isAuthenticated ?? false;
  const user = sessionQuery.data?.user ?? null;
  const isLoading = sessionQuery.isLoading;
  const isLoginPending = loginMutation.isPending;
  const isLogoutPending = logoutMutation.isPending;

  // ============================================
  // ACTIONS
  // ============================================

  const login = useCallback(
    (params: { email: string; password: string; isOwner: boolean }) => {
      return loginMutation.mutateAsync(params);
    },
    [loginMutation]
  );

  const logout = useCallback(() => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const forgotPassword = useCallback(
    (email: string) => {
      return forgotPasswordMutation.mutateAsync({ email });
    },
    [forgotPasswordMutation]
  );

  return {
    // Session state
    isAuthenticated,
    user,
    isLoading,

    // Mutation states
    isLoginPending,
    isLogoutPending,
    isForgotPasswordPending: forgotPasswordMutation.isPending,

    // Mutation errors
    loginError: loginMutation.error?.message,
    logoutError: logoutMutation.error?.message,
    forgotPasswordError: forgotPasswordMutation.error?.message,

    // Actions
    login,
    logout,
    forgotPassword,

    // Raw mutation objects for advanced usage
    loginMutation,
    logoutMutation,
    forgotPasswordMutation,

    // Session query for advanced usage
    sessionQuery,
  };
}

/**
 * Hook to check if an email exists
 * Demonstrates conditional queries with TanStack Query
 */
export function useCheckEmail(email: string, enabled = false) {
  return trpc.auth.checkEmail.useQuery(
    { email },
    {
      enabled: enabled && email.length > 0, // Only run query when enabled and email is provided
      staleTime: 60 * 1000, // Cache for 1 minute
    }
  );
}

