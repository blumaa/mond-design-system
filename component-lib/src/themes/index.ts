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

import { theme as defaultLight } from '../../dist/themes/default-light';
import { theme as defaultDark } from '../../dist/themes/default-dark';
import { theme as bsfLight } from '../../dist/themes/bsf-light';
import { theme as bsfDark } from '../../dist/themes/bsf-dark';

// Default brand themes
export const defaultLightTheme = defaultLight;
export const defaultDarkTheme = defaultDark;

// BSF brand themes
export const bsfLightTheme = bsfLight;
export const bsfDarkTheme = bsfDark;

// Type definitions - define the shape of a theme
export interface Theme {
  colors: {
    [key: string]: string;
  };
  space: {
    [key: string]: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeights: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  lineHeights: {
    none: string;
    tight: string;
    normal: string;
    relaxed: string;
  };
  letterSpacings: {
    tight: string;
    normal: string;
    wide: string;
  };
  radii: {
    [key: string]: string;
  };
  shadows: {
    [key: string]: string;
  };
}

export type Brand = 'default' | 'bsf';
export type Mode = 'light' | 'dark';

// Theme collections for easy switching
export const themes: Record<Brand, Record<Mode, Theme>> = {
  default: {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
  },
  bsf: {
    light: bsfLightTheme,
    dark: bsfDarkTheme,
  },
};
