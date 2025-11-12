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

// Export types
export type { Theme };
