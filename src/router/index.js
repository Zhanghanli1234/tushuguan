import { createRouter, createWebHistory } from 'vue-router'

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
 * 读取 localStorage 中的 library_token，
 * 没有 token 且目标页面需要鉴权时，强制跳转到 /login
 */
router.beforeEach((to) => {
  const token = localStorage.getItem('library_token')
  // requiresAuth 为 true 表示该页面需要登录才能访问
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
  // 已登录用户访问登录页，跳回首页
  if (to.path === '/login' && token) {
    return '/'
  }
  return true
})

export default router