import React from 'react';
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from '@storybook/addon-themes';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { mondTheme, cypherTheme, fluxTheme } from '../brands';
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
      defaultValue: 'mond',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'mond', title: 'MOND', left: '🏢' },
          { value: 'cypher', title: 'CYPHER', left: '🔋' },
          { value: 'flux', title: 'FLUX', left: '🎉' },
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
      const selectedBrandId = context.globals.brand || 'mond';
      
      // Map brand IDs to brand theme objects
      const brandThemes = {
        mond: mondTheme,
        cypher: cypherTheme,
        flux: fluxTheme,
      };
      
      const brandTheme = brandThemes[selectedBrandId as keyof typeof brandThemes] || mondTheme;
      
      return (
        <ThemeProvider 
          brandTheme={brandTheme}
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
