<script setup lang="ts">
// 1. 通过 props 接收父组件(App.vue)传来的 list
// 注意：template 里直接写 list 即可（无需 props. 前缀）
defineProps<{
  list: string[]
}>()

// 2. 定义 emit：删除需要通知父组件真正删除数据
const emit = defineEmits<{
  remove: [index: number] // 删除事件，携带下标
}>()

// 3. 点击删除：把下标上报给父组件
function handleRemove(index: number) {
  emit('remove', index)
}
</script>

<template>
  <div class="todo-list">
    <!-- v-for 渲染列表，数据来自 props.list（模板里直接写 list） -->
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <span>{{ item }}</span>
        <button class="delete-btn" @click="handleRemove(index)">删除</button>
      </li>
    </ul>

    <!-- 空列表提示 -->
    <p v-if="list.length === 0" class="empty-tip">清单为空，快添加第一件商品吧 ~</p>
  </div>
</template>

<style scoped>
.todo-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
}

.delete-btn {
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  background: #e74c3c;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}

.empty-tip {
  text-align: center;
  color: #999;
  margin-top: 20px;
}
</style>