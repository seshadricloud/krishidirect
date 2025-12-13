import { defineConfig } from 'vite';

export default defineConfig(async () => {
  // dynamically import the ESM-only plugin to avoid "ESM file cannot be loaded by `require`" errors
  const reactPlugin = (await import('@vitejs/plugin-react')).default;
  return {
    plugins: [reactPlugin()],
    optimizeDeps: { include: ['react', 'react-dom', 'react-router-dom', 'axios'] },
  };
});