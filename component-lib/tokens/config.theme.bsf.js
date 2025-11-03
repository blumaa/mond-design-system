// Import the custom theme format
import './formats/theme-object.js';

// BSF brand - light and dark modes
export default {
  source: [
    'tokens/primitives/**/*.json',
    'tokens/brands/bsf/**/*.json',
    'tokens/semantic/**/*.json'
  ],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'dist/themes/',
      files: [
        {
          destination: 'bsf-light.js',
          format: 'javascript/theme-object',
          options: {
            mode: 'light'
          }
        },
        {
          destination: 'bsf-dark.js',
          format: 'javascript/theme-object',
          options: {
            mode: 'dark'
          }
        }
      ]
    }
  }
};
