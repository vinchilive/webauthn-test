import { defineConfig } from 'vite'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@src/': join(__dirname, 'src') + '/',
    },
  },
})
