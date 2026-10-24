import request from '../utils/request'

// 登录：发送用户名，后端返回 token 和用户信息
// @returns {Promise<any>} 拦截器已解包出 data，故标 any，避免 AxiosResponse 类型误报
export function login(username) {
  return request.post('/login', { username })
}