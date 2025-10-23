#!/usr/bin/env node
/**
 * Simple Token → CSS Variable Generator
 *
 * Replaces the complex 360-line token resolution system with a clean, straightforward approach.
 * Reads JSON tokens and outputs CSS variables with proper theme selectors.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tokensDir = resolve(__dirname, '../tokens');
const distDir = resolve(__dirname, '../../dist');

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Load all token files
const colors = JSON.parse(readFileSync(resolve(tokensDir, 'colors.json'), 'utf-8'));
const spacing = JSON.parse(readFileSync(resolve(tokensDir, 'spacing.json'), 'utf-8'));
const typography = JSON.parse(readFileSync(resolve(tokensDir, 'typography.json'), 'utf-8'));
const radii = JSON.parse(readFileSync(resolve(tokensDir, 'radii.json'), 'utf-8'));
const shadows = JSON.parse(readFileSync(resolve(tokensDir, 'shadows.json'), 'utf-8'));
const semantic = JSON.parse(readFileSync(resolve(tokensDir, 'semantic.json'), 'utf-8'));

/**
 * Resolve a single token path like "gray.600" to its value
 */
function resolveTokenPath(path: string): string {
  const parts = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = colors.colors;

  for (const part of parts) {
    value = value?.[part];
    if (value === undefined) {
      throw new Error(`Failed to resolve token path: ${path}`);
    }
  }

  return value;
}

/**
 * Resolve a token reference or value
 * Handles:
 * - Simple references: "gray.600"
 * - Raw values: "#ffffff", "rgba(...)", "none", "1rem"
 * - Complex values with embedded references: "linear-gradient(135deg, white.50 0%, gray.100 100%)"
 */
function resolveReference(reference: string): string {
  // Check if it's a gradient or other function with embedded references
  if (reference.startsWith('linear-gradient(') || reference.startsWith('radial-gradient(')) {
    // Find all token references (words with dots that aren't inside parentheses)
    return reference.replace(/\b([a-z]+\.[a-z0-9.]+)\b/g, (match) => {
      try {
        return resolveTokenPath(match);
      } catch {
        return match; // If it fails, leave it as-is
      }
    });
  }

  // Check if this is a raw CSS value (not a reference)
  const isCSSValue =
    reference.startsWith('rgba(') ||
    reference.startsWith('rgb(') ||
    reference.startsWith('#') ||
    reference.includes(' ') || // Multiple values like box-shadow
    reference === 'none' ||
    reference === 'transparent' ||
    /^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|s|ms)$/.test(reference) || // CSS units (including negative)
    /^-?\d+(\.\d+)?$/.test(reference) || // Plain numbers (including negative)
    /^"[^"]*"$/.test(reference) || // Quoted strings
    /^'[^']*'$/.test(reference); // Quoted strings

  if (isCSSValue) {
    return reference;
  }

  // It's a simple reference, resolve it
  return resolveTokenPath(reference);
}

/**
 * Recursively traverse semantic tokens and collect CSS variables
 */
function traverseSemanticTokens(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any>,
  path: string[] = [],
  lightVars: Map<string, string>,
  darkVars: Map<string, string>
): void {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...path, key];

    if (value && typeof value === 'object') {
      // Check if this has light/dark theme variants
      if ('light' in value && 'dark' in value) {
        const cssVarName = `--mond-${currentPath.join('-')}`;
        const lightValue = resolveReference(value.light);
        const darkValue = resolveReference(value.dark);

        lightVars.set(cssVarName, lightValue);
        darkVars.set(cssVarName, darkValue);
      } else {
        // Keep traversing
        traverseSemanticTokens(value, currentPath, lightVars, darkVars);
      }
    } else if (typeof value === 'string') {
      // Direct string value
      const cssVarName = `--mond-${currentPath.join('-')}`;
      const resolvedValue = value.includes('.') ? resolveReference(value) : value;

      lightVars.set(cssVarName, resolvedValue);
      darkVars.set(cssVarName, resolvedValue);
    }
  }
}

