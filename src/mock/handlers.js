import { http, HttpResponse, delay } from 'msw' // MSW 核心：http 定义接口、HttpResponse 构造响应、delay 模拟网络延迟

// 模拟网络延迟（毫秒），让 loading 遮罩可见
const MOCK_DELAY = 600

// 内存中的图书数据（模拟数据库），含新增的 评分/上架/库存 字段
let books = [
  { id: 1, title: 'Vue 3 实战', author: '张三', category: '前端', rating: 4.5, available: true, stock: 10 },
  { id: 2, title: 'TypeScript 完全指南', author: '李四', category: '前端', rating: 4, available: true, stock: 8 },
  { id: 3, title: 'JavaScript 高级程序设计', author: '王五', category: '前端', rating: 5, available: true, stock: 12 },
  { id: 4, title: '计算机网络', author: '赵六', category: '计算机基础', rating: 4, available: true, stock: 6 },
  { id: 5, title: '深入理解计算机系统', author: '钱七', category: '计算机基础', rating: 4.5, available: false, stock: 0 },
  { id: 6, title: '算法导论', author: '孙八', category: '算法', rating: 5, available: true, stock: 5 },
  { id: 7, title: '设计模式', author: '周九', category: '软件工程', rating: 4, available: true, stock: 9 },
  { id: 8, title: '数据库系统概论', author: '吴十', category: '数据库', rating: 3.5, available: true, stock: 7 },
  { id: 9, title: '操作系统', author: '郑一', category: '计算机基础', rating: 4, available: false, stock: 0 },
  { id: 10, title: 'Python 核心编程', author: '冯二', category: '后端', rating: 4.5, available: true, stock: 11 },
  { id: 11, title: 'Java 编程思想', author: '陈三', category: '后端', rating: 4, available: true, stock: 8 },
  { id: 12, title: 'Spring 实战', author: '褚四', category: '后端', rating: 3.5, available: true, stock: 6 },
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

  // 2) 图书列表（分页 + 关键词筛选）
  http.get(`${API}/books`, async ({ request }) => {
    await delay(MOCK_DELAY) // 模拟网络延迟，让 loading 遮罩可见
    const url = new URL(request.url)
    // 读取参数，未传则用默认值
    const page = Number(url.searchParams.get('page') || 1) // 页码
    const pageSize = Number(url.searchParams.get('pageSize') || 10) // 每页条数
    const keyword = (url.searchParams.get('keyword') || '').trim().toLowerCase() // 搜索关键词

    // 关键词过滤：匹配书名或作者（不区分大小写）
    const filtered = keyword
      ? books.filter(
          (b) => b.title.toLowerCase().includes(keyword) || b.author.toLowerCase().includes(keyword)
        )
      : books

    // 分页切片
    const total = filtered.length
    const list = filtered.slice((page - 1) * pageSize, page * pageSize)

    return HttpResponse.json({ code: 200, data: { list, total, page, pageSize } })
  }),

  // 3) 新增图书
  http.post(`${API}/books`, async ({ request }) => {
    await delay(MOCK_DELAY) // 模拟网络延迟
    const data = await request.json() // 取前端传来的 title/author/category
    const newBook = { id: Date.now(), ...data } // id 用时间戳模拟自增
    books.push(newBook)
    return HttpResponse.json({ code: 200, data: newBook })
  }),

  // 4) 编辑图书
  http.put(`${API}/books/:id`, async ({ request, params }) => {
    await delay(MOCK_DELAY) // 模拟网络延迟
    const id = Number(params.id) // 从路径取要编辑的 id
    const data = await request.json()
    books = books.map((b) => (b.id === id ? { ...b, ...data } : b)) // 替换匹配项
    return HttpResponse.json({ code: 200, data: { id, ...data } })
  }),

  // 5) 删除图书
  http.delete(`${API}/books/:id`, async ({ params }) => {
    await delay(MOCK_DELAY) // 模拟网络延迟
    const id = Number(params.id)
    books = books.filter((b) => b.id !== id) // 过滤掉该 id
    return HttpResponse.json({ code: 200, data: { success: true } })
  }),

  // 6) 演示：始终返回 HTTP 500，触发响应拦截器的错误分支
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