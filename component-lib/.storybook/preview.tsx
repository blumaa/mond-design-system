import React from 'react';
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from '@storybook/addon-themes';
import { themes } from '@storybook/theming';
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
    docs: {
      theme: themes.light,
    }
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
      return (
        <div
          className={isDark ? 'dark' : 'light'}
          style={{
            padding: '3rem',
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-color)',
            minHeight: '100vh',
            transition: 'all 0.2s',
          }}
        >
          <Story args={{ ...context.args, isDarkMode: isDark }} />
        </div>
      );
    },
  ],
};

export default preview; 