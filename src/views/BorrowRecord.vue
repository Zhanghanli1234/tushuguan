<script setup lang="ts">
// 简化示例：写死几条借阅记录用于展示
const records = [
  { id: 1, book: 'Vue 3 实战', date: '2026-10-01' },
  { id: 2, book: '计算机网络', date: '2026-10-15' },
]
</script>

<template>
  <div class="borrow-record">
    <h2>借阅记录</h2>
    <ul>
      <li v-for="record in records" :key="record.id">
        借阅《{{ record.book }}》 —— {{ record.date }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.borrow-record {
  font-family: sans-serif;
  line-height: 1.8;
}

.borrow-record li {
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}
</style>