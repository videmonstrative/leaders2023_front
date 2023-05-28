import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
      //  target: 'http://localhost:8000',
        target: 'http://89.108.88.50:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
