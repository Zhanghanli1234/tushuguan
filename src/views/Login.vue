<script setup>
// 登录页：输入用户名，登录后跳转到图书列表
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 输入框绑定的用户名
const username = ref('')

// 点击登录：调用 store 的 login 方法，成功后跳图书列表
function handleLogin() {
  if (!username.value.trim()) return // 用户名为空则不提交
  userStore.login(username.value.trim())
  router.push('/books')
}
</script>

<template>
  <div class="login-page">
    <h1>图书系统登录</h1>
    <!-- 用户名输入框，v-model 双向绑定 -->
    <input
      class="login-input"
      v-model="username"
      type="text"
      placeholder="请输入用户名"
      @keyup.enter="handleLogin"
    />
    <button class="login-btn" @click="handleLogin">登录</button>
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

/* 用户名输入框 */
.login-input {
  width: 100%;
  max-width: 320px;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  outline: none;
}

/* 输入框聚焦时的边框高亮 */
.login-input:focus {
  border-color: #42b883;
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