import type { BrandTheme } from '../components/providers/ThemeProvider';

/**
 * MOND Brand Theme - Professional, Clean Design
 * 
 * External brand configuration for the MOND professional identity.
 * This demonstrates how brands can be configured externally without
 * modifying the core design system.
 */
export const mondTheme: BrandTheme = {
  id: 'mond',
  name: 'MOND Professional',
  description: 'Clean, modern, and professional design identity for enterprise applications',
  colors: {
    brand: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe', 
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9', // Base blue
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b', // Base gray
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      success: {
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
      },
      warning: {
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
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