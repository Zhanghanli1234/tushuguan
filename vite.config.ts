import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 从 vitest/config 导入 defineConfig，其类型继承了 Vite 并扩展了 test 字段
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
  test: {
    environment: 'jsdom', // 用 jsdom 模拟浏览器 DOM
    globals: true, // 启用全局 describe/it/expect，无需手动导入
    setupFiles: ['./tests/setup.ts'], // 测试前自动加载 setup（Element Plus / MSW / 清理）
    coverage: {
      provider: 'v8', // 基于 V8 的覆盖率收集
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{vue,ts,tsx,js,jsx}'], // 只统计 src 下的源码
    },
  },
})