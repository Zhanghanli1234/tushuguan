<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus' // 消息确认框 / 提示
import type { FormInstance } from 'element-plus' // el-form 实例类型
import { getBooks, addBook, updateBook, deleteBook } from '../api/book' // 图书接口
import MyPagination from '../components/MyPagination.vue' // 通用分页组件

const books = ref<{ id: number; title: string; author: string; rating: number; available: boolean; stock: number }[]>([]) // 图书数据
const loading = ref(true) // 表格加载状态

// 查询条件：页码、每页条数、关键词
const page = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const total = ref(0) // 总条数

// 弹窗状态
const dialogVisible = ref(false) // 是否显示新增/编辑弹窗
const editingId = ref<number | null>(null) // 编辑中的 id，新增为 null
const formRef = ref<FormInstance>() // el-form 实例，用于触发校验
// 表单内容：书名、作者、评分、是否上架、库存
const form = reactive({ title: '', author: '', rating: 0, available: true, stock: 1 })

// 校验规则：书名、作者均必填
const rules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
}

// 拉取图书列表
async function loadBooks() {
  loading.value = true
  try {
    const res: any = await getBooks({ page: page.value, pageSize: pageSize.value, keyword: keyword.value })
    books.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 搜索：回到第一页再查询
function handleSearch() {
  page.value = 1
  loadBooks()
}

// 打开新增弹窗（清空表单并重置校验）
function openAdd() {
  editingId.value = null
  form.title = ''
  form.author = ''
  form.rating = 0 // 重置评分
  form.available = true // 重置上架状态
  form.stock = 1 // 重置库存
  formRef.value?.clearValidate() // 清除历史校验提示
  dialogVisible.value = true
}

// 打开编辑弹窗（回填当前行数据）
function openEdit(row: { id: number; title: string; author: string; rating: number; available: boolean; stock: number }) {
  editingId.value = row.id
  form.title = row.title
  form.author = row.author
  form.rating = row.rating
  form.available = row.available
  form.stock = row.stock
  formRef.value?.clearValidate() // 清除历史校验提示
  dialogVisible.value = true
}

// 提交：先 validate 通过，再根据是否有 id 调新增或编辑接口
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false) // 校验失败返回 false
  if (!valid) return // 校验未通过则直接返回

  if (editingId.value) {
    await updateBook(editingId.value, { ...form }) // 编辑
  } else {
    await addBook({ ...form }) // 新增
  }
  dialogVisible.value = false // 关闭弹窗
  loadBooks() // 刷新列表
}

// 删除：ElMessageBox 二次确认，确认后调接口并刷新
async function handleDelete(row: any) {
  try {
    // 用户点取消会 reject，走 catch 直接返回
    await ElMessageBox.confirm(`确定删除《${row.title}》吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteBook(row.id) // 调删除接口
    ElMessage.success('删除成功')
    loadBooks() // 刷新列表
  } catch {}
}

onMounted(loadBooks) // 挂载后自动加载
</script>

<template>
  <div class="book-list">
    <!-- 标题栏 + 新增按钮 -->
    <div class="header">
      <h2>📚 图书列表</h2>
      <el-button type="primary" @click="openAdd">＋ 新增图书</el-button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索书名或作者"
        style="width: 240px"
        clearable
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 图书表格：标题、作者、操作三列 -->
    <el-table :data="books" v-loading="loading" style="width: 100%">
      <!-- 空数据提示 -->
      <template #empty>
        <el-empty description="暂无数据" />
      </template>

      <el-table-column prop="title" label="书名" min-width="200" />
      <el-table-column prop="author" label="作者" min-width="180" />
      <!-- 评分列：用 el-rate 展示（disabled 只读） -->
      <el-table-column label="评分" width="180">
        <template #default="{ row }">
          <el-rate :model-value="row.rating" disabled />
        </template>
      </el-table-column>
      <!-- 上架状态列 -->
      <el-table-column label="上架" width="100">
        <template #default="{ row }">
          <el-tag :type="row.available ? 'success' : 'info'">
            {{ row.available ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 库存列 -->
      <el-table-column prop="stock" label="库存" width="90" />

      <!-- 操作列：编辑 / 删除 -->
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 通用分页器：双向绑定页码/每页条数，变化时重新请求 -->
    <MyPagination
      :total="total"
      v-model:page="page"
      v-model:page-size="pageSize"
      @change="loadBooks"
    />

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑图书' : '新增图书'" width="420px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="60px">
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <!-- 评分：星级交互 -->
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="form.rating" />
        </el-form-item>
        <!-- 上架状态开关 -->
        <el-form-item label="上架" prop="available">
          <el-switch v-model="form.available" active-text="上架" inactive-text="下架" />
        </el-form-item>
        <!-- 库存数量：数字输入 -->
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.book-list {
  font-family: inherit;
  color: #333;
}

.header {
  display: flex; /* 标题在左，新增按钮在右 */
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 22px;
  color: #2c3e50;
}

.search-bar {
  display: flex; /* 搜索框 + 按钮水平排列 */
  gap: 10px;
  margin-bottom: 16px;
}
</style>