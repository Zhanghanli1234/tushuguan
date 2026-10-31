import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyPagination from '../../src/components/MyPagination.vue'

// 通过 el-pagination 组件触发页码/条数变化，走内部 v-model 绑定到 current/size 的 setter
function triggerPaginationChange(
  wrapper: ReturnType<typeof mount>,
  {
    currentPage,
    pageSize,
  }: { currentPage?: number; pageSize?: number } = {},
) {
  const pagination = wrapper.findComponent({ name: 'ElPagination' })
  if (currentPage !== undefined) {
    const vm = pagination.vm as any
    vm.$emit('update:current-page', currentPage)
  }
  if (pageSize !== undefined) {
    const vm = pagination.vm as any
    vm.$emit('update:page-size', pageSize)
  }
}

describe('MyPagination 组件交互', () => {
  it('渲染 el-pagination 并透传 total', () => {
    const wrapper = mount(MyPagination, {
      props: { total: 87, page: 1, pageSize: 10 },
    })
    const pagination = wrapper.findComponent({ name: 'ElPagination' })
    expect(pagination.exists()).toBe(true)
    expect(pagination.props('total')).toBe(87)
    expect(pagination.props('pageSize')).toBe(10)
  })

  it('切换页码：发出 update:page 与 change，值同步', () => {
    const wrapper = mount(MyPagination, {
      props: { total: 100, page: 1, pageSize: 10 },
    })
    triggerPaginationChange(wrapper, { currentPage: 3 })
    const emits = wrapper.emitted()
    // v-model:page 同步
    expect(emits['update:page']).toBeTruthy()
    expect(emits['update:page']![0]).toEqual([3])
    // 触发重新请求
    expect(emits['change']).toBeTruthy()
    // 切换页码不应改动 pageSize
    expect(emits['update:pageSize']).toBeUndefined()
  })

  it('切换每页条数：页码回到第 1 页，发出 update:pageSize 与 change', () => {
    const wrapper = mount(MyPagination, {
      props: { total: 100, page: 5, pageSize: 10 },
    })
    triggerPaginationChange(wrapper, { pageSize: 20 })
    const emits = wrapper.emitted()
    expect(emits['update:pageSize']).toBeTruthy()
    expect(emits['update:pageSize']![0]).toEqual([20])
    // 页码回到第 1 页
    expect(emits['update:page']).toBeTruthy()
    expect(emits['update:page']![0]).toEqual([1])
    // 触发重新请求
    expect(emits['change']).toBeTruthy()
  })

  it('使用默认 props 时切换页码：仍能正确发出 update:page 与 change', () => {
    const wrapper = mount(MyPagination, { props: { total: 50 } })
    triggerPaginationChange(wrapper, { currentPage: 2 })
    const emits = wrapper.emitted()
    expect(emits['update:page']).toBeTruthy()
    expect(emits['update:page']![0]).toEqual([2])
    expect(emits['change']).toBeTruthy()
  })
})