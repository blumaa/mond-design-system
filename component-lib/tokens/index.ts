/**
 * Minimal token exports for type safety
 *
 * Components now use CSS variables for styling, but some still need
 * token values for TypeScript types or programmatic calculations.
 */

import spacingTokens from './tokens/spacing.json';
import typographyTokens from './tokens/typography.json';
import radiiTokens from './tokens/radii.json';
import colorsTokens from './tokens/colors.json';
import shadowsTokens from './tokens/shadows.json';

export const spacing = spacingTokens.spacing;
export const fontFamilies = typographyTokens.fontFamilies;
export const fontSizes = typographyTokens.fontSizes;
export const fontWeights = typographyTokens.fontWeights;
export const lineHeights = typographyTokens.lineHeights;
export const letterSpacings = typographyTokens.letterSpacings;
export const radii = radiiTokens.radii;
export const colors = colorsTokens.colors;
export const shadows = shadowsTokens.shadows;

// Legacy export for components that haven't been fully migrated
export const tokens = {
  spacing: spacingTokens.spacing,
  fontFamilies: typographyTokens.fontFamilies,
  fontSizes: typographyTokens.fontSizes,
  fontWeights: typographyTokens.fontWeights,
  lineHeights: typographyTokens.lineHeights,
  letterSpacings: typographyTokens.letterSpacings,
  radii: radiiTokens.radii,
};

// Utility type to extract all color values (hex codes) from the colors object
type ExtractColorValues<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: T[K] extends string
        ? T[K]
        : ExtractColorValues<T[K]>
    }[keyof T]
  : never;

export type ColorValue = ExtractColorValues<typeof colors> | 'currentColor';
