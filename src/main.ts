import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 挂载路由插件：让整个应用的路由系统生效
app.use(router)

app.mount('#app')