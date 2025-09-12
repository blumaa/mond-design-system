'use client';
import React from 'react';
import { Switch, Box } from "@mond-design-system/theme";
import { useTheme } from './ThemeWrapper';

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Box
      style={{ 
        position: 'fixed', 
        top: '1rem', 
        left: '1rem', 
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
      }}
      display="flex"
      alignItems="center"
      gap={2}
      p={2}
      bg="surface.elevated"
      borderRadius="md"
      border="1px solid"
      borderColor="border.default"
    >
      <Box
        fontSize={14}
        fontWeight="medium"
        color="text.primary"
      >
        {isDarkMode ? '🌙' : '☀️'}
      </Box>
      <Switch 
        checked={isDarkMode}
        onChange={toggleDarkMode}
        size="sm"
      />
    </Box>
  );
}