import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import unocss from 'unocss/vite'
import { resolve } from 'path'
import pkg from './package.json'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '/src')
    },
  },
  plugins: [
    unocss(),
    react(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
})
