'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { tokens } from '@/styles/tokens';

// Create MUI theme using our design tokens
const theme = createTheme({
  palette: {
    primary: {
      main: tokens.colors.primary,
      light: tokens.colors.primaryLight,
      dark: tokens.colors.primaryDark,
    },
    secondary: {
      main: tokens.colors.secondary,
    },
    error: {
      main: tokens.colors.error,
    },
    background: {
      default: tokens.colors.background,
      paper: tokens.colors.white,
    },
    text: {
      primary: tokens.colors.textPrimary,
      secondary: tokens.colors.textSecondary,
    },
  },
  typography: {
    fontFamily: tokens.typography.fontFamily.primary,
    fontSize: 14,
    h1: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.tight,
    },
    body1: {
      fontSize: tokens.typography.fontSize.base,
      lineHeight: tokens.typography.lineHeight.normal,
    },
    body2: {
      fontSize: tokens.typography.fontSize.sm,
      lineHeight: tokens.typography.lineHeight.normal,
    },
    button: {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.semibold,
      textTransform: 'uppercase',
      letterSpacing: tokens.typography.letterSpacing.wide,
    },
  },
  shape: {
    borderRadius: parseInt(tokens.borderRadius.md),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: tokens.borderRadius.lg,
          height: tokens.sizing.buttonHeight.lg,
          transition: `background-color ${tokens.transitions.normal}`,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: tokens.colors.primaryHover,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.borderRadius.full,
            height: tokens.sizing.inputHeight.md,
            '& fieldset': {
              borderColor: tokens.colors.border,
            },
            '&:hover fieldset': {
              borderColor: tokens.colors.borderFocus,
            },
            '&.Mui-focused fieldset': {
              borderColor: tokens.colors.borderFocus,
            },
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: tokens.colors.primary,
        },
      },
    },
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
