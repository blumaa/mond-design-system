// Import the custom theme format
import './formats/theme-object.js';

// Default brand - light and dark modes
export default {
  source: [
    'tokens/primitives/**/*.json',
    'tokens/brands/default/**/*.json',
    'tokens/semantic/**/*.json'
  ],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'dist/themes/',
      files: [
        {
          destination: 'default-light.js',
          format: 'javascript/theme-object',
          options: {
            mode: 'light'
          }
        },
        {
          destination: 'default-dark.js',
          format: 'javascript/theme-object',
          options: {
            mode: 'dark'
          }
        }
      ]
    }
  }
};
