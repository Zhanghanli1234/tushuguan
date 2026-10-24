import { http, HttpResponse } from 'msw' // MSW 核心：http 定义接口、HttpResponse 构造响应

// 内存中的图书数据（模拟数据库）
let books = [
  { id: 1, title: 'Vue 3 实战', author: '张三', category: '前端' },
  { id: 2, title: 'TypeScript 完全指南', author: '李四', category: '前端' },
]

// 统一的请求前缀，方便后续修改
const API = '/api'

// handlers：集中定义所有 mock 接口
// 统一返回 { code, data }，与 request.js 响应拦截器的约定一致
export const handlers = [
  // 1) 登录：返回 token 和用户信息
  http.post(`${API}/login`, async ({ request }) => {
    const { username } = await request.json() // 读取请求体里的用户名
    return HttpResponse.json({
      code: 200,
      data: {
        token: 'mock-token',
        userInfo: { name: username, role: 'admin' },
      },
    })
  }),

  // 2) 图书列表（分页）
  http.get(`${API}/books`, ({ request }) => {
    // 从 URL 读取分页参数，未传则默认第 1 页
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = 5
    const start = (page - 1) * pageSize

    const total = books.length
    const list = books.slice(start, start + pageSize) // 当前页数据

    return HttpResponse.json({ code: 200, data: { list, total, page, pageSize } })
  }),

  // 3) 新增图书
  http.post(`${API}/books`, async ({ request }) => {
    const data = await request.json() // 取前端传来的 title/author/category
    const newBook = { id: Date.now(), ...data } // id 用时间戳模拟自增
    books.push(newBook)
    return HttpResponse.json({ code: 200, data: newBook })
  }),

  // 4) 编辑图书
  http.put(`${API}/books/:id`, async ({ request, params }) => {
    const id = Number(params.id) // 从路径取要编辑的 id
    const data = await request.json()
    books = books.map((b) => (b.id === id ? { ...b, ...data } : b)) // 替换匹配项
    return HttpResponse.json({ code: 200, data: { id, ...data } })
  }),

  // 5) 删除图书
  http.delete(`${API}/books/:id`, ({ params }) => {
    const id = Number(params.id)
    books = books.filter((b) => b.id !== id) // 过滤掉该 id
    return HttpResponse.json({ code: 200, data: { success: true } })
  }),

  // 6) GET /api/books 带 page=999 时返回空列表（模拟无数据场景）
  http.get(`${API}/books`, ({ request }) => {
    const url = new URL(request.url)
    if (url.searchParams.get('page') === '999') {
      return HttpResponse.json({ code: 200, data: { list: [], total: 0, page: 999, pageSize: 5 } })
    }
    return HttpResponse.json({ code: 200, data: { list: books, total: books.length } })
  }),

  // 7) 演示：始终返回 HTTP 500，触发响应拦截器的错误分支
  http.get(`${API}/server-error`, () => {
    return HttpResponse.json({ code: 500, message: '服务器内部错误' }, { status: 500 })
  }),

  // 8) 演示：缺少 Authorization 头则返回 401，触发拦截器清登录态并跳转
  http.get(`${API}/protected`, ({ request }) => {
    const auth = request.headers.get('Authorization') // 读取鉴权头
    if (!auth) {
      return HttpResponse.json({ code: 401, message: '未授权' }, { status: 401 })
    }
    return HttpResponse.json({ code: 200, data: { message: '认证通过' } })
  }),
]