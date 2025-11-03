'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemeBrand = 'default' | 'bsf';

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
 * Theme context value for hooks
 */
export interface ThemeContextValue {
  mode: Theme;
  brand: ThemeBrand;
  setMode: (mode: Theme) => void;
  setBrand: (brand: ThemeBrand) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

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
   * Predefined brand ('default' or 'bsf')
   * Takes precedence over brandTheme
   */
  brand?: ThemeBrand;
  /**
   * Whether to enable stateful theme switching via hooks
   * When enabled, provides useTheme hook for runtime theme changes
   * @default false
   */
  enableHooks?: boolean;
  /**
   * Whether to persist theme to localStorage (only works with enableHooks)
   * @default true
   */
  enablePersistence?: boolean;
  /**
   * localStorage key for theme mode
   * @default 'mond-theme-mode'
   */
  storageKeyMode?: string;
  /**
   * localStorage key for brand
   * @default 'mond-theme-brand'
   */
  storageKeyBrand?: string;
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
 * Stateful ThemeProvider with hooks support
 */
function StatefulThemeProvider({
  children,
  brandTheme,
  colorScheme = 'light',
  brand: initialBrand = 'default',
  enablePersistence = true,
  storageKeyMode = 'mond-theme-mode',
  storageKeyBrand = 'mond-theme-brand',
  className,
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<Theme>(colorScheme);
  const [brand, setBrandState] = useState<ThemeBrand>(initialBrand);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount (client-side only)
  useEffect(() => {
    if (!enablePersistence) {
      setMounted(true);
      return;
    }

    const storedMode = localStorage.getItem(storageKeyMode) as Theme | null;
    const storedBrand = localStorage.getItem(storageKeyBrand) as ThemeBrand | null;

    if (storedMode && (storedMode === 'light' || storedMode === 'dark')) {
      setModeState(storedMode);
    }

    if (storedBrand && (storedBrand === 'default' || storedBrand === 'bsf')) {
      setBrandState(storedBrand);
    }

    setMounted(true);
  }, [enablePersistence, storageKeyMode, storageKeyBrand]);

  // Apply theme attributes to document element
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    root.setAttribute('data-brand', brand);

    if (enablePersistence) {
      localStorage.setItem(storageKeyMode, mode);
      localStorage.setItem(storageKeyBrand, brand);
    }
  }, [mode, brand, mounted, enablePersistence, storageKeyMode, storageKeyBrand]);

  const setMode = (newMode: Theme) => {
    setModeState(newMode);
  };

  const setBrand = (newBrand: ThemeBrand) => {
    setBrandState(newBrand);
  };

  const toggleMode = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextValue = {
    mode,
    brand,
    setMode,
    setBrand,
    toggleMode,
  };

  // Generate inline CSS variables for brand theme (if provided)
  const brandCSSVars = brandTheme ? generateBrandCSSVariables(brandTheme) : undefined;

  // Prevent flash of wrong theme on SSR by rendering with default theme until mounted
  if (!mounted) {
    return (
      <div
        data-theme={colorScheme}
        data-brand={initialBrand}
        className={className}
        style={brandCSSVars}
      >
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-theme={mode}
        data-brand={brand}
        className={className}
        style={brandCSSVars}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * SSR-Compatible ThemeProvider Component
 *
 * This component provides theming via:
 * 1. data-theme attribute for light/dark mode switching
 * 2. data-brand attribute for brand theme switching (default/bsf)
 * 3. Inline CSS variables for optional custom brand theme overrides
 *
 * **Two modes of operation:**
 *
 * ### Static Mode (default, SSR-compatible)
 * - No React Context
 * - No hooks
 * - Theme set via props only
 * - Perfect for SSR/SSG
 *
 * ### Stateful Mode (enableHooks=true)
 * - React Context with useTheme hook
 * - Runtime theme switching
 * - localStorage persistence
 * - Client-side only
 *
 * @example
 * // Static usage (SSR-safe)
 * <ThemeProvider colorScheme="dark" brand="default">
 *   <App />
 * </ThemeProvider>
 *
 * @example
 * // Stateful usage with hooks
 * <ThemeProvider enableHooks colorScheme="light" brand="default">
 *   <App />
 * </ThemeProvider>
 *
 * // Then in components:
 * function ThemeSwitcher() {
 *   const { mode, toggleMode, brand, setBrand } = useTheme();
 *   return <button onClick={toggleMode}>Toggle theme</button>;
 * }
 *
 * @example
 * // Custom brand theme with inline CSS variables
 * <ThemeProvider brandTheme={customBrandTheme} colorScheme="dark">
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider(props: ThemeProviderProps) {
  if (props.enableHooks) {
    return <StatefulThemeProvider {...props} />;
  }

  // Static mode (original SSR-compatible behavior)
  const {
    children,
    brandTheme,
    colorScheme = 'light',
    brand = 'default',
    className,
  } = props;

  const brandCSSVars = brandTheme ? generateBrandCSSVariables(brandTheme) : undefined;

  // Use brandTheme.id if provided, otherwise use brand prop
  const brandId = brandTheme?.id || brand;

  return (
    <div
      data-theme={colorScheme}
      data-brand={brandId}
      className={className}
      style={brandCSSVars}
    >
      {children}
    </div>
  );
}

/**
 * useTheme Hook
 *
 * Access the current theme context to read or update theme settings.
 * Only works when ThemeProvider has enableHooks=true.
 *
 * @throws {Error} If used outside of ThemeProvider or if enableHooks is false
 *
 * @example
 * function ThemeSwitcher() {
 *   const { mode, toggleMode, brand, setBrand } = useTheme();
 *
 *   return (
 *     <div>
 *       <button onClick={toggleMode}>
 *         Switch to {mode === 'light' ? 'dark' : 'light'} mode
 *       </button>
 *       <select value={brand} onChange={(e) => setBrand(e.target.value as ThemeBrand)}>
 *         <option value="default">Default Brand</option>
 *         <option value="bsf">BSF Brand</option>
 *       </select>
 *     </div>
 *   );
 * }
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider with enableHooks=true'
    );
  }
  return context;
};
