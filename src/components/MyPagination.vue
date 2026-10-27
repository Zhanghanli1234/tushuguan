<script setup lang="ts">
import { computed } from 'vue'

// 通用分页组件：封装 el-pagination，通过 v-model 双向绑定页码与每页条数

// props：
// total     - 总条数
// page      - 当前页码（v-model:page 绑定）
// pageSize  - 每页条数（v-model:page-size 绑定）
const props = defineProps({
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
})

// emits：页码/每页条数变化时通知父组件
const emit = defineEmits<{
  (e: 'update:page', val: number): void
  (e: 'update:pageSize', val: number): void
  (e: 'change'): void // 触发父组件重新请求
}>()

// 当前页码：双向绑定代理，切换后同步父组件并触发 change
const current = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
    emit('change')
  },
})

// 每页条数：切换后同步父组件并触发 change，同时页码回到第 1 页
const size = computed({
  get: () => props.pageSize,
  set: (val) => {
    current.value = 1 // 每页条数变化通常回到第一页
    emit('update:pageSize', val)
    emit('change')
  },
})
</script>

<template>
  <el-pagination
    v-model:current-page="current"
    v-model:page-size="size"
    :total="total"
    :page-sizes="[5, 10, 20]"
    layout="total, sizes, prev, pager, next"
    class="my-pagination"
  />
</template>

<style scoped>
.my-pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>