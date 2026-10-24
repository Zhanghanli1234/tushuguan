<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBooks, addBook, updateBook, deleteBook } from '../api/book' // 图书相关接口

const books = ref<any[]>([]) // 图书数据
const loading = ref(true) // 是否加载中

// 弹窗状态
const dialogVisible = ref(false) // 是否显示弹窗
const formTitle = ref('') // 弹窗标题：新增 / 编辑
const editingId = ref(null) // 当前编辑的 id，新增时为 null
const form = ref({ title: '', author: '', category: '' }) // 表单内容

// 拉取图书列表
async function loadBooks() {
  loading.value = true
  try {
    const res: any = await getBooks(1) // 请求 /api/books
    books.value = res.list
  } finally {
    loading.value = false
  }
}

// 打开新增弹窗（清空表单）
function openAdd() {
  editingId.value = null
  form.value = { title: '', author: '', category: '' }
  formTitle.value = '新增图书'
  dialogVisible.value = true
}

// 打开编辑弹窗（预填当前数据）
function openEdit(book: any) {
  editingId.value = book.id
  form.value = { title: book.title, author: book.author, category: book.category }
  formTitle.value = '编辑图书'
  dialogVisible.value = true
}

// 提交：根据是否有 id 决定新增或编辑
async function handleSubmit() {
  if (!form.value.title.trim()) return // 书名必填
  if (editingId.value) {
    await updateBook(editingId.value, form.value) // 编辑
  } else {
    await addBook(form.value) // 新增
  }
  dialogVisible.value = false // 关弹窗
  loadBooks() // 刷新列表
}

// 删除
async function handleDelete(book: any) {
  if (!confirm(`确定删除《${book.title}》吗？`)) return
  await deleteBook(book.id)
  loadBooks() // 刷新列表
}

onMounted(loadBooks) // 挂载后自动加载
</script>

<template>
  <div class="book-list">
    <!-- 标题栏 + 新增按钮 -->
    <div class="header">
      <h2>📚 图书列表</h2>
      <button class="add-btn" @click="openAdd">＋ 新增图书</button>
    </div>

    <!-- 加载中 / 空数据提示 -->
    <p v-if="loading" class="tip">加载中...</p>
    <p v-else-if="books.length === 0" class="tip">暂无图书数据</p>

    <!-- 图书卡片列表 -->
    <ul v-else class="book-grid">
      <li v-for="book in books" :key="book.id" class="book-card">
        <span class="book-cover">📗</span>
        <div class="book-info">
          <span class="book-title">{{ book.title }}</span>
          <span class="book-meta">{{ book.author }}</span>
        </div>
        <span class="category">{{ book.category }}</span>
        <div class="ops">
          <button class="op-btn edit" @click="openEdit(book)">编辑</button>
          <button class="op-btn del" @click="handleDelete(book)">删除</button>
        </div>
      </li>
    </ul>

    <!-- 新增 / 编辑弹窗 -->
    <div v-if="dialogVisible" class="dialog-mask" @click.self="dialogVisible = false">
      <div class="dialog">
        <h3>{{ formTitle }}</h3>
        <label>
          <span>书名</span>
          <input v-model="form.title" type="text" placeholder="请输入书名" />
        </label>
        <label>
          <span>作者</span>
          <input v-model="form.author" type="text" placeholder="请输入作者" />
        </label>
        <label>
          <span>分类</span>
          <input v-model="form.category" type="text" placeholder="请输入分类" />
        </label>
        <div class="dialog-actions">
          <button class="cancel" @click="dialogVisible = false">取消</button>
          <button class="save" @click="handleSubmit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-list {
  font-family: inherit;
  color: #333;
}

.header {
  display: flex;
  justify-content: space-between; /* 标题在左，新增按钮在右 */
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 22px;
  color: #2c3e50;
}

.add-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.add-btn:hover {
  opacity: 0.9;
}

.book-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 自适应多列 */
  gap: 14px;
}

.book-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s, box-shadow 0.15s;
}

.book-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.book-cover {
  font-size: 34px;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.book-title {
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 超长省略号 */
}

.book-meta {
  font-size: 13px;
  color: #999;
}

.category {
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e3f2fd;
  color: #1565c0;
  font-size: 12px;
}

.ops {
  display: flex;
  gap: 6px;
}

.op-btn {
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.op-btn.edit {
  background: #e3f2fd;
  color: #1565c0;
}

.op-btn.del {
  background: #ffebee;
  color: #c62828;
}

.tip {
  padding: 24px;
  text-align: center;
  color: #999;
  background: #fff;
  border-radius: 12px;
}

/* 弹窗遮罩 */
.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); /* 半透明遮罩 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  width: 360px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.dialog h3 {
  margin: 0 0 16px;
  color: #333;
}

.dialog label {
  display: block;
  margin-bottom: 14px;
}

.dialog label span {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.dialog input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

.dialog input:focus {
  border-color: #667eea;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.dialog-actions button {
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.cancel {
  background: #eee;
  color: #666;
}

.save {
  background: #667eea;
  color: #fff;
}
</style>