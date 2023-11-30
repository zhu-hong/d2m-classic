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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const vendorReactMui = ['node_modules/react', 'node_modules/@mui', 'node_modules/@emotion']
          if(vendorReactMui.find((v) => id.includes(v))) return 'vendor-react-mui'

          if(id.includes('@fontsource/roboto')) return 'robotofont'
        },
      },
    },
  },
})
