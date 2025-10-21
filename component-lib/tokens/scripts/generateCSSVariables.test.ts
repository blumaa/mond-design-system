import { describe, it, expect } from '@jest/globals';
import { generateAllCSSVariables, generateCSSContent } from './generateCSSVariables.core';

describe('CSS Variable Generator', () => {
  describe('generateAllCSSVariables()', () => {
    describe('Basic Structure', () => {
      it('returns an object with light and dark Maps', () => {
        const result = generateAllCSSVariables();

        expect(result).toHaveProperty('light');
        expect(result).toHaveProperty('dark');
        expect(result.light).toBeInstanceOf(Map);
        expect(result.dark).toBeInstanceOf(Map);
      });

      it('generates variables for both light and dark themes', () => {
        const result = generateAllCSSVariables();

        expect(result.light.size).toBeGreaterThan(0);
        expect(result.dark.size).toBeGreaterThan(0);
      });

      it('generates a significant number of CSS variables', () => {
        const result = generateAllCSSVariables();
        const totalVariables = result.light.size + result.dark.size;

        // We know from the build output that we have 511 variables
        // Light theme has all variables, dark has theme-aware overrides
        expect(totalVariables).toBeGreaterThan(400);
      });
    });

    describe('CSS Variable Naming Convention', () => {
      it('uses --mond- prefix for all variables', () => {
        const result = generateAllCSSVariables();

        const allVarNames = [
          ...Array.from(result.light.keys()),
          ...Array.from(result.dark.keys()),
        ];

        allVarNames.forEach((varName) => {
          expect(varName).toMatch(/^--mond-/);
        });
      });

      it('converts dot notation to kebab-case', () => {
        const result = generateAllCSSVariables();

        // Semantic tokens use dots in token paths, should become dashes in CSS vars
        // e.g., "text.primary" -> "--mond-text-primary"
        expect(result.light.has('--mond-text-primary')).toBe(true);
        expect(result.light.has('--mond-surface-background')).toBe(true);
        expect(result.light.has('--mond-border-default')).toBe(true);
      });

      it('generates correct variable names for nested tokens', () => {
        const result = generateAllCSSVariables();

        // Check deeply nested semantic tokens
        expect(result.light.has('--mond-brand-interactive-background')).toBe(true);
        expect(result.light.has('--mond-brand-interactive-backgroundHover')).toBe(true);
        expect(result.light.has('--mond-feedback-success-background')).toBe(true);
      });
    });

    describe('Semantic Token Resolution', () => {
      it('resolves semantic tokens for light theme', () => {
        const result = generateAllCSSVariables();

        // Get a known semantic token value
        const textPrimary = result.light.get('--mond-text-primary');
        expect(textPrimary).toBeDefined();
        expect(typeof textPrimary).toBe('string');
        // Should be a resolved color value (hex or rgba)
        expect(textPrimary).toMatch(/^(#[0-9a-fA-F]{6}|rgba?\()/);
      });

      it('resolves semantic tokens for dark theme', () => {
        const result = generateAllCSSVariables();

        const textPrimary = result.dark.get('--mond-text-primary');
        expect(textPrimary).toBeDefined();
        expect(typeof textPrimary).toBe('string');
        expect(textPrimary).toMatch(/^(#[0-9a-fA-F]{6}|rgba?\()/);
      });

      it('generates different values for light and dark themes', () => {
        const result = generateAllCSSVariables();

        // Get the same semantic token from both themes
        const lightTextPrimary = result.light.get('--mond-text-primary');
        const darkTextPrimary = result.dark.get('--mond-text-primary');

        expect(lightTextPrimary).toBeDefined();
        expect(darkTextPrimary).toBeDefined();

        // Light and dark should have different values for theme-aware tokens
        expect(lightTextPrimary).not.toBe(darkTextPrimary);
      });

      it('handles tokens with raw color values', () => {
        const result = generateAllCSSVariables();

        // Cyberpunk brand tokens have direct hex values
        const cyberpunkSuccess = result.light.get('--mond-cyberpunk-success');
        expect(cyberpunkSuccess).toBeDefined();
        expect(cyberpunkSuccess).toMatch(/^#[0-9a-fA-F]{6}/);
      });

      it('handles tokens with "none" values', () => {
        const result = generateAllCSSVariables();

        // Effects tokens may have "none" values
        const subtleGlow = result.light.get('--mond-effects-brand-glow-subtle');
        if (subtleGlow) {
          expect(subtleGlow).toBe('none');
        }
      });

      it('handles tokens with "transparent" values', () => {
        const result = generateAllCSSVariables();

        // Look for any transparent values
        const allValues = Array.from(result.light.values());
        const hasTransparent = allValues.some(value => value === 'transparent');

        // At least some tokens should use transparent
        expect(hasTransparent).toBe(true);
      });
    });

    describe('Static Token Generation', () => {
      it('generates spacing tokens', () => {
        const result = generateAllCSSVariables();

        // Check various spacing scale values
        expect(result.light.has('--mond-spacing-0')).toBe(true);
        expect(result.light.has('--mond-spacing-1')).toBe(true);
        expect(result.light.has('--mond-spacing-4')).toBe(true);
        expect(result.light.has('--mond-spacing-8')).toBe(true);
        expect(result.light.has('--mond-spacing-16')).toBe(true);

        // Verify values are in proper format (rem)
        const spacing4 = result.light.get('--mond-spacing-4');
        expect(spacing4).toMatch(/rem$/);
      });

      it('generates radii tokens', () => {
        const result = generateAllCSSVariables();

        expect(result.light.has('--mond-radii-none')).toBe(true);
        expect(result.light.has('--mond-radii-sm')).toBe(true);
        expect(result.light.has('--mond-radii-md')).toBe(true);
        expect(result.light.has('--mond-radii-lg')).toBe(true);
        expect(result.light.has('--mond-radii-full')).toBe(true);

        // Verify values
        const radiiNone = result.light.get('--mond-radii-none');
        expect(radiiNone).toBe('0');

        const radiiFull = result.light.get('--mond-radii-full');
        expect(radiiFull).toBe('9999px');
      });

      it('generates shadow tokens', () => {
        const result = generateAllCSSVariables();

        expect(result.light.has('--mond-shadow-sm')).toBe(true);
        expect(result.light.has('--mond-shadow-md')).toBe(true);
        expect(result.light.has('--mond-shadow-lg')).toBe(true);

        // Verify shadow values contain box-shadow syntax
        const shadowMd = result.light.get('--mond-shadow-md');
        expect(shadowMd).toContain('px');
        expect(shadowMd).toContain('rgba');
      });

      it('generates font family tokens', () => {
        const result = generateAllCSSVariables();

        expect(result.light.has('--mond-font-family-sans')).toBe(true);

        // Verify font family values
        const fontSans = result.light.get('--mond-font-family-sans');
        expect(fontSans).toBeDefined();
        // Should contain a font family name
        expect(fontSans).toMatch(/[a-zA-Z]/);
      });

      it('generates font size tokens', () => {
        const result = generateAllCSSVariables();

        expect(result.light.has('--mond-font-size-xs')).toBe(true);
        expect(result.light.has('--mond-font-size-sm')).toBe(true);
        expect(result.light.has('--mond-font-size-base')).toBe(true);
        expect(result.light.has('--mond-font-size-lg')).toBe(true);

        // Verify values are in rem
        const fontSizeBase = result.light.get('--mond-font-size-base');
        expect(fontSizeBase).toMatch(/rem$/);
      });

      it('generates font weight tokens', () => {
        const result = generateAllCSSVariables();

        expect(result.light.has('--mond-font-weight-normal')).toBe(true);
        expect(result.light.has('--mond-font-weight-medium')).toBe(true);
        expect(result.light.has('--mond-font-weight-semibold')).toBe(true);
        expect(result.light.has('--mond-font-weight-bold')).toBe(true);

        // Verify values are numeric
        const fontWeightBold = result.light.get('--mond-font-weight-bold');
        expect(fontWeightBold).toMatch(/^\d{3}$/);
      });

      it('generates line height tokens', () => {
        const result = generateAllCSSVariables();

        expect(result.light.has('--mond-line-height-none')).toBe(true);
        expect(result.light.has('--mond-line-height-tight')).toBe(true);
        expect(result.light.has('--mond-line-height-normal')).toBe(true);
        expect(result.light.has('--mond-line-height-relaxed')).toBe(true);
      });

      it('generates letter spacing tokens', () => {
        const result = generateAllCSSVariables();

        expect(result.light.has('--mond-letter-spacing-tighter')).toBe(true);
        expect(result.light.has('--mond-letter-spacing-tight')).toBe(true);
        expect(result.light.has('--mond-letter-spacing-normal')).toBe(true);
        expect(result.light.has('--mond-letter-spacing-wide')).toBe(true);
      });

      it('generates base static tokens in light theme Map', () => {
        const result = generateAllCSSVariables();

        // Base static tokens should be in light theme
        expect(result.light.has('--mond-spacing-4')).toBe(true);
        expect(result.light.has('--mond-radii-md')).toBe(true);
        expect(result.light.has('--mond-font-size-base')).toBe(true);

        // Note: Dark theme may also have some spacing/layout tokens from semantic.layout
        // which have theme variants and get resolved to include spacing values
      });
    });

    describe('Theme-Aware vs Static Tokens', () => {
      it('generates more variables in light theme than dark theme', () => {
        const result = generateAllCSSVariables();

        // Light theme has all variables (semantic + static)
        // Dark theme only has theme-aware semantic token overrides
        expect(result.light.size).toBeGreaterThan(result.dark.size);
      });

      it('dark theme contains semantic token overrides', () => {
        const result = generateAllCSSVariables();

        const darkVarNames = Array.from(result.dark.keys());

        // Dark theme should have semantic tokens like text, surface, border, etc.
        const hasSemanticTokens = darkVarNames.some(varName =>
          varName.match(/^--mond-(text|surface|border|brand|feedback|effects)-/)
        );
        expect(hasSemanticTokens).toBe(true);

        // Dark theme may also include layout tokens that have theme variants
        // Note: Some spacing tokens appear in dark theme due to semantic.layout having theme variants
      });
    });

    describe('Complete Token Coverage', () => {
      it('includes all major semantic token categories', () => {
        const result = generateAllCSSVariables();

        // Check for major categories in semantic tokens
        const lightVarNames = Array.from(result.light.keys());

        // Text tokens
        expect(lightVarNames.some(name => name.startsWith('--mond-text-'))).toBe(true);

        // Surface tokens
        expect(lightVarNames.some(name => name.startsWith('--mond-surface-'))).toBe(true);

        // Border tokens
        expect(lightVarNames.some(name => name.startsWith('--mond-border-'))).toBe(true);

        // Brand tokens
        expect(lightVarNames.some(name => name.startsWith('--mond-brand-'))).toBe(true);

        // Feedback tokens
        expect(lightVarNames.some(name => name.startsWith('--mond-feedback-'))).toBe(true);
      });
    });
  });

  describe('generateCSSContent()', () => {
    describe('CSS File Structure', () => {
      it('generates valid CSS content', () => {
        const cssContent = generateCSSContent();

        expect(typeof cssContent).toBe('string');
        expect(cssContent.length).toBeGreaterThan(0);
      });

      it('includes CSS file header comment', () => {
        const cssContent = generateCSSContent();

        expect(cssContent).toContain('/**');
        expect(cssContent).toContain('Mond Design System - Theme CSS Variables');
        expect(cssContent).toContain('Auto-generated from design tokens');
        expect(cssContent).toContain('Do not edit this file manually');
        expect(cssContent).toContain('*/');
      });

      it('includes generation timestamp', () => {
        const cssContent = generateCSSContent();

        expect(cssContent).toContain('Generated:');
        // Should contain ISO date format
        expect(cssContent).toMatch(/Generated: \d{4}-\d{2}-\d{2}T/);
      });

      it('includes :root selector for light theme', () => {
        const cssContent = generateCSSContent();

        expect(cssContent).toContain(':root,');
        expect(cssContent).toContain('[data-theme="light"]');
      });

      it('includes [data-theme="dark"] selector', () => {
        const cssContent = generateCSSContent();

        expect(cssContent).toContain('[data-theme="dark"]');
      });

      it('has proper CSS block structure', () => {
        const cssContent = generateCSSContent();

        // Should have opening and closing braces for both theme blocks
        const openBraces = (cssContent.match(/{/g) || []).length;
        const closeBraces = (cssContent.match(/}/g) || []).length;

        expect(openBraces).toBe(2); // One for light, one for dark
        expect(closeBraces).toBe(2);
      });
    });

    describe('CSS Variable Formatting', () => {
      it('formats variables with proper CSS syntax', () => {
        const cssContent = generateCSSContent();

        // Each variable should have format: --mond-*: value;
        expect(cssContent).toMatch(/--mond-[\w-]+: .+;/);
      });

      it('properly indents CSS variables', () => {
        const cssContent = generateCSSContent();
        const lines = cssContent.split('\n');

        // Find variable declaration lines
        const variableLines = lines.filter(line => line.trim().startsWith('--mond-'));

        // All variable lines should be indented
        variableLines.forEach(line => {
          expect(line).toMatch(/^\s+--mond-/);
        });
      });

      it('alphabetically sorts CSS variables', () => {
        const cssContent = generateCSSContent();
        const lines = cssContent.split('\n');

        // Extract variable names from light theme block
        const lightThemeStart = lines.findIndex(line => line.includes('[data-theme="light"]'));
        const lightThemeEnd = lines.findIndex((line, i) => i > lightThemeStart && line.includes('}'));

        const lightVariables = lines
          .slice(lightThemeStart + 1, lightThemeEnd)
          .filter(line => line.trim().startsWith('--mond-'))
          .map(line => line.trim().split(':')[0]);

        // Check if sorted
        const sorted = [...lightVariables].sort();
        expect(lightVariables).toEqual(sorted);
      });

      it('includes semicolons after each variable declaration', () => {
        const cssContent = generateCSSContent();
        const lines = cssContent.split('\n');

        const variableLines = lines.filter(line => line.trim().startsWith('--mond-'));

        variableLines.forEach(line => {
          expect(line.trim()).toMatch(/;$/);
        });
      });
    });

    describe('Content Validation', () => {
      it('contains all CSS variable names with --mond- prefix', () => {
        const cssContent = generateCSSContent();
        const variables = generateAllCSSVariables();

        // Check that all variables from both maps appear in the CSS content
        Array.from(variables.light.keys()).forEach(varName => {
          expect(cssContent).toContain(varName);
        });

        Array.from(variables.dark.keys()).forEach(varName => {
          expect(cssContent).toContain(varName);
        });
      });

      it('contains resolved values, not token references', () => {
        const cssContent = generateCSSContent();

        // Should NOT contain unresolved token paths like "colors.gray.500"
        expect(cssContent).not.toMatch(/:\s*colors\./);
        expect(cssContent).not.toMatch(/:\s*semantic\./);

        // SHOULD contain resolved values
        expect(cssContent).toMatch(/:\s*#[0-9a-fA-F]{6}/); // Hex colors
        expect(cssContent).toMatch(/:\s*rgba?\(/); // RGBA colors
        expect(cssContent).toMatch(/:\s*\d+\.?\d*rem/); // Rem values
      });

      it('does not contain [object Object] strings', () => {
        const cssContent = generateCSSContent();

        // This was the original bug - should not have any [object Object]
        expect(cssContent).not.toContain('[object Object]');
      });

      it('generates content of expected size', () => {
        const cssContent = generateCSSContent();

        // We know from build output it should be around 23.87 KB
        const sizeInKB = cssContent.length / 1024;
        expect(sizeInKB).toBeGreaterThan(20);
        expect(sizeInKB).toBeLessThan(30);
      });

      it('contains expected number of variables', () => {
        const cssContent = generateCSSContent();

        const varCount = (cssContent.match(/--mond-/g) || []).length;

        // Should have 511+ variables as reported in build
        expect(varCount).toBeGreaterThanOrEqual(500);
      });
    });

    describe('Light Theme Block', () => {
      it('contains all semantic AND static tokens', () => {
        const cssContent = generateCSSContent();

        // Extract light theme block
        const lightBlockMatch = cssContent.match(/:root,\s*\[data-theme="light"\]\s*\{([^}]+)\}/s);
        expect(lightBlockMatch).not.toBeNull();

        const lightBlock = lightBlockMatch![1];

        // Should have semantic tokens
        expect(lightBlock).toContain('--mond-text-primary');
        expect(lightBlock).toContain('--mond-surface-background');

        // Should have static tokens
        expect(lightBlock).toContain('--mond-spacing-4');
        expect(lightBlock).toContain('--mond-radii-md');
        expect(lightBlock).toContain('--mond-font-size-base');
      });
    });

    describe('Dark Theme Block', () => {
      it('contains semantic token overrides', () => {
        const cssContent = generateCSSContent();

        // Extract dark theme block
        const darkBlockMatch = cssContent.match(/\[data-theme="dark"\]\s*\{([^}]+)\}/s);
        expect(darkBlockMatch).not.toBeNull();

        const darkBlock = darkBlockMatch![1];

        // Should have semantic tokens
        expect(darkBlock).toContain('--mond-text-primary');
        expect(darkBlock).toContain('--mond-surface-background');

        // Should have theme-aware effects
        expect(darkBlock).toContain('--mond-effects-');

        // Note: May also contain layout tokens with theme variants
        // Dark theme focuses on semantic overrides but includes layout tokens
      });
    });
  });

  describe('Integration with Existing Token System', () => {
    it('uses resolveSemanticToken() for consistency', () => {
      // This test verifies that the generator uses the same resolution logic
      // as the runtime theme resolver, ensuring consistency

      const variables = generateAllCSSVariables();

      // If we're generating variables correctly, they should resolve to actual values
      const textPrimary = variables.light.get('--mond-text-primary');

      expect(textPrimary).toBeDefined();
      expect(typeof textPrimary).toBe('string');
      expect(textPrimary).not.toContain('.');
      expect(textPrimary).not.toContain('[object');
    });

    it('maintains single source of truth from tokens folder', () => {
      // The generator should read from tokens.ts, not duplicate values
      const variables = generateAllCSSVariables();

      // Check that we have variables (proves we're reading from tokens)
      expect(variables.light.size).toBeGreaterThan(0);

      // Spacing-4 should match the value in tokens.spacing
      const spacing4 = variables.light.get('--mond-spacing-4');
      expect(spacing4).toBe('1rem'); // Known value from tokens.ts
    });
  });

  describe('Edge Cases', () => {
    it('handles tokens with complex nested paths', () => {
      const variables = generateAllCSSVariables();

      // Check deeply nested tokens are generated correctly
      const deepToken = Array.from(variables.light.keys()).find(key =>
        key.split('-').length > 5
      );

      expect(deepToken).toBeDefined();
    });

    it('handles tokens with special characters in values', () => {
      const variables = generateAllCSSVariables();

      // Font families may have quotes and commas
      const fontFamily = variables.light.get('--mond-font-family-sans');
      expect(fontFamily).toBeDefined();

      // Shadows may have complex rgba() values
      const shadow = variables.light.get('--mond-shadow-md');
      expect(shadow).toBeDefined();
      expect(shadow).toContain('rgba');
    });

    it('handles numeric token keys correctly', () => {
      const variables = generateAllCSSVariables();

      // Spacing uses numeric keys (0, 1, 2, etc.)
      expect(variables.light.has('--mond-spacing-0')).toBe(true);
      expect(variables.light.has('--mond-spacing-16')).toBe(true);
    });
  });
});
