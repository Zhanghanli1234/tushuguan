import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'          // 引入 Pinia
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 挂载 Pinia：管理全局共享状态
app.use(createPinia())

// 挂载路由插件：让整个应用的路由系统生效
app.use(router)

app.mount('#app')