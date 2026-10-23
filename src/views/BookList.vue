<script setup>
// 图书列表页（Layout 的子路由）
</script>

<template>
  <div class="book-list">
    <h2>图书列表</h2>
    <table>
      <thead>
        <tr>
          <th>书名</th>
          <th>作者</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Vue.js 权威指南</td>
          <td>尤雨溪</td>
          <td>可借阅</td>
        </tr>
        <tr>
          <td>JavaScript 高级程序设计</td>
          <td>Nicholas</td>
          <td>已借出</td>
        </tr>
        <tr>
          <td>深入浅出 Node.js</td>
          <td>朴灵</td>
          <td>可借阅</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.book-list table {
  width: 100%;
  border-collapse: collapse;
}

.book-list th,
.book-list td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.book-list th {
  background: #f5f5f5;
}
</style>