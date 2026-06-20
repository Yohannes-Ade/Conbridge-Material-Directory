import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base: './' makes all import paths relative so it works perfectly on GitHub Pages subdirectories
  base: './', 
  plugins: [
    react()
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})
