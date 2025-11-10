import type { BrandTheme } from '@mond-design-system/theme';

/**
 * Violet Brand Theme
 *
 * Custom brand theme using violet as the primary color.
 * This demonstrates how to create custom brand themes with the CSS variables API.
 */
export const violetBrand: BrandTheme = {
  id: 'violet',
  name: 'Violet Brand',
  description: 'Custom brand theme with violet as the primary color',
  colors: {
    brand: {
      primary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6', // Violet primary
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      secondary: {
        500: '#ec4899', // Pink secondary
        600: '#db2777',
        700: '#be185d',
      },
      success: {
        500: '#10b981',
        600: '#059669',
        700: '#047857',
      },
      warning: {
        500: '#f59e0b',
        600: '#d97706',
      },
      error: {
        500: '#ef4444',
        600: '#dc2626',
      },
    },
  },
};
