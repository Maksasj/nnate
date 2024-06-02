import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import staticCopy from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/nnate',
})
