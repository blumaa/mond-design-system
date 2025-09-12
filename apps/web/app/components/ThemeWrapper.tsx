'use client';
import React, { useState, createContext, useContext } from 'react';
import { ThemeProvider } from "@mond-design-system/theme";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeWrapper');
  }
  return context;
};

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider colorScheme={isDarkMode ? 'dark' : 'light'}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}