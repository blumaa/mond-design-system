// Import the custom theme format
import './formats/theme-object.js';

// BSF brand - light and dark modes
export default {
  source: [
    'src/tokens/primitives/**/*.json',
    'src/tokens/brands/bsf/**/*.json',
    'src/tokens/semantic/**/*.json'
  ],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'dist/themes/',
      files: [
        {
          destination: 'bsf-light.ts',
          format: 'javascript/theme-object',
          options: {
            mode: 'light'
          }
        },
        {
          destination: 'bsf-dark.ts',
          format: 'javascript/theme-object',
          options: {
            mode: 'dark'
          }
        }
      ]
    }
  }
};
