<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore() // 读取当前用户

// 退出登录：清空状态后跳回登录页
function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="layout">
    <!-- 左侧侧边栏 -->
    <aside class="sidebar">
      <div class="logo">📚 图书借阅</div>

      <!-- 顶部显示当前登录用户名 -->
      <div class="user-info">👤 {{ userStore.username }}</div>

      <nav class="menu">
        <RouterLink to="/" class="menu-item">📗 图书列表</RouterLink>
        <RouterLink to="/borrow" class="menu-item">📋 借阅记录</RouterLink>
      </nav>

      <!-- 底部退出登录按钮 -->
      <button class="logout-btn" @click="handleLogout">🚪 退出登录</button>
    </aside>

    <!-- 右侧主区域：渲染当前子路由 -->
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  background: linear-gradient(180deg, #2c3e50, #34495e); /* 深色渐变 */
  color: #ecf0f1;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  padding: 8px 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  margin-top: 16px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-size: 14px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 24px;
}

.menu-item {
  display: block;
  padding: 11px 14px;
  color: #bdc3c7;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* 当前激活的菜单项高亮 */
.menu-item.router-link-active {
  background: #667eea;
  color: #fff;
}

.logout-btn {
  margin-top: auto; /* 推到侧边栏底部 */
  padding: 11px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  color: #ecf0f1;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(231, 76, 60, 0.8);
}

.content {
  flex: 1;
  padding: 32px;
  background: #f0f2f5;
}
</style>