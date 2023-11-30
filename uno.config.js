import { defineConfig, presetWind } from 'unocss'

export default defineConfig({
  preflights: false,
  presets: [
    presetWind({
      preflight: false,
    }),
  ],
})
