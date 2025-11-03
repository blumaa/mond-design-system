// Import the custom theme format
import './formats/theme-object.js';

// Default brand - light and dark modes
export default {
  source: [
    'src/tokens/primitives/**/*.json',
    'src/tokens/brands/default/**/*.json',
    'src/tokens/semantic/**/*.json'
  ],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'dist/themes/',
      files: [
        {
          destination: 'default-light.ts',
          format: 'javascript/theme-object',
          options: {
            mode: 'light'
          }
        },
        {
          destination: 'default-dark.ts',
          format: 'javascript/theme-object',
          options: {
            mode: 'dark'
          }
        }
      ]
    }
  }
};
