'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MdsThemeProvider } from '@mond-design-system/theme';
import { violetBrand } from '../theme/violet-brand';

type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  colorScheme: ColorScheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface AppThemeProviderProps {
  children: ReactNode;
}

/**
 * AppThemeProvider
 *
 * Wraps the MDS ThemeProvider with violet brand theme and manages theme state.
 * Uses localStorage to persist theme preference across sessions.
 */
export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ColorScheme | null;
    if (savedTheme) {
      setColorScheme(savedTheme);
    }
    setMounted(true);
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', colorScheme);
    }
  }, [colorScheme, mounted]);

  // Apply data-theme attribute to html element for CSS variable switching
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', colorScheme);
    }
  }, [colorScheme, mounted]);

  const toggleTheme = () => {
    setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme }}>
      <MdsThemeProvider colorScheme={colorScheme} brandTheme={violetBrand}>
        {children}
      </MdsThemeProvider>
    </ThemeContext.Provider>
  );
}

/**
 * useTheme hook
 *
 * Custom hook to access theme state and toggle function
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within AppThemeProvider');
  }
  return context;
}
