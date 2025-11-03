/**
 * Mond Design System - Theme Exports
 *
 * Auto-generated theme objects for styled-components.
 * Each theme includes all design tokens organized by category.
 *
 * Usage:
 * ```tsx
 * import { ThemeProvider } from '@xstyled/styled-components';
 * import { defaultLightTheme, defaultDarkTheme } from '@mond-design-system/theme';
 *
 * function App() {
 *   const [theme, setTheme] = useState(defaultLightTheme);
 *
 *   return (
 *     <ThemeProvider theme={theme}>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

import { theme as defaultLight } from '../../dist/themes/default-light.js';
import { theme as defaultDark } from '../../dist/themes/default-dark.js';
import { theme as bsfLight } from '../../dist/themes/bsf-light.js';
import { theme as bsfDark } from '../../dist/themes/bsf-dark.js';

// Default brand themes
export const defaultLightTheme = defaultLight;
export const defaultDarkTheme = defaultDark;

// BSF brand themes
export const bsfLightTheme = bsfLight;
export const bsfDarkTheme = bsfDark;

// Theme collections for easy switching
export const themes = {
  default: {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
  },
  bsf: {
    light: bsfLightTheme,
    dark: bsfDarkTheme,
  },
};

// Type definitions
export type Theme = typeof defaultLightTheme;
export type Brand = 'default' | 'bsf';
export type Mode = 'light' | 'dark';