/**
 * Add static tokens (theme-independent)
 */
function addStaticTokens(vars: Map<string, string>): void {
  // Spacing
  for (const [key, value] of Object.entries(spacing.spacing)) {
    vars.set(`--mond-spacing-${key}`, String(value));
  }

  // Typography
  if (typography.fontFamilies) {
    for (const [key, value] of Object.entries(typography.fontFamilies)) {
      vars.set(`--mond-font-family-${key}`, String(value));
    }
  }

  if (typography.fontSizes) {
    for (const [key, value] of Object.entries(typography.fontSizes)) {
      vars.set(`--mond-font-size-${key}`, String(value));
    }
  }

  if (typography.fontWeights) {
    for (const [key, value] of Object.entries(typography.fontWeights)) {
      vars.set(`--mond-font-weight-${key}`, String(value));
    }
  }

  if (typography.lineHeights) {
    for (const [key, value] of Object.entries(typography.lineHeights)) {
      vars.set(`--mond-line-height-${key}`, String(value));
    }
  }

  if (typography.letterSpacings) {
    for (const [key, value] of Object.entries(typography.letterSpacings)) {
      vars.set(`--mond-letter-spacing-${key}`, String(value));
    }
  }

  // Radii
  for (const [key, value] of Object.entries(radii.radii)) {
    vars.set(`--mond-radii-${key}`, String(value));
  }

  // Shadows
  for (const [key, value] of Object.entries(shadows.shadows)) {
    vars.set(`--mond-shadow-${key}`, String(value));
  }
}

/**
 * Generate CSS content
 */
function generateCSS(): string {
  const lightVars = new Map<string, string>();
  const darkVars = new Map<string, string>();

  // Process semantic tokens
  traverseSemanticTokens(semantic.semantic, [], lightVars, darkVars);

  // Add static tokens (same for both themes)
  addStaticTokens(lightVars);

  // Sort variables alphabetically
  const sortedLight = Array.from(lightVars.entries()).sort(([a], [b]) => a.localeCompare(b));

  // Generate CSS
  const header = `/**
 * Mond Design System - Theme CSS Variables
 *
 * Auto-generated from design tokens.
 * Do not edit this file manually - run 'yarn build:tokens' to regenerate.
 *
 * Generated: ${new Date().toISOString()}
 */

`;

  const lightBlock = `:root,
[data-theme="light"] {
${sortedLight.map(([name, value]) => `  ${name}: ${value};`).join('\n')}
}

`;

  // Only include theme-aware variables in dark theme (not static tokens)
  const darkOnlyVars = Array.from(darkVars.entries())
    .filter(([name]) => !lightVars.has(name) || lightVars.get(name) !== darkVars.get(name))
    .sort(([a], [b]) => a.localeCompare(b));

  const darkBlock = `[data-theme="dark"] {
${darkOnlyVars.map(([name, value]) => `  ${name}: ${value};`).join('\n')}
}
`;

  return header + lightBlock + darkBlock;
}

// Main execution
try {
  console.log('🎨 Generating CSS variables from design tokens...\n');

  const css = generateCSS();
  const outputPath = resolve(distDir, 'theme.css');

  writeFileSync(outputPath, css, 'utf-8');

  const varCount = (css.match(/--mond-/g) || []).length;
  const sizeKB = (Buffer.byteLength(css, 'utf-8') / 1024).toFixed(2);

  console.log('✅ Successfully generated CSS variables!');
  console.log(`   📄 Output: ${outputPath}`);
  console.log(`   🎯 Variables: ${varCount}`);
  console.log(`   📦 Size: ${sizeKB} KB\n`);
} catch (error) {
  console.error('❌ Failed to generate CSS variables:');
  console.error(error);
  process.exit(1);
}
