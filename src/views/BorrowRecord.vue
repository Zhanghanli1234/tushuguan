<script setup lang="ts">
// 简化示例：写死几条借阅记录用于展示，dueDate 为到期日
const records = [
  { id: 1, book: 'Vue 3 实战', date: '2026-10-01', dueDate: '2026-10-20', status: '已归还' },
  { id: 2, book: '计算机网络', date: '2026-10-15', dueDate: '2026-10-25', status: '借阅中' },
  { id: 3, book: '算法导论', date: '2026-10-15', dueDate: '2026-10-25', status: '借阅中' },
]

// 状态映射：给 el-tag 配置 type，让不同状态显示不同颜色
const statusMap: Record<string, string> = {
  已归还: 'success',
  借阅中: 'warning',
}

// 按到期日分组：{ '2026-10-25': ['计算机网络', '算法导论'] }，供日历按天渲染
const dueMap = records.reduce<Record<string, string[]>>((acc, r) => {
  ;(acc[r.dueDate] ||= []).push(r.book)
  return acc
}, {})
</script>

<template>
  <div class="borrow-record">
    <h2>📖 借阅记录</h2>

    <!-- 表格展示借阅记录 -->
    <el-table :data="records" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="book" label="书名" min-width="200" />
      <el-table-column prop="date" label="借阅日期" width="160" />
      <!-- 状态列：用 el-tag 展示，颜色随状态变化 -->
      <el-table-column label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="statusMap[row.status] || 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 借阅日历：按到期日标记，悬停显示当天到期图书 -->
    <h2>📅 借阅日历</h2>
    <el-calendar>
      <!-- 自定义单元格：当天有到期图书时，用 tooltip 展示 -->
      <template #date-cell="{ data }">
        <div class="cal-cell">
          {{ data.day.slice(-2) }}
          <el-tooltip
            v-if="dueMap[data.day]?.length"
            :content="dueMap[data.day]?.join('、') || ''"
            placement="top"
          >
            <span class="cal-dot">●</span>
          </el-tooltip>
        </div>
      </template>
    </el-calendar>
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

.cal-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

/* 到期标记圆点 */
.cal-dot {
  color: #e65100;
  font-size: 10px;
  line-height: 1;
}
</style>