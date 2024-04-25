import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'

const PACKAGE_ROOT = __dirname

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: './ssl/server.key',
      cert: './ssl/server.crt',
    },
    port: 3000,
  },
  resolve: {
    alias: {
      '@src/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
})
