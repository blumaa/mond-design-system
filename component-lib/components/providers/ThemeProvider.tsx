'use client';

import React, { useContext, useMemo } from 'react';
import { createThemeResolver, type Theme } from '../../utils/themeResolver';

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
 * Theme context value providing resolved theme functions
 */
export interface ThemeContextValue {
  theme: ReturnType<typeof createThemeResolver>;
  colorScheme: Theme;
  brandTheme: BrandTheme | null;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

/**
 * Props for the brand-agnostic ThemeProvider
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * External brand theme configuration
   * If not provided, uses default brand colors
   */
  brandTheme?: BrandTheme;
  /**
   * Color scheme (light/dark mode)
   * @default 'light'
   */
  colorScheme?: Theme;
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
 * Brand-agnostic ThemeProvider component
 * 
 * Accepts external brand theme configurations and provides
 * theme resolution to child components via context.
 */
export function ThemeProvider({
  children,
  brandTheme = defaultBrandTheme,
  colorScheme = 'light',
}: ThemeProviderProps) {
  // Create theme resolver with brand awareness
  const themeResolver = useMemo(() => {
    // Create brand-aware theme resolver that merges brand colors
    // with base design system tokens
    return createThemeResolver(colorScheme, brandTheme);
  }, [colorScheme, brandTheme]);

  const contextValue: ThemeContextValue = {
    theme: themeResolver,
    colorScheme,
    brandTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * 
 * @returns Theme context value with theme resolver and brand info
 * 
 * @example
 * function MyComponent() {
 *   const { theme, colorScheme, brandTheme } = useTheme();
 *   
 *   return (
 *     <div style={{ 
 *       color: theme('text.primary'),
 *       backgroundColor: theme('interactive.primary.background')
 *     }}>
 *       {brandTheme?.name} in {colorScheme} mode
 *     </div>
 *   );
 * }
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * Hook to get theme resolver function
 * 
 * @returns Theme resolver function for current theme and brand
 * 
 * @example
 * function MyComponent() {
 *   const theme = useThemeResolver();
 *   
 *   return (
 *     <button style={{ 
 *       backgroundColor: theme('interactive.primary.background'),
 *       color: theme('interactive.primary.text')
 *     }}>
 *       Themed Button
 *     </button>
 *   );
 * }
 */
export function useThemeResolver() {
  const { theme } = useThemeContext();
  return theme;
}

/**
 * Brand-aware theme hook that combines ThemeProvider brand context with isDarkMode prop
 * This is the primary hook components should use for theme resolution
 * 
 * @param isDarkMode - Whether dark mode is active (component-level control)
 *                    If undefined, uses provider's colorScheme
 * @returns Theme resolver function with brand context and light/dark mode
 * 
 * @example
 * function MyComponent({ isDarkMode }) {
 *   const theme = useTheme(isDarkMode); // Falls back to provider colorScheme if undefined
 *   
 *   return (
 *     <button style={{ 
 *       backgroundColor: theme('interactive.primary.background'), 
 *       color: theme('interactive.primary.text')
 *     }}>
 *       Smart Theme Button
 *     </button>
 *   );
 * }
 */
export function useTheme(isDarkMode?: boolean) {
  const { brandTheme, colorScheme } = useThemeContext();
  // Use component prop if provided, otherwise fall back to provider colorScheme
  const currentTheme: Theme = isDarkMode !== undefined 
    ? (isDarkMode ? 'dark' : 'light')
    : colorScheme;
  return createThemeResolver(currentTheme, brandTheme || undefined);
}