import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from '../../src/api/book'
import request from '../../src/utils/request'
import { login as loginApi } from '../../src/api/auth'
import { useUserStore } from '../../src/stores/user'

// 阶段③：MSW 接口集成测试
// 通过真实 axios 接口函数发请求，由 MSW 的 handlers 拦截并返回 mock 数据
// setup.ts 已在全局 setupServer(...handlers) 并监听（onUnhandledRequest: 'error'）

describe('books 接口（MSW）', () => {
  beforeEach(() => {
    // request.js 请求拦截器会调用 useUserStore()，必须配置活动 Pinia
    setActivePinia(createPinia())
  })

  it('getBooks 默认分页：返回 list + total + 分页信息', async () => {
    const res = await getBooks({ page: 1, pageSize: 5 })
    expect(res.list).toHaveLength(5)
    expect(res.total).toBeGreaterThanOrEqual(5)
    expect(res.page).toBe(1)
    expect(res.pageSize).toBe(5)
    // 首条图书形态校验
    expect(res.list[0]).toHaveProperty('id')
    expect(res.list[0]).toHaveProperty('title')
    expect(res.list[0]).toHaveProperty('author')
  })

  it('getBooks 每页条数限制：pageSize=3 时仅返回 3 条', async () => {
    const res = await getBooks({ page: 1, pageSize: 3 })
    expect(res.list).toHaveLength(3)
    expect(res.pageSize).toBe(3)
  })

  it('getBooks 关键词筛选：匹配书名，total 随过滤结果变化', async () => {
    const res = await getBooks({ page: 1, pageSize: 10, keyword: 'Vue' })
    expect(res.list.length).toBeGreaterThan(0)
    // 所有结果的书名都应包含关键词（不区分大小写）
    for (const b of res.list) {
      expect(b.title.toLowerCase()).toContain('vue')
    }
    expect(res.total).toBe(res.list.length)
  })

  it('getBooks 关键词无匹配：返回空列表', async () => {
    const res = await getBooks({ page: 1, pageSize: 10, keyword: '不存在的书xyz' })
    expect(res.list).toHaveLength(0)
    expect(res.total).toBe(0)
  })

  it('addBook：新增成功并返回含 id 的新书', async () => {
    const newBook = await addBook({
      title: '测试驱动开发',
      author: '测试人',
      category: '工程实践',
    })
    expect(newBook.id).toBeDefined()
    expect(newBook.title).toBe('测试驱动开发')
    expect(newBook.author).toBe('测试人')
  })

  it('updateBook：编辑后返回更新字段', async () => {
    const { id } = await addBook({ title: '原书名', author: '甲', category: '前端' })
    const updated = await updateBook(id, { title: '新书名', author: '乙' })
    expect(updated.id).toBe(id)
    expect(updated.title).toBe('新书名')
    expect(updated.author).toBe('乙')
  })

  it('deleteBook：删除成功返回 success: true', async () => {
    const res = await deleteBook(1)
    expect(res).toEqual({ success: true })
  })
})

// 组合实验：登录 → 存 token → 带 Authorization 访问受保护接口 → 无 token 返回 401
// 核心验证 request.js 拦截器是否按用户状态自动携带/忽略 Authorization 头
describe('登录 + 鉴权组合链路（MSW）', () => {
  let userStore: ReturnType<typeof useUserStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserStore()
    // 401 分支会触发全局 alert，jsdom 无此 API，需临时 stub
    vi.stubGlobal('alert', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('完整链路：登录拿 token → 存入 store → 携带 Authorization 访问 /api/protected 成功', async () => {
    // 1) 登录：MSW 返回 token 与用户信息
    const data = await loginApi('张三')
    expect(data).toHaveProperty('token')
    expect(data.userInfo.name).toBe('张三')

    // 2) 把登录接口返回的 token 存入 user store
    userStore.$patch({ token: data.token })

    // 3) 访问受保护接口：请求拦截器应自动携带 Authorization 头
    const res = await request.get('/protected')
    expect(res.message).toBe('认证通过')
  })

  it('无 token：请求不含 Authorization，/api/protected 返回 401', async () => {
    // 用户未登录：store 中 token 为空
    expect(userStore.token).toBe('')

    // 访问受保护接口应被拒绝（HTTP 401）
    await expect(request.get('/protected')).rejects.toBeTruthy()
  })
})