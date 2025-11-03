/**
 * Design System Tokens
 *
 * Re-exports design tokens from the generated themes for use in stories and documentation.
 */

import { defaultLightTheme } from '../src/themes/index';

// Export tokens from the default light theme
const theme = defaultLightTheme;

export const colors = theme.colors;
export const spacing = theme.space;
export const radii = theme.radii;
export const shadows = theme.shadows;
export const fontFamilies = theme.fonts;
export const fontSizes = theme.fontSizes;
export const fontWeights = theme.fontWeights;
export const lineHeights = theme.lineHeights;
export const letterSpacings = theme.letterSpacings || {};

// Re-export the theme itself for reference
export const defaultTheme = theme;
export type { Theme as DefaultTheme } from '../src/themes/index';
