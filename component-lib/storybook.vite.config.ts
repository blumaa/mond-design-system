import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@mond-design-system/component-lib': path.resolve(__dirname, '../index.ts'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@storybook/addon-docs'],
  },
});
