import { defineStore } from 'pinia'

// 定义一个名为 user 的 store
export const useUserStore = defineStore('user', {
  // state：存放共享数据（登录凭证 + 用户信息）
  state: () => ({
    token: '', // 登录凭证
    userInfo: { name: '', role: '' }, // 姓名、角色
  }),

  // getters：基于 state 计算派生数据（类似 computed）
  getters: {
    // 是否有 token 即视为已登录
    isLoggedIn: (state) => !!state.token,
    // 当前登录用户名，未登录时为空
    username: (state) => state.userInfo.name,
  },

  // actions：修改状态的方法（类似 methods）
  actions: {
    // 模拟登录：保存 token 和用户信息
    login(username) {
      this.token = 'mock-token' // 模拟后端返回的 token
      this.userInfo = { name: username, role: 'admin' } // 保存姓名和角色
    },
    // 登出：清空状态
    logout() {
      this.token = ''
      this.userInfo = { name: '', role: '' }
    },
  },

  // persist: true 开启持久化：state 自动同步到 localStorage
  persist: true,
})