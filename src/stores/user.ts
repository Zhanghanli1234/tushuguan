// 用户状态 store：用 Pinia 管理登录信息
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// defineStore 的第一个参数是 store 的唯一 id
export const useUserStore = defineStore('user', () => {
  // 登录状态：从 localStorage 读取 token 作为初值
  const token = ref<string>(localStorage.getItem('library_token') || '')
  const username = ref<string>('')

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => !!token.value)

  // 登录：写入 token 并保存到 localStorage
  function login(name: string) {
    username.value = name
    token.value = 'demo-token'
    localStorage.setItem('library_token', token.value)
  }

  // 退出登录：清空 token
  function logout() {
    token.value = ''
    username.value = ''
    localStorage.removeItem('library_token')
  }

  return { token, username, isLoggedIn, login, logout }
})