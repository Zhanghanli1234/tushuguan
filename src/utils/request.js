import axios from 'axios'
import { useUserStore } from '../stores/user' // 用户状态
import router from '../router' // 用于跳转登录页

// 创建 axios 实例：统一 baseURL 和超时时间
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器：每次请求自动携带 token
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}` // 放到请求头
  }
  return config
})

// 响应拦截器：统一处理业务码和错误
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 业务成功码 200 → 直接返回 data
    if (res.code === 200) {
      return res.data
    }
    // 401：登录失效 → 清空状态并跳登录
    if (res.code === 401) {
      useUserStore().logout()
      router.push('/login')
    }
    // 其他业务错误提示
    return Promise.reject(res)
  },
  (error) => {
    const status = error.response?.status
    // 401：清空登录态并跳登录
    if (status === 401) {
      alert('登录已失效，请重新登录') // 测试用：让 401 也有可见提示
      useUserStore().logout()
      router.push('/login')
    }
    // 500：服务器错误提示
    if (status === 500) {
      alert('服务器错误，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default request