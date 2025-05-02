import React from 'react';
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from '@storybook/addon-themes';

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
        { name: 'light', class: '', color: '#F2F3F4' },
        { name: 'dark', class: 'dark', color: '#27374D' },
      ],
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story: any, context: any) => {
      const isDark = context.globals.theme === 'dark';
      return (
        <div
          style={{
            padding: '3rem',
            backgroundColor: isDark ? '#27374D' : '#F2F3F4',
            minHeight: '100vh',
            transition: 'background-color 0.2s',
          }}
        >
          <Story args={{ ...context.args, isDarkMode: isDark }} />
        </div>
      );
    },
  ],
};

export default preview; 