<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟登录
function handleLogin() {
  localStorage.setItem('library_token', 'mock-token') // 存登录凭证
  router.push('/') // 跳转到图书列表页（根路径）
}
</script>

<template>
  <div class="login">
    <h1>图书系统登录</h1>
    <button @click="handleLogin">模拟登录</button>
  </div>
</template>

<style scoped>
.login {
  max-width: 320px;
  margin: 160px auto;
  text-align: center;
  font-family: sans-serif;
}

.login h1 {
  margin-bottom: 24px;
}

.login button {
  padding: 10px 32px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
</style>