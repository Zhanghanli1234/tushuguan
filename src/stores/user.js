// 用户仓库：用 Pinia 管理登录状态与用户信息
import { defineStore } from 'pinia'

// 选项式 API 写法：state 数据 + getters 派生值 + actions 方法
export const useUserStore = defineStore('user', {
  // 1. state：响应式数据
  state: () => ({
    // 登录凭证，初始从 localStorage 读取
    token: localStorage.getItem('library_token') || '',
    // 用户信息对象：姓名 + 角色
    userInfo: {
      name: '',
      role: '', // 角色：admin 管理员 / user 普通用户
    },
  }),

  // 2. getters：基于 state 计算的派生值
  getters: {
    // 是否已登录：token 非空即为登录态
    isLoggedIn: (state) => !!state.token,
    // 登录用户名：直接取 userInfo.name
    username: (state) => state.userInfo.name,
  },

  // 3. actions：修改状态的方法
  actions: {
    // 模拟登录：生成 mock token，保存 token 和用户信息
    login(username, role = 'user') {
      // 生成一个简单的模拟 token
      this.token = 'mock-token-' + new Date().getTime()
      // 保存用户信息
      this.userInfo = { name: username, role }
      // 同步到 localStorage，便于刷新后仍保持登录态
      localStorage.setItem('library_token', this.token)
    },
    // 退出登录：清空 token 和用户信息，重置登录状态
    logout() {
      this.token = ''
      this.userInfo = { name: '', role: '' }
      localStorage.removeItem('library_token')
    },
  },

  // 4. persist：开启状态持久化，页面刷新后登录状态不丢失
  persist: true,
})