<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user' // 引入 user store
import { login } from '../api/auth' // 登录接口

const router = useRouter()
const userStore = useUserStore() // 获取 store 实例

const username = ref('') // 用户名输入框

// 点击登录：调接口成功后写入 store，再跳转
async function handleLogin() {
  if (!username.value.trim()) return // 用户名为空不登录
  try {
    const res: any = await login(username.value) // 请求 /api/login → { token, userInfo }
    userStore.token = res.token // 存入 user store
    userStore.userInfo = res.userInfo
    router.push('/') // 跳转到图书列表页
  } catch (e: any) {
    // 显示真实错误，便于排查（正式环境可换成 toast）
    alert('登录失败：' + (e?.message || JSON.stringify(e)))
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-icon">📚</div>
      <h1>图书系统</h1>
      <p class="subtitle">欢迎回来，请登录</p>

      <label class="field">
        <span>用户名</span>
        <input
          v-model="username"
          type="text"
          placeholder="请输入用户名"
          @keyup.enter="handleLogin"
        />
      </label>

      <button class="login-btn" @click="handleLogin">登 录</button>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 渐变背景 */
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.login-card {
  width: 360px;
  padding: 40px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.login-icon {
  font-size: 48px;
}

.login-card h1 {
  margin: 12px 0 4px;
  color: #333;
}

.subtitle {
  margin: 0 0 28px;
  color: #999;
  font-size: 14px;
}

.field {
  display: block;
  text-align: left;
  margin-bottom: 20px;
}

.field span {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}

.field input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.login-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-size: 16px;
  letter-spacing: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.login-btn:hover {
  opacity: 0.9;
}
</style>