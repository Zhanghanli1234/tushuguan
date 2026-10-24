<script setup lang="ts">
import { ref } from 'vue'

// 1. 定义 emit：() => void 表示要发出的"事件名"
const emit = defineEmits<{
  add: [text: string] // 添加事件，携带一个 text 参数
}>()

// 2. 输入框内容由自己管理（这是 TodoInput 的内部状态）
const newItem = ref('')

// 3. 点击添加：把文字通过 emit 上报给父组件 App.vue
function handleAdd() {
  const text = newItem.value.trim()
  if (text === '') return // 空内容不上报
  emit('add', text) // 👈 通知父组件："我要添加这个商品"
  newItem.value = '' // 清空输入框
}
</script>

<template>
  <div class="todo-input">
    <input
      v-model="newItem"
      type="text"
      placeholder="输入要购买的商品..."
      @keyup.enter="handleAdd"
    />
    <button @click="handleAdd">添加</button>
  </div>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.todo-input input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.todo-input button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
</style>