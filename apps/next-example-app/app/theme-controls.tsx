'use client';

import { useState } from 'react';
import { Button } from '@mond-design-system/theme/Button';
import type { BrandTheme } from '@mond-design-system/theme/ThemeProvider';

interface ThemeControlsProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
  onBrandChange: (brand: BrandTheme | undefined) => void;
}

// BSF Brand Theme
const bsfBrandTheme: BrandTheme = {
  id: 'bsf',
  name: 'BSF Brand',
  description: 'Bright Star Financial brand theme',
  colors: {
    brand: {
      primary: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444', // Red primary
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      secondary: {
        500: '#8b5cf6', // Purple secondary
        600: '#7c3aed',
        700: '#6d28d9',
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

export function ThemeControls({ onThemeChange, onBrandChange }: ThemeControlsProps) {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [currentBrand, setCurrentBrand] = useState<'default' | 'bsf'>('default');

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    onThemeChange(newTheme);
  };

  const toggleBrand = () => {
    const newBrand = currentBrand === 'default' ? 'bsf' : 'default';
    setCurrentBrand(newBrand);
    onBrandChange(newBrand === 'bsf' ? bsfBrandTheme : undefined);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
      <Button onClick={toggleTheme} variant="outline" size="sm">
        Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
      </Button>
      <Button onClick={toggleBrand} variant="outline" size="sm">
        Switch to {currentBrand === 'default' ? 'BSF' : 'Default'} Brand
      </Button>
    </div>
  );
}
