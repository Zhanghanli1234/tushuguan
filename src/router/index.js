import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    // 路由懒加载：访问时才加载 Login 组件
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    name: 'Layout',
    // 父布局(Layout 组件在 components 目录)，用嵌套路由承载子页面
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true }, // 需要登录才能访问
    children: [
      {
        path: '',
        component: () => import('../views/BookList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'borrow',
        component: () => import('../views/BorrowRecord.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  // 404 兜底：匹配任意未定义路径，重定向到登录页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 每次跳转后控制页面滚动位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition // 浏览器前进/后退时恢复滚动位置
    }
    return { top: 0 } // 否则默认回到顶部
  },
})

// 全局前置守卫：路由跳转前执行
router.beforeEach((to) => {
  // 从 localStorage 读取登录状态
  const token = localStorage.getItem('library_token')

  // 需要登录的页面 + 未登录 → 跳去登录页
  if (to.meta.requiresAuth && !token) {
    return { path: '/login' }
  }

  // 已登录时访问登录页 → 跳回首页
  if (to.path === '/login' && token) {
    return { path: '/' }
  }
})

export default router