<script setup lang="ts">
// 布局组件：侧边菜单 + 主内容区
import { useRouter } from 'vue-router'

const router = useRouter()

// 退出登录：清除 token，跳回登录页
function handleLogout() {
  localStorage.removeItem('library_token')
  router.push('/login')
}
</script>

<template>
  <div class="layout">
    <!-- ===== 侧边栏菜单 ===== -->
    <aside class="sidebar">
      <h2 class="logo">📚 图书系统</h2>
      <nav class="menu">
        <RouterLink to="/books">图书列表</RouterLink>
        <RouterLink to="/records">借阅记录</RouterLink>
      </nav>

      <!-- 退出登录按钮：固定在侧边栏底部 -->
      <button class="logout" @click="handleLogout">退出登录</button>
    </aside>

    <!-- ===== 主内容区：渲染嵌套子页面 ===== -->
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  display: flex;
  flex-direction: column;
  width: 200px;
  padding: 20px 0;
  background: #2c3e50;
  color: #fff;
}

.logo {
  padding: 0 20px;
  font-size: 18px;
}

.menu {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.menu a {
  padding: 12px 20px;
  color: #fff;
  text-decoration: none;
}

/* 当前激活的菜单项高亮 */
.menu a.router-link-active {
  background: #42b883;
}

/* 退出登录按钮：flex 撑开到侧边栏底部 */
.logout {
  margin-top: auto; /* 将按钮推到侧边栏底部 */
  margin-left: 20px;
  margin-right: 20px;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 4px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.logout:hover {
  background: #e74c3c;
  border-color: #e74c3c;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
  overflow-y: auto;
}
</style>