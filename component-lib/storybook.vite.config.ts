import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 600,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-docs': ['@storybook/blocks', '@storybook/addon-docs'],
          'vendor-storybook': ['@storybook/react', '@storybook/preview-api'],
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
    include: ['react', 'react-dom', '@storybook/blocks', '@storybook/addon-docs'],
  },
});
