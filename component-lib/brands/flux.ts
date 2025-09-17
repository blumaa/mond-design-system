import type { BrandTheme } from '../components/providers/ThemeProvider';

/**
 * FLUX Brand Theme - Music Festival Platform
 * 
 * External brand configuration for the FLUX music festival identity.
 * Vibrant, energetic design with bold colors for music and
 * entertainment platforms.
 */
export const fluxTheme: BrandTheme = {
  id: 'flux',
  name: 'FLUX Festival',
  description: 'Vibrant, energetic design for music festivals and entertainment platforms',
  colors: {
    brand: {
      primary: {
        50: '#fef7ff',
        100: '#fdeeff',
        200: '#fad7ff',
        300: '#f6b3ff',
        400: '#f080ff',
        500: '#e542ff', // Base electric purple
        600: '#d420ff',
        700: '#b800e6',
        800: '#9600cc',
        900: '#7a00b3',
      },
      secondary: {
        50: '#fffef7',
        100: '#fffceb',
        200: '#fff8d1',
        300: '#fff1a8',
        400: '#ffe66d',
        500: '#ffdd33', // Base electric yellow
        600: '#ffcc00',
        700: '#e6b800',
        800: '#cc9f00',
        900: '#b38600',
      },
      success: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981', // Vibrant teal/green
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
      },
      warning: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#f59e0b', // Vibrant orange/amber
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444', // Vibrant red
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
    },
  },
};