import { describe, it, expect, beforeEach } from 'vitest'
import { createApp } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useUserStore } from '../../src/stores/user'

// 每个用例前重建一个全新的 Pinia（含持久化插件），保证隔离
// 注意：Pinia 4 的 use() 在尚未 install 到 app 时只会缓存插件，
// 必须经过 app.use(pinia) 走真实安装路径，插件的 $persist/$hydrate 才会注入到 store。
function newPinia() {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  createApp({}).use(pinia)
  return pinia
}

describe('user store 纯逻辑', () => {
  beforeEach(() => {
    setActivePinia(newPinia())
    localStorage.clear()
  })

  it('初始 state：空 token、空用户信息', () => {
    const store = useUserStore()
    expect(store.token).toBe('')
    expect(store.userInfo).toEqual({ name: '', role: '' })
  })

  it('getter isLoggedIn：无 token 时 false', () => {
    const store = useUserStore()
    expect(store.isLoggedIn).toBe(false)
  })

  it('getter username：未登录时空字符串', () => {
    const store = useUserStore()
    expect(store.username).toBe('')
  })

  it('login("张三")：写入 token 与用户信息，isLoggedIn/username 随之更新', () => {
    const store = useUserStore()
    store.login('张三')
    expect(store.token).toBe('mock-token')
    expect(store.userInfo).toEqual({ name: '张三', role: 'admin' })
    expect(store.isLoggedIn).toBe(true)
    expect(store.username).toBe('张三')
  })

  it('logout()：清空 token 与用户信息，恢复未登录态', () => {
    const store = useUserStore()
    store.login('李四')
    store.logout()
    expect(store.token).toBe('')
    expect(store.userInfo).toEqual({ name: '', role: '' })
    expect(store.isLoggedIn).toBe(false)
    expect(store.username).toBe('')
  })

  it('persist：login 后可同步落盘到 localStorage（$persist）', () => {
    const store = useUserStore()
    store.login('王五')
    store.$persist() // 插件提供的同步持久化入口
    const saved = JSON.parse(localStorage.getItem('user') || '{}')
    expect(saved.token).toBe('mock-token')
    expect(saved.userInfo.name).toBe('王五')
  })

  it('hydrate：从 localStorage 恢复登录态（$hydrate）', () => {
    // 先在“旧”Pinia 里登录并持久化
    setActivePinia(newPinia())
    const oldStore = useUserStore()
    oldStore.login('王五')
    oldStore.$persist()

    // 换一个全新 Pinia（模拟刷新页面），从 localStorage 水合恢复
    setActivePinia(newPinia())
    const restored = useUserStore()
    restored.$hydrate()
    expect(restored.isLoggedIn).toBe(true)
    expect(restored.username).toBe('王五')
  })
})