import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Forces assets to be loaded relatively for GitHub Pages compatibility
  plugins: [
    react()
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})
