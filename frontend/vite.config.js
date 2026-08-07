import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,   // biar konsisten
    allowedHosts: ['.ngrok-free.app'],
    proxy: {
      '/storage': {
        target: 'http://localhost:8000',  // 👈 proxy image requests to Laravel
        changeOrigin: true,
      }
    }
  }
})