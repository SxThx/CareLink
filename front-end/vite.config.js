import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify'; // Use path-browserify
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'path': 'path-browserify',
      'process': 'process/browser',
      '@': resolve(__dirname, './src'),
      '#': resolve(__dirname, './src/Components'),
    },
  },
});
