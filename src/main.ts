import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入上面创建的路由配置文件

const app = createApp(App)

app.use(router) // 挂载路由，启用路由功能

app.mount('#app')