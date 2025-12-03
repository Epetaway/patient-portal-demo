/**
 * Design Tokens - Enterprise Healthcare Design System
 * Asembia/Provider-facing UI patterns for Patient Portals
 *
 * This file defines the core design tokens that ensure visual consistency,
 * accessibility (WCAG 2.1 AA), and professional healthcare UX across the application.
 */

export const designTokens = {
  // Color Palette - Healthcare Professional
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#0066cc', // Main primary
      600: '#004499',
      700: '#003d82',
      800: '#00366b',
      900: '#002654',
    },

    // Semantic Colors
    success: {
      light: '#d4edda',
      main: '#28a745',
      dark: '#155724',
      contrast: '#ffffff',
    },
    warning: {
      light: '#fff3cd',
      main: '#ffc107',
      dark: '#856404',
      contrast: '#000000',
    },
    error: {
      light: '#f8d7da',
      main: '#dc3545',
      dark: '#721c24',
      contrast: '#ffffff',
    },
    info: {
      light: '#d1ecf1',
      main: '#17a2b8',
      dark: '#0c5460',
      contrast: '#ffffff',
    },

    // Neutrals - WCAG AA compliant
    gray: {
      50: '#f8f9fa',
      100: '#f1f3f5',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529',
    },

    // Background Colors
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Text Colors - WCAG AA contrast ratios
    text: {
      primary: '#212529', // 4.5:1 on white
      secondary: '#6c757d', // 4.5:1 on white
      disabled: '#adb5bd',
      inverse: '#ffffff',
    },

    // Border Colors
    border: {
      light: '#e9ecef',
      main: '#dee2e6',
      dark: '#ced4da',
    },
  },

  // Typography Scale - Professional Healthcare
  typography: {
    fontFamily: {
      primary: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif",
      mono: "'Monaco', 'Courier New', monospace",
    },

    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },

    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // Spacing Scale - 4px base unit
  spacing: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
  },

  // Border Radius
  radius: {
    none: '0',
    sm: '0.125rem', // 2px
    base: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    full: '9999px',
  },

  // Shadows - Elevation system
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // Transitions - Smooth animations
  transitions: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '400ms',
    },
    timing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // Breakpoints - Mobile-first responsive design
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },

  // Focus Rings - Accessibility (WCAG 2.4.7)
  focus: {
    ring: '0 0 0 3px rgba(0, 102, 204, 0.25)',
    ringOffset: '2px',
  },

  // Healthcare-Specific UI Patterns
  healthcare: {
    // HIPAA-compliant status indicators
    statusColors: {
      active: '#28a745',
      pending: '#ffc107',
      inactive: '#6c757d',
      critical: '#dc3545',
      needsApproval: '#ff9800',
    },

    // Touch targets for mobile healthcare workflows
    touchTarget: {
      min: '44px', // WCAG 2.5.5 Level AAA
      recommended: '48px',
    },

    // Form validation states
    validation: {
      valid: '#28a745',
      invalid: '#dc3545',
      warning: '#ffc107',
    },
  },
};

/**
 * Apply design tokens as CSS custom properties
 * This allows for dynamic theming and easier maintenance
 */
export function applyDesignTokens() {
  const root = document.documentElement;

  // Apply color tokens
  Object.entries(designTokens.colors).forEach(([category, values]) => {
    if (typeof values === 'object') {
      Object.entries(values).forEach(([shade, value]) => {
        root.style.setProperty(`--color-${category}-${shade}`, value);
      });
    }
  });

  // Apply spacing tokens
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Apply typography tokens
  root.style.setProperty('--font-family-primary', designTokens.typography.fontFamily.primary);
  root.style.setProperty('--font-family-mono', designTokens.typography.fontFamily.mono);

  // Apply shadow tokens
  Object.entries(designTokens.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  // Apply transition tokens
  Object.entries(designTokens.transitions.duration).forEach(([key, value]) => {
    root.style.setProperty(`--transition-${key}`, value);
  });

  console.log('Design tokens applied successfully');
}

export default designTokens;
