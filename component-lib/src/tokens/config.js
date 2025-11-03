export default {
  source: [
    'src/tokens/primitives/**/*.json',
    'src/tokens/brands/default/**/*.json',
    'src/tokens/semantic/**/*.json'
  ],
  platforms: {
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
