<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 简化示例：写死几条图书数据用于展示
const books = [
  { id: 1, title: 'Vue 3 实战', author: '张三' },
  { id: 2, title: 'TypeScript 完全指南', author: '李四' },
  { id: 3, title: '计算机网络', author: '王五' },
]

// 退出登录
function handleLogout() {
  localStorage.removeItem('library_token') // 删除登录凭证
  router.push('/login') // 跳转到登录页
}
</script>

<template>
  <div class="book-list">
    <div class="header">
      <h2>图书列表</h2>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>

    <ul>
      <li v-for="book in books" :key="book.id">
        {{ book.title }} —— {{ book.author }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.book-list {
  font-family: sans-serif;
  line-height: 1.8;
}

.header {
  display: flex;
  justify-content: space-between; /* 标题在左，按钮在右 */
  align-items: center;
}

.logout-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #e74c3c;
  color: #fff;
  cursor: pointer;
}

.book-list li {
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}
</style>