import request from '../utils/request'

// 分页 + 关键词查询图书列表
// @returns {Promise<any>} 拦截器已解包出 data，故标 any，避免 AxiosResponse 类型误报
export function getBooks({ page = 1, pageSize = 10, keyword = '' }) {
  return request.get('/books', { params: { page, pageSize, keyword } })
}

// 新增图书
export function addBook(data) {
  return request.post('/books', data)
}

// 编辑图书
export function updateBook(id, data) {
  return request.put(`/books/${id}`, data)
}

// 删除图书
export function deleteBook(id) {
  return request.delete(`/books/${id}`)
}