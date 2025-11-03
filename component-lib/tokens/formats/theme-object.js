import StyleDictionary from 'style-dictionary';

/**
 * Custom format for generating JavaScript theme objects
 * Outputs a theme object with all tokens organized by category
 */
StyleDictionary.registerFormat({
  name: 'javascript/theme-object',
  format: function({ dictionary, options }) {
    const { mode = 'light' } = options || {};

    // Helper to resolve token value based on mode
    const resolveValue = (token) => {
      // If token has mode extensions, use the specified mode
      if (token.$extensions?.mode) {
        return token.$extensions.mode[mode] || token.value;
      }
      return token.value;
    };

    // Helper to resolve references in values
    const resolveReferences = (value, dictionary) => {
      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const refPath = value.slice(1, -1).split('.');
        const refToken = dictionary.allTokens.find(t =>
          t.path.join('.') === refPath.join('.')
        );
        if (refToken) {
          const refValue = resolveValue(refToken);
          return resolveReferences(refValue, dictionary);
        }
      }
      return value;
    };

    // Build theme object structure
    const theme = {
      colors: {},
      space: {},
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeights: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      fonts: {
        sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
      },
      lineHeights: {
        none: '1',
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
      letterSpacings: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
      },
      radii: {},
      shadows: {},
    };

    dictionary.allTokens.forEach(token => {
      const value = resolveReferences(resolveValue(token), dictionary);
      const path = token.path;

      // Organize tokens by category
      if (path[0] === 'color') {
        // Convert color.brand.primary.600 to colors.brandPrimary600
        const colorPath = path.slice(1);
        const key = colorPath.map((p, i) =>
          i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
        ).join('');
        theme.colors[key] = value;
      } else if (path[0] === 'spacing') {
        theme.space[path[1]] = value;
      } else if (path[0] === 'fontSize') {
        theme.fontSizes[path[1]] = value;
      } else if (path[0] === 'fontWeight') {
        theme.fontWeights[path[1]] = value;
      } else if (path[0] === 'fontFamily') {
        theme.fonts[path[1]] = value;
      } else if (path[0] === 'lineHeight') {
        theme.lineHeights[path[1]] = value;
      } else if (path[0] === 'letterSpacing') {
        theme.letterSpacings[path[1]] = value;
      } else if (path[0] === 'radii') {
        theme.radii[path[1]] = value;
      } else if (path[0] === 'shadow') {
        theme.shadows[path[1]] = value;
      }
    });

    // Generate JavaScript module
    let output = '/**\n';
    output += ' * Do not edit directly, this file was auto-generated.\n';
    output += ` * Theme: ${mode} mode\n`;
    output += ' */\n\n';
    output += `export const theme = ${JSON.stringify(theme, null, 2)};\n`;

    return output;
  }
});
