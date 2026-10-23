import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'          // 引入 Pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入持久化插件
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 创建 Pinia 实例，并注册持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 挂载 Pinia：管理全局共享状态
app.use(pinia)

// 挂载路由插件：让整个应用的路由系统生效
app.use(router)

app.mount('#app')