import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus' // Element Plus 组件库
import 'element-plus/dist/index.css' // Element Plus 默认样式
import { createPinia } from 'pinia' // Pinia 状态管理
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // Pinia 持久化插件
import App from './App.vue'
import router from './router' // 引入上面创建的路由配置文件
import request from './utils/request' // 封装的 axios 实例，用于控制台调试接口

// 仅开发环境下启动 MSW mock，拦截接口请求（生产环境不加载）
if (import.meta.env.DEV) {
  const { worker } = await import('./mock/browser')
  await worker.start()

  // 挂到 window，方便在浏览器 Console 里测试 500/401 等拦截器行为
  ;(window as any).__api = request
  console.log('%c💡 已挂载调试入口 window.__api', 'color:#42b883;font-weight:bold')
}

const app = createApp(App)

// 创建 Pinia 实例并注册持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia) // 挂载 Pinia
app.use(router) // 挂载路由，启用路由功能
app.use(ElementPlus) // 全局注册 Element Plus 组件

app.mount('#app')