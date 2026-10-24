import { setupWorker } from 'msw/browser' // MSW 浏览器启动器
import { handlers } from './handlers' // 引入所有 mock 接口

// 创建并导出 worker 实例（可在 main 里调用 .start() 启动）
export const worker = setupWorker(...handlers)