import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'all',
      '5173-iwwzrx9q3v6c6sec2azme-8aa2a563.manusvm.computer',
      '.manusvm.computer'
    ],
    hmr: {
      clientPort: 5173,
      host: 'localhost'
    }
  }
})
