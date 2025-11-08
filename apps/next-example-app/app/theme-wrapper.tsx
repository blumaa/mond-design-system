'use client';

import { useState } from 'react';
import { ThemeProvider, type BrandTheme } from '@mond-design-system/theme';
import { ThemeControls } from './theme-controls';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [brandTheme, setBrandTheme] = useState<BrandTheme | undefined>(undefined);

  return (
    <ThemeProvider colorScheme={theme} brandTheme={brandTheme}>
      <div style={{ padding: '2rem' }}>
        <ThemeControls onThemeChange={setTheme} onBrandChange={setBrandTheme} />
        {children}
      </div>
    </ThemeProvider>
  );
}
