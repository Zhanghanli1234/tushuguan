import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // 开发代理：把 /api 开头的请求转发到真实后端，避免跨域
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // TODO: 改成你的真实后端地址
        changeOrigin: true,
        // 后端路径带 /api 则去掉下一行；若后端不带 /api 前缀，取消注释以剥离
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})