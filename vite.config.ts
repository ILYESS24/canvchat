import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      overlay: false, // Désactiver l'overlay d'erreur qui peut causer des conflits
    },
  },
  // Désactiver les sourcemaps en développement pour éviter les conflits
  build: {
    sourcemap: false,
  },
  // Optimisations pour éviter les conflits avec les extensions
  optimizeDeps: {
    exclude: ['@vite/client', '@vite/env'],
  },
})
