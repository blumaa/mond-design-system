import React from 'react';
import type { Theme } from '../../utils/themeResolver';

/**
 * Brand theme configuration interface
 * External brand themes must conform to this structure
 */
export interface BrandTheme {
  id: string;
  name: string;
  description?: string;
  colors: {
    brand: {
      primary: ColorScale;
      secondary?: ColorScale;
      success?: ColorScale;
      warning?: ColorScale;
      error?: ColorScale;
    };
  };
}

/**
 * Color scale interface for brand color tokens
 */
export interface ColorScale {
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500: string; // Required base color
  600?: string;
  700?: string;
  800?: string;
  900?: string;
}

/**
 * Props for the ThemeProvider
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * External brand theme configuration
   * Brand colors will be injected as CSS variables
   * If not provided, uses default brand colors from tokens
   */
  brandTheme?: BrandTheme;
  /**
   * Color scheme (light/dark mode)
   * @default 'light'
   */
  colorScheme?: Theme;
  /**
   * Additional class name for the theme wrapper
   */
  className?: string;
}

/**
 * Default brand theme (uses existing blue-based design system colors)
 */
const defaultBrandTheme: BrandTheme = {
  id: 'default',
  name: 'Default Theme',
  description: 'Default design system theme',
  colors: {
    brand: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      success: {
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        400: '#4ade80',
      },
      warning: {
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        400: '#fbbf24',
      },
      error: {
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        400: '#f87171',
      },
    },
  },
};

/**
 * Generate inline CSS variable overrides for brand theme
 */
function generateBrandCSSVariables(brandTheme: BrandTheme): React.CSSProperties {
  const cssVars: Record<string, string> = {};

  // Map brand theme colors to CSS variables
  // This allows runtime brand switching while maintaining SSR compatibility
  Object.entries(brandTheme.colors.brand).forEach(([colorType, colorScale]) => {
    if (colorScale) {
      Object.entries(colorScale).forEach(([shade, value]) => {
        if (value) {
          cssVars[`--mond-color-brand-${colorType}-${shade}`] = value;
        }
      });
    }
  });

  return cssVars as React.CSSProperties;
}

/**
 * SSR-Compatible ThemeProvider Component
 *
 * This component provides theming via:
 * 1. data-theme attribute for light/dark mode switching
 * 2. Inline CSS variables for optional brand theme overrides
 *
 * Unlike the previous Context-based approach, this component:
 * - ✅ Works with Server Components (no "use client")
 * - ✅ No React Context required
 * - ✅ Themes applied via CSS variables
 * - ✅ SSR-compatible
 *
 * @example
 * // Basic usage (light theme, default brand)
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * @example
 * // Dark mode
 * <ThemeProvider colorScheme="dark">
 *   <App />
 * </ThemeProvider>
 *
 * @example
 * // Custom brand theme
 * <ThemeProvider brandTheme={nordstromTheme} colorScheme="dark">
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({
  children,
  brandTheme,
  colorScheme = 'light',
  className,
}: ThemeProviderProps) {
  // Generate inline CSS variables for brand theme (if provided)
  const brandCSSVars = brandTheme ? generateBrandCSSVariables(brandTheme) : undefined;

  return (
    <div
      data-theme={colorScheme}
      data-brand={brandTheme?.id}
      className={className}
      style={brandCSSVars}
    >
      {children}
    </div>
  );
}

// Export types for backward compatibility
export type { Theme };

/**
 * Backward compatibility: Deprecated hooks
 *
 * These hooks are provided for backward compatibility during migration.
 * They will be removed in a future major version.
 *
 * Migration guide:
 * - Instead of: const theme = useTheme(); const bg = theme('surface.background');
 * - Use: const bg = 'var(--mond-surface-background)';
 */

import { createThemeResolver } from '../../utils/themeResolver';

/**
 * @deprecated Use CSS variables directly instead
 * This hook now returns a static theme resolver with default values
 * Components using this hook should be migrated to use CSS variables
 */
export function useTheme(isDarkMode?: boolean) {
  // Return a static theme resolver for backward compatibility
  // This allows components to build, but they should migrate to CSS variables
  const theme = isDarkMode ? 'dark' : 'light';
  return createThemeResolver(theme, defaultBrandTheme);
}

/**
 * @deprecated Use CSS variables directly instead
 */
export interface ThemeContextValue {
  theme: ReturnType<typeof createThemeResolver>;
  colorScheme: Theme;
  brandTheme: BrandTheme | null;
}

/**
 * @deprecated Use CSS variables directly instead
 * Returns default theme values for backward compatibility
 */
export function useThemeContext(): ThemeContextValue {
  return {
    theme: createThemeResolver('light', defaultBrandTheme),
    colorScheme: 'light',
    brandTheme: defaultBrandTheme,
  };
}

/**
 * @deprecated Use CSS variables directly instead
 */
export function useThemeResolver() {
  return createThemeResolver('light', defaultBrandTheme);
}
