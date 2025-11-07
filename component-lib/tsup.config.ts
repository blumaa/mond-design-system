import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry point - the main index file
  entry: ['index.ts'],

  // Output formats
  format: ['esm', 'cjs'],

  // Generate TypeScript declaration files
  dts: true,

  // Clean dist directory before build
  clean: true,

  // Target modern browsers and Node
  target: 'es2020',

  // Minification - disabled for better debugging
  minify: false,

  // Generate sourcemaps
  sourcemap: true,

  // Splitting for better tree-shaking
  splitting: false,

  // Preserve dynamic imports
  treeshake: true,

  // External dependencies (peer dependencies)
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
  ],

  // Preserve CSS imports - this is the key setting
  // CSS files will be copied to dist and imports will be preserved
  loader: {
    '.css': 'copy',
  },

  // Ensure proper module resolution
  platform: 'neutral',

  // Don't bundle dependencies
  noExternal: [],

  // Output configuration
  outDir: 'dist',

  // Preserve directory structure
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.js',
    };
  },

  // Display build info
  silent: false,

  // Enable JSX
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
