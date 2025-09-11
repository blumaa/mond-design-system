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
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
      },
      warning: {
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
      },
      error: {
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
      },
    },
  },
};