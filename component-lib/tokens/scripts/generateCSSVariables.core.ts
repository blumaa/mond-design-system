import { tokens } from '../tokens';
import { resolveSemanticToken, type Theme } from '../../utils/themeResolver';

/**
 * Core logic for CSS variable generation - separated for testability
 */

export interface CSSVariables {
  light: Map<string, string>;
  dark: Map<string, string>;
}

/**
 * Recursively traverse semantic tokens and collect CSS variable definitions
 */
export function traverseSemanticTokens(
  obj: Record<string, unknown>,
  path: string[] = [],
  cssVars: CSSVariables,
  theme: Theme
): void {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...path, key];
    const tokenPath = currentPath.join('.');

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Check if this object has light/dark theme variants
      if ('light' in value && 'dark' in value) {
        // This is a theme-aware semantic token - resolve it
        try {
          const resolvedValue = resolveSemanticToken(tokenPath, theme);
          const cssVarName = `--mond-${currentPath.join('-')}`;

          if (theme === 'light') {
            cssVars.light.set(cssVarName, resolvedValue);
          } else {
            cssVars.dark.set(cssVarName, resolvedValue);
          }
        } catch (error) {
          console.warn(`⚠️  Failed to resolve semantic token: ${tokenPath}`, error);
        }
      } else {
        // Keep traversing nested objects
        traverseSemanticTokens(value as Record<string, unknown>, currentPath, cssVars, theme);
      }
    } else if (typeof value === 'string') {
      // Direct string value (non-theme-aware token)
      try {
        const resolvedValue = resolveSemanticToken(tokenPath, theme);
        const cssVarName = `--mond-${currentPath.join('-')}`;

        if (theme === 'light') {
          cssVars.light.set(cssVarName, resolvedValue);
        } else {
          cssVars.dark.set(cssVarName, resolvedValue);
        }
      } catch (error) {
        // Skip non-semantic tokens
      }
    }
  }
}

/**
 * Generate base brand color CSS variables
 * These are the foundational brand colors that can be overridden at runtime
 */
function generateBrandColorVariables(cssVars: CSSVariables): void {
  const brandColors = tokens.colors.brand as Record<string, Record<string, string>>;

  Object.entries(brandColors).forEach(([colorType, colorScale]) => {
    Object.entries(colorScale).forEach(([shade, value]) => {
      const cssVarName = `--mond-color-brand-${colorType}-${shade}`;
      // Add to light theme (these are base values that can be overridden)
      cssVars.light.set(cssVarName, value);
    });
  });
}

/**
 * Generate CSS variables from all token types
 */
export function generateAllCSSVariables(): CSSVariables {
  const cssVars: CSSVariables = {
    light: new Map(),
    dark: new Map(),
  };

  // FIRST: Generate base brand color variables
  // These must be defined before semantic tokens so they can be referenced
  generateBrandColorVariables(cssVars);

  // Process semantic tokens for both themes
  traverseSemanticTokens(tokens.semantic, [], cssVars, 'light');
  traverseSemanticTokens(tokens.semantic, [], cssVars, 'dark');

  // Add static tokens (theme-independent)
  // These only need to be defined once in :root

  // Spacing tokens
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    cssVars.light.set(`--mond-spacing-${key}`, value);
  });

  // Radii tokens
  Object.entries(tokens.radii).forEach(([key, value]) => {
    cssVars.light.set(`--mond-radii-${key}`, value);
  });

  // Shadow tokens
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    cssVars.light.set(`--mond-shadow-${key}`, value);
  });

  // Font family tokens
  Object.entries(tokens.fontFamilies).forEach(([key, value]) => {
    cssVars.light.set(`--mond-font-family-${key}`, value);
  });

  // Font size tokens
  Object.entries(tokens.fontSizes).forEach(([key, value]) => {
    cssVars.light.set(`--mond-font-size-${key}`, value);
  });

  // Font weight tokens
  Object.entries(tokens.fontWeights).forEach(([key, value]) => {
    cssVars.light.set(`--mond-font-weight-${key}`, value);
  });

  // Line height tokens
  Object.entries(tokens.lineHeights).forEach(([key, value]) => {
    cssVars.light.set(`--mond-line-height-${key}`, value);
  });

  // Letter spacing tokens
  Object.entries(tokens.letterSpacings).forEach(([key, value]) => {
    cssVars.light.set(`--mond-letter-spacing-${key}`, value);
  });

  return cssVars;
}

/**
 * Format CSS variables as CSS string
 */
export function formatCSSVariables(variables: Map<string, string>, indent: string = '  '): string {
  const sorted = Array.from(variables.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  return sorted.map(([name, value]) => `${indent}${name}: ${value};`).join('\n');
}

/**
 * Generate complete CSS file content
 */
export function generateCSSContent(): string {
  const cssVars = generateAllCSSVariables();

  const header = `/**
 * Mond Design System - Theme CSS Variables
 *
 * Auto-generated from design tokens.
 * Do not edit this file manually - run 'yarn build:css' to regenerate.
 *
 * Generated: ${new Date().toISOString()}
 */

`;

  const lightTheme = `:root,
[data-theme="light"] {
${formatCSSVariables(cssVars.light)}
}`;

  const darkTheme = `
[data-theme="dark"] {
${formatCSSVariables(cssVars.dark)}
}`;

  return header + lightTheme + darkTheme;
}
