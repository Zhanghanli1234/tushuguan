<script setup lang="ts">
</script>

<template>
  <div class="layout">
    <!-- 侧边菜单 -->
    <aside class="sidebar">
      <h2 class="logo">📚 图书系统</h2>
      <nav>
        <!-- RouterLink 是路由提供的"链接"组件，点击跳转到指定路由 -->
        <RouterLink to="/">图书列表</RouterLink>
        <RouterLink to="/borrow">借阅记录</RouterLink>
      </nav>
    </aside>

    <!-- 主区域：RouterView 是根据当前路由动态渲染内容的"出口" -->
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex; /* 左右布局 */
  min-height: 100vh;
}

.sidebar {
  width: 220px;                 /* 固定侧边栏宽度 */
  background: #2c3e50;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logo {
  font-size: 18px;
  margin: 0;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* RouterLink 渲染出的 <a> 标签样式 */
.sidebar a {
  color: #cfd8dc;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 6px;
  transition: 0.2s;
}

.sidebar a:hover {
  background: #34495e;
  color: #fff;
}

/* 当前激活的路由链接高亮 */
.sidebar a.router-link-active {
  background: #42b883;
  color: #fff;
}

.content {
  flex: 1; /* 占满剩余宽度 */
  padding: 24px;
  background: #f5f7fa;
}
</style>