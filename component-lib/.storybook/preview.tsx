import React from 'react';
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from '@storybook/addon-themes';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import './styles.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: 'light', color: '#F2F3F4' },
        { name: 'dark', class: 'dark', color: '#27374D' },
      ],
    },
    backgrounds: {
      disable: true,
      grid: {
        disable: true
      }
    },
  },
  globalTypes: {
    brand: {
      description: 'Brand theme',
      defaultValue: 'default',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default', left: '🏢' },
          { value: 'bsf', title: 'BSF', left: '🌲' },
          { value: 'mond', title: 'MOND (Legacy)', left: '📦' },
          { value: 'cypher', title: 'CYPHER (Legacy)', left: '🔋' },
          { value: 'flux', title: 'FLUX (Legacy)', left: '🎉' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story: any, context: any) => {
      const isDark = context.globals.theme === 'dark';
      const selectedBrandId = context.globals.brand || 'default';

      // Map legacy brands to default for now (until they're migrated)
      const brandMap: Record<string, 'default' | 'bsf'> = {
        default: 'default',
        bsf: 'bsf',
        mond: 'default',  // Legacy - map to default
        cypher: 'default', // Legacy - map to default
        flux: 'default',   // Legacy - map to default
      };

      const brand = brandMap[selectedBrandId] || 'default';

      return (
        <ThemeProvider
          brand={brand}
          colorScheme={isDark ? 'dark' : 'light'}
        >
          <div
            style={{
              padding: '3rem',
              minHeight: '100vh',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Story args={{ ...context.args }} />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview; 
