<script setup>
// 登录页 - 模拟登录：写入 token 后跳转到图书列表
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟登录：存 token + 跳转图书列表
function handleLogin() {
  localStorage.setItem('library_token', 'demo-token')
  router.push('/books')
}
</script>

<template>
  <div class="login-page">
    <h1>图书系统登录</h1>
    <button class="login-btn" @click="handleLogin">模拟登录</button>
  </div>
</template>

<style scoped>
/* 登录页容器：全屏居中 */
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  background: #f5f5f5;
}

.login-page h1 {
  color: #2c3e50;
  margin-bottom: 24px;
  font-size: 28px;
  text-align: center;
}

.login-btn {
  width: 100%;
  max-width: 320px;
  padding: 12px 32px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.login-btn:hover {
  background: #369b6e;
}

/* ===== 手机端适配（屏幕宽度 ≤ 480px） ===== */
@media (max-width: 480px) {
  .login-page h1 {
    font-size: 22px;
  }

  .login-btn {
    padding: 14px 32px;
    font-size: 15px;
  }
}
</style>