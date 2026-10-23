<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'add', name: string): void
}>()

const itemText = ref('')

function handleAdd() {
  const value = itemText.value.trim()
  if (!value) return
  emit('add', value)
  itemText.value = ''
}
</script>

<template>
  <div class="todo-input">
    <input
      v-model="itemText"
      type="text"
      placeholder="输入要买的物品…"
      @keyup.enter="handleAdd"
    />
    <button @click="handleAdd">添加</button>
  </div>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.todo-input input {
  flex: 1;
  padding: 8px;
  font-size: 1rem;
}

.todo-input button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #42b883;
  color: #fff;
  cursor: pointer;
}
</style>