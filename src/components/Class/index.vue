<script setup lang="ts">
import {computed, ref} from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const classes = ref([
  { name: '23商务环设', students: 95, averageScore: 72, deadline: Date.now() + 1000 * 60 * 60 * 7, status: '授课中' },
  { name: '23新媒体艺科', students: 102, averageScore: 65, deadline: Date.now() + 1000 * 60 * 60 * 8.5, status: '授课中' },
  { name: '23工设', students: 98, averageScore: 78, deadline: Date.now() + 1000 * 60 * 60 * 12, status: '授课中' },
  { name: '23商英', students: 110, averageScore: 55, status: '已结课' },
  { name: '23计科', students: 90, averageScore: 60, status: '已结课' },
]);
const searchQuery = ref('');
const selectedStatus = ref('');
const filteredClasses = computed(() => {
  return classes.value.filter(classItem => {
    const matchesStatus = selectedStatus.value ? classItem.status === selectedStatus.value : true;
    const matchesSearch = classItem.name.includes(searchQuery.value);
    return matchesStatus && matchesSearch;
  });
});

const createClass = () => {
  // 新建班级的逻辑
};
</script>

<template>
  <div class="flex-container bg-white p-4">
    <div class="filter-container mb-3 d-flex justify-content-between flex-row align-items-center">
      <div class="d-flex flex-row align-items-center">
        <el-select v-model="selectedStatus" style="width: 150px">
          <el-option label="全部" value=""></el-option>
          <el-option label="授课中" value="授课中"></el-option>
          <el-option label="已结课" value="已结课"></el-option>
        </el-select>
        <el-input v-model="searchQuery" placeholder="搜索班级名字" class="ms-2" style="width: 150px" clearable />
      </div>
      <el-button type="primary" @click="createClass">新建班级</el-button>
    </div>
    <div class="card-container">
      <el-card
          v-for="(classItem, index) in filteredClasses"
          :key="index"
          :class="['custom-card', { 'teaching': classItem.status === '授课中', 'completed': classItem.status === '已结课' }]"
          style="text-align: center; cursor: pointer;"
          @click="$router.push(`/home/classdetail/${index + 1}`)"
      >
        <template #header>
          <div class="card-header">
            <span style="font-size: large; font-weight: bold">{{ classItem.name }}</span>
          </div>
        </template>
        <el-statistic title="学生成员" :value="classItem.students" />
        <el-statistic title="班级平均分" :value="classItem.averageScore" />
        <el-countdown title="最近作业截止时间" :value="classItem.deadline" />
        <template #footer>
          {{ classItem.status }}
        </template>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
}

.custom-card {
  width: 260px;
  justify-content: center;
  align-items: center;
}

.custom-card.teaching {
  border-color: rgba(144, 238, 144, 0.7);
  border-width: 2px;
}

.custom-card.completed {
  border-color: rgba(240, 128, 128, 0.5);
  border-width: 2px;
}

.custom-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>