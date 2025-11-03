import StyleDictionary from 'style-dictionary';

// Custom format for theme-aware CSS with light/dark modes
StyleDictionary.registerFormat({
  name: 'css/theme-modes',
  format: function({ dictionary, options }) {
    const { outputReferences } = options || {};

    // Separate tokens into primitives (no mode extensions) and semantic (with mode extensions)
    const primitiveTokens = [];
    const semanticTokens = [];

    dictionary.allTokens.forEach(token => {
      if (token.$extensions?.mode) {
        semanticTokens.push(token);
      } else {
        primitiveTokens.push(token);
      }
    });

    // Helper to convert token path to CSS variable name
    const toCSSVar = (token) => {
      return `--${token.path.join('-')}`;
    };

    // Helper to format value (handle references if needed)
    const formatValue = (value) => {
      if (outputReferences && value.startsWith('{') && value.endsWith('}')) {
        // Convert token reference {color.blue.500} to CSS var reference var(--color-blue-500)
        const refPath = value.slice(1, -1).replace(/\./g, '-');
        return `var(--${refPath})`;
      }
      return value;
    };

    let css = '/**\n * Do not edit directly, this file was auto-generated.\n */\n\n';

    // Output primitive tokens (always available, no theme dependency)
    css += ':root {\n';
    primitiveTokens.forEach(token => {
      css += `  ${toCSSVar(token)}: ${formatValue(token.value)};\n`;
    });
    css += '}\n\n';

    // Output semantic tokens with light mode defaults
    css += '/* Light mode (default) */\n';
    css += '[data-theme="light"], :root {\n';
    semanticTokens.forEach(token => {
      const lightValue = token.$extensions.mode.light || token.value;
      css += `  ${toCSSVar(token)}: ${formatValue(lightValue)};\n`;
    });
    css += '}\n\n';

    // Output semantic tokens with dark mode overrides
    css += '/* Dark mode */\n';
    css += '[data-theme="dark"] {\n';
    semanticTokens.forEach(token => {
      if (token.$extensions.mode.dark) {
        const darkValue = token.$extensions.mode.dark;
        css += `  ${toCSSVar(token)}: ${formatValue(darkValue)};\n`;
      }
    });
    css += '}\n';

    return css;
  }
});

export default {
  source: [
    'tokens/primitives/**/*.json',
    'tokens/brands/default/**/*.json',
    'tokens/semantic/**/*.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/theme-modes',
          options: {
            outputReferences: true
          }
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'generated.js',
          format: 'javascript/es6'
        }
      ]
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'generated.d.ts',
          format: 'typescript/es6-declarations'
        }
      ]
    }
  }
};
