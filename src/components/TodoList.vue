<script setup lang="ts">
defineProps<{
  items: string[]
}>()

const emit = defineEmits<{
  (e: 'remove', index: number): void
}>()
</script>

<template>
  <ul v-if="items.length" class="todo-list">
    <li v-for="(item, index) in items" :key="index">
      {{ item }}
      <button @click="emit('remove', index)">删除</button>
    </li>
  </ul>

  <p v-else class="empty">清单是空的，快添加一件物品吧～</p>
</template>

<style scoped>
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

li button {
  border: none;
  background: none;
  color: #e74c3c;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #999;
}
</style>