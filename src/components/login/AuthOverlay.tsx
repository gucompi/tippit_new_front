'use client';

import { CircularProgress } from '@mui/material';
import { tokens } from '@/styles/tokens';

interface AuthOverlayProps {
  isSubmitting: boolean;
  authSuccess: boolean;
}

export function AuthOverlay({ isSubmitting, authSuccess }: AuthOverlayProps) {
  if (!isSubmitting && !authSuccess) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
      style={{ 
        zIndex: tokens.zIndex.modal,
        backgroundColor: tokens.colors.overlay,
      }}
    >
      <div 
        className="flex flex-col items-center gap-4"
        style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.borderRadius.xl,
          padding: tokens.spacing[8],
          boxShadow: tokens.shadows.xl,
        }}
      >
        {isSubmitting && !authSuccess && (
          <>
            <CircularProgress 
              size={48} 
              sx={{ color: tokens.colors.primary }} 
            />
            <p 
              className="font-medium"
              style={{ color: tokens.colors.textPrimary }}
            >
              Signing in...
            </p>
          </>
        )}
        {authSuccess && (
          <>
            <div 
              className="rounded-full flex items-center justify-center"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: tokens.colors.successLight,
              }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: tokens.colors.success }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p 
              className="font-medium"
              style={{ color: tokens.colors.textPrimary }}
            >
              Welcome!
            </p>
          </>
        )}
      </div>
    </div>
  );
}
