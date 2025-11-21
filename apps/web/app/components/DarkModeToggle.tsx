'use client';
import React from 'react';
import { Box } from "@mond-design-system/theme";
import { Switch } from "@mond-design-system/theme/client";
import { useTheme } from './ThemeWrapper';

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        borderRadius: '0.5rem',
      }}
    >
      <Box
        padding="2"
        display="flex"
        alignItems="center"
        gap="xs"
        border="default"
        corners="rounded-md"
      >
        <span style={{ fontSize: 14, fontWeight: 500 }}>
          {isDarkMode ? '🌙' : '☀️'}
        </span>
        <Switch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size="sm"
        />
      </Box>
    </div>
  );
}