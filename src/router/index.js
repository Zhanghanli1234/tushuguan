import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

/**
 * 路由配置 - 图书借阅管理系统
 * 技术栈：Vue3 + Vue Router4 + <script setup>
 */

// 创建路由实例，history 模式（URL 中不带 #，更美观）
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // 登录页，无需鉴权，直接可访问
      path: '/login',
      name: 'Login',
      // 路由懒加载：只有当访问到登录页时才会去下载该组件
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录' },
    },
    {
      // 父布局容器，是其他页面的"外壳"（侧边菜单 + 主内容区）
      path: '/',
      component: () => import('@/components/Layout.vue'),
      redirect: '/books', // 访问 / 时默认重定向到图书列表
      meta: { requiresAuth: true }, // 整个布局下的页面都需要登录
      children: [
        {
          // 图书列表，Layout 的子路由（嵌套路由）
          path: 'books',
          name: 'BookList',
          component: () => import('@/views/BookList.vue'),
          meta: { title: '图书列表', requiresAuth: true },
        },
        {
          // 借阅记录，Layout 的子路由（嵌套路由）
          path: 'records',
          name: 'BorrowRecord',
          component: () => import('@/views/BorrowRecord.vue'),
          meta: { title: '借阅记录', requiresAuth: true },
        },
      ],
    },
    {
      // 404 兜底：所有未匹配到的路径统一重定向到登录页
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
  // 页面跳转后自动滚动到顶部
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * 全局前置守卫：登录鉴权
 *
 * 注意：useUserStore() 必须写在守卫回调内部，不能在模块顶层调用。
 * 原因：router/index.js 被导入时 App 尚未创建、Pinia 实例还未挂载，
 * 此时顶层调用 useUserStore() 会报错：
 * "getActivePinia was called but there is no active Pinia. Did you forget to install pinia?"
 * 而守卫只有在路由导航时才执行，那时应用已完成挂载、Pinia 已注入，调用才是安全的。
 *
 * 这里读取 user store 的 isLoggedIn getter 做鉴权（不再直接操作 localStorage）。
 */
router.beforeEach((to) => {
  // 在守卫内部调用 store：此时应用已挂载、Pinia 已注入，避免顶层调用报错
  const userStore = useUserStore()

  // requiresAuth 为 true 表示需要登录；未登录则强制跳转到 /login
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return '/login'
  }
  // 已登录用户访问登录页，跳回首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    return '/'
  }
  return true
})

export default router