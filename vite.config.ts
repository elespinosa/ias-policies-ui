import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path, { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'policies', // Make sure this matches your remote name
      filename: 'remoteEntry.js',
      exposes: {
        './policies-management': './src/App.tsx',
        './styles': './src/index.css',
        './policiesUserStore': './src/store/userStore',
        './hooks/useSwitchPoliciesLanguage': './src/hooks/useSwitchLanguage'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'zustand': { singleton: true },
        '@tanstack/react-query': { singleton: true },
        // 'react-i18next': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'esnext',
    modulePreload: false,
    rollupOptions: { output: { format: 'esm' } },
    minify: false,
    cssCodeSplit: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}); 