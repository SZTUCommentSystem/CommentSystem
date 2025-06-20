<template>
  <div class="flex-container bg-white p-4">
    <div class="filter-container mb-3 d-flex justify-content-between flex-row align-items-center">
      <div class="d-flex flex-row align-items-center">
        <el-select v-model="selectedStatus" class="inputclass" placeholder="班级状态" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="未开课" value="1"></el-option>
          <el-option label="授课中" value="2"></el-option>
          <el-option label="已结课" value="3"></el-option>
        </el-select>
        <el-input v-model="searchQuery" placeholder="搜索班级名字" class="ms-2 inputclass" clearable />
      </div>
      <el-button type="primary" @click="createClass">新建班级</el-button>
    </div>
    <div class="card-container">
      <el-card v-for="(classItem, index) in filteredClasses" :key="index"
        :class="['custom-card', { 'teaching': classItem.classState === '1' || '2', 'completed': classItem.classState === '3' }]"
        style="text-align: center; cursor: pointer;" @click="$router.push({ name: 'classdetail', query: { classId: classItem.classId } })">
        <template #header>
          <div class="card-header">
            <span>{{ classItem.className }}</span>
          </div>
        </template>
        <el-statistic title="班级平均分" :value="classItem.svgNum" />
        <el-countdown v-if="classItem.lastTime" title="最近作业截止时间" :value="classItem.lastTime" />
        <template #footer>
          {{ classStates[Number(classItem.classState)] }}
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { classListAPI } from '@/api/ClassAPI/index';

defineOptions({ name: 'class' })

// 定义班级数据类型
interface ClassItem {
  classId: string //班级id（唯一）“非空”
  courseIds: string //课程id
	className: string   //班级名称
	classState: string  //班级状态（1 未开课，2 授课中，3已结课）
  lastTime: string  //最近作业截止时间
  svgNum: number  //平均分
}
// 班级状态数组
const classStates = ['', '未开课', '授课中', '已结课'];

const classes = ref<ClassItem[]>([]);
const searchQuery = ref('');
const selectedStatus = ref('');
const filteredClasses = computed(() => {
  return classes.value?.filter(classItem => {
    const matchesStatus = selectedStatus.value ? classItem.classState === selectedStatus.value : true;
    const matchesSearch = classItem.className.includes(searchQuery.value);
    return matchesStatus && matchesSearch;
  });
});

const createClass = () => {
  // 新建班级的逻辑
};

const getClassList = async () => {
  try {
    const res = await classListAPI();
    classes.value = res.data.rows;
    console.log('获取班级列表成功:', classes.value);
  } catch (error) {
    console.error('获取班级列表失败:', error);
  }
};

onMounted(() => {
  getClassList();
});
</script>

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

.inputclass {
  width: 150px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
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

.card-header {
  font-size: large;
  font-weight: bold
}

@media (max-width: 768px) {
  .custom-card {
    width: 160px;
  }

  .card-container {
    gap: 20px;
  }

  .inputclass {
    width: 100px;

    font-size: 12px;
  }

  .card-header {
    font-size: medium;
  }
}
</style>