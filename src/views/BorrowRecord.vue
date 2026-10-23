<script setup>
// 借阅记录页（Layout 的子路由）
</script>

<template>
  <div class="borrow-record">
    <h2>借阅记录</h2>
    <table>
      <thead>
        <tr>
          <th>书名</th>
          <th>借阅人</th>
          <th>借阅日期</th>
          <th>归还日期</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>JavaScript 高级程序设计</td>
          <td>张三</td>
          <td>2026-10-01</td>
          <td>未归还</td>
        </tr>
        <tr>
          <td>深入浅出 Node.js</td>
          <td>李四</td>
          <td>2026-09-20</td>
          <td>2026-10-05</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.borrow-record table {
  width: 100%;
  border-collapse: collapse;
}

.borrow-record th,
.borrow-record td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.borrow-record th {
  background: #f5f5f5;
}
</style>