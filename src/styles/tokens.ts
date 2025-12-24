// ============================================
// DESIGN TOKENS - TypeScript Export
// Keep in sync with _tokens.scss
// ============================================

export const tokens = {
  // --------------------------------------------
  // COLOR TOKENS
  // --------------------------------------------
  colors: {
    // Brand
    primary: '#FF5EA3',
    primaryHover: '#f0589a',
    primaryLight: '#ffa0fa',
    primaryDark: '#5a0256',
    secondary: '#1B9EDE',
    secondaryHover: '#1589c4',

    // Neutral
    white: '#ffffff',
    black: '#000000',
    background: '#f7f7f7',

    // Text
    textPrimary: '#222D39',
    textSecondary: '#3E4854',
    textMuted: '#9da3b5',
    textInput: '#4F4F4F',
    textPlaceholder: '#9da3b5',

    // Border
    border: '#E1E1E1',
    borderFocus: '#FF5EA3',

    // Icon
    icon: '#9A9A9A',

    // State
    error: '#FB3640',
    errorLight: 'rgba(251, 54, 64, 0.1)',
    errorBorder: 'rgba(251, 54, 64, 0.5)',
    success: '#22c55e',
    successLight: '#dcfce7',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Theme - Owner
    ownerGradientStart: '#F55B9E',
    ownerGradientEnd: '#8F355C',

    // Theme - Waiter
    waiterGradientStart: '#5b3b91',
    waiterGradientEnd: '#151937',
  },

  // --------------------------------------------
  // TYPOGRAPHY TOKENS
  // --------------------------------------------
  typography: {
    // Font Families
    fontFamily: {
      primary: "'Inter', sans-serif",
      fallback: "Arial, Helvetica, sans-serif",
    },

    // Font Sizes
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },

    // Font Weights
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    // Line Heights
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },

    // Letter Spacing
    letterSpacing: {
      tight: '-0.006em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // --------------------------------------------
  // SPACING TOKENS
  // --------------------------------------------
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
  },

  // --------------------------------------------
  // SIZING TOKENS
  // --------------------------------------------
  sizing: {
    // Input Heights
    inputHeight: {
      sm: '40px',
      md: '48px',
      lg: '56px',
    },

    // Button Heights
    buttonHeight: {
      sm: '40px',
      md: '48px',
      lg: '56px',
    },

    // Max Widths
    maxWidth: {
      input: '379px',
      button: '401px',
      form: '529px',
    },

    // Logo
    logo: {
      width: '309px',
      height: '73px',
    },

    // Icon Sizes
    icon: {
      sm: '16px',
      md: '20px',
      lg: '24px',
    },
  },

  // --------------------------------------------
  // BORDER RADIUS TOKENS
  // --------------------------------------------
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '28px',
    full: '9999px',
  },

  // --------------------------------------------
  // SHADOW TOKENS
  // --------------------------------------------
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },

  // --------------------------------------------
  // TRANSITION TOKENS
  // --------------------------------------------
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
    cardFlip: '0.18s',
  },

  // --------------------------------------------
  // Z-INDEX TOKENS
  // --------------------------------------------
  zIndex: {
    base: 1,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    tooltip: 60,
  },

  // --------------------------------------------
  // BREAKPOINTS
  // --------------------------------------------
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // --------------------------------------------
  // ANIMATION DURATIONS
  // --------------------------------------------
  animation: {
    durationFast: '0.15s',
    durationNormal: '0.3s',
    durationSlow: '0.5s',
    gradientDuration: '5s',
  },
} as const;

// Type exports for better TypeScript support
export type ColorToken = keyof typeof tokens.colors;
export type SpacingToken = keyof typeof tokens.spacing;
export type FontSizeToken = keyof typeof tokens.typography.fontSize;
export type FontWeightToken = keyof typeof tokens.typography.fontWeight;
export type BorderRadiusToken = keyof typeof tokens.borderRadius;
export type ShadowToken = keyof typeof tokens.shadows;
export type BreakpointToken = keyof typeof tokens.breakpoints;

