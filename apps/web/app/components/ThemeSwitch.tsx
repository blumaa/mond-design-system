"use client";

import { useTheme } from '../context/ThemeContext';
import { LightBulbIcon } from './LightBulbIcon';
import { Button, colors } from '@mond-design-system/theme';

export const ThemeSwitch = () => {
  const { isDarkMode, toggleTheme, mounted } = useTheme();

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 1000,
        width: '40px',
        height: '40px',
      }} />
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      left: '1rem',
      zIndex: 1000,
    }}>
      <Button
        key={isDarkMode ? 'dark' : 'light'} // Force re-render when theme changes
        variant="outline"
        size="md"
        iconOnly
        corners="rounded-full"
        onClick={toggleTheme}
      >
        <LightBulbIcon size={20} isLightOn={isDarkMode} />
      </Button>
    </div>
  );
};
