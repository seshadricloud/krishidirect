import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the KrishiDirect frontend application
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Port for the development server
    open: true, // Automatically open the app in the browser
  },
  build: {
    outDir: 'dist', // Output directory for the build
  },
  resolve: {
    alias: {
      '@': '/src', // Alias for easier imports
    },
  },
});