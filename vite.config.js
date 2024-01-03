import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import unocss from 'unocss/vite'
import { resolve } from 'path'
import pkg from './package.json'
import { sep } from 'path'

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
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const vendorReact = [`node_modules${sep}react${sep}`, `node_modules${sep}react-dom${sep}`, `node_modules${sep}@mui`, `node_modules${sep}@emotion`]
          if(vendorReact.find((v) => id.includes(v))) return 'vendor-react-mui'

          if(id.includes('node_modules'+sep+'@fontsource/roboto')) return 'robotofont'
        },
      },
    },
  },
})
