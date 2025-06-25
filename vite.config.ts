import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    allowedHosts: true,

    proxy: {
      '/v1/serve': {
        target: 'ws://localhost:9000',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
      '/v1/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
