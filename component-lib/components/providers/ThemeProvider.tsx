'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { themes, type Theme as ThemeObject, type Brand, type Mode } from '../../src/themes';

/**
 * Theme context value for hooks
 */
export interface ThemeContextValue {
  mode: Mode;
  brand: Brand;
  setMode: (mode: Mode) => void;
  setBrand: (brand: Brand) => void;
  toggleMode: () => void;
  currentTheme: ThemeObject;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Props for the ThemeProvider
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Color scheme (light/dark mode)
   * @default 'light'
   */
  colorScheme?: Mode;
  /**
   * Brand ('default' or 'bsf')
   * @default 'default'
   */
  brand?: Brand;
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
}

/**
 * Stateful ThemeProvider with hooks support
 */
function StatefulThemeProvider({
  children,
  colorScheme = 'light',
  brand: initialBrand = 'default',
  enablePersistence = true,
  storageKeyMode = 'mond-theme-mode',
  storageKeyBrand = 'mond-theme-brand',
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<Mode>(colorScheme);
  const [brand, setBrandState] = useState<Brand>(initialBrand);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount (client-side only)
  useEffect(() => {
    if (!enablePersistence) {
      setMounted(true);
      return;
    }

    const storedMode = localStorage.getItem(storageKeyMode) as Mode | null;
    const storedBrand = localStorage.getItem(storageKeyBrand) as Brand | null;

    if (storedMode && (storedMode === 'light' || storedMode === 'dark')) {
      setModeState(storedMode);
    }

    if (storedBrand && (storedBrand === 'default' || storedBrand === 'bsf')) {
      setBrandState(storedBrand);
    }

    setMounted(true);
  }, [enablePersistence, storageKeyMode, storageKeyBrand]);

  // Persist theme to localStorage
  useEffect(() => {
    if (!mounted || !enablePersistence) return;

    localStorage.setItem(storageKeyMode, mode);
    localStorage.setItem(storageKeyBrand, brand);
  }, [mode, brand, mounted, enablePersistence, storageKeyMode, storageKeyBrand]);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
  };

  const setBrand = (newBrand: Brand) => {
    setBrandState(newBrand);
  };

  const toggleMode = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Get the current theme object based on brand and mode
  const currentTheme = themes[brand][mode];

  const value: ThemeContextValue = {
    mode,
    brand,
    setMode,
    setBrand,
    toggleMode,
    currentTheme,
  };

  // Prevent flash of wrong theme on SSR by rendering with default theme until mounted
  if (!mounted) {
    const initialTheme = themes[initialBrand][colorScheme];
    return (
      <StyledThemeProvider theme={initialTheme}>
        {children}
      </StyledThemeProvider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

/**
 * ThemeProvider Component
 *
 * Provides theming via styled-components ThemeProvider with auto-generated theme objects.
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
 */
export function ThemeProvider(props: ThemeProviderProps) {
  if (props.enableHooks) {
    return <StatefulThemeProvider {...props} />;
  }

  // Static mode (SSR-compatible)
  const {
    children,
    colorScheme = 'light',
    brand = 'default',
  } = props;

  const theme = themes[brand][colorScheme];

  return (
    <StyledThemeProvider theme={theme}>
      {children}
    </StyledThemeProvider>
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
 *       <select value={brand} onChange={(e) => setBrand(e.target.value as Brand)}>
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

// Re-export types for convenience
export type { Brand, Mode, ThemeObject as Theme };
