import { beforeEach, beforeAll, afterAll } from 'vitest'
import { config } from '@vue/test-utils'
import { setupServer } from 'msw/node'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { handlers } from '../src/mock/handlers'

export const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
})

afterAll(() => {
  server.close()
})

config.global.plugins = [ElementPlus]