<script setup lang="ts">
// 简化示例：写死几条借阅记录用于展示
const records = [
  { id: 1, book: 'Vue 3 实战', date: '2026-10-01', status: '已归还' },
  { id: 2, book: '计算机网络', date: '2026-10-15', status: '借阅中' },
]
</script>

<template>
  <div class="borrow-record">
    <h2>📖 借阅记录</h2>

    <ul class="record-list">
      <li v-for="record in records" :key="record.id" class="record-item">
        <div class="record-info">
          <span class="book-title">《{{ record.book }}》</span>
          <span class="book-date">借阅于 {{ record.date }}</span>
        </div>
        <span
          class="status"
          :class="record.status === '借阅中' ? 'borrowing' : 'returned'"
        >
          {{ record.status }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.borrow-record {
  font-family: inherit;
  color: #333;
}

h2 {
  margin: 0 0 20px;
  font-size: 22px;
  color: #2c3e50;
}

.record-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s, box-shadow 0.15s;
}

.record-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.record-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-title {
  font-weight: 600;
  font-size: 15px;
}

.book-date {
  font-size: 13px;
  color: #999;
}

.status {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.borrowing {
  background: #fff3e0;
  color: #e65100;
}

.returned {
  background: #e8f5e9;
  color: #2e7d32;
}
</style>