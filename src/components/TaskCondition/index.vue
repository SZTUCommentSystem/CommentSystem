<template>
  <div class="create-wrapper">
    <div class="header">
      <el-page-header @back="router.go(-1)" content="查看作业" title="返回">
      </el-page-header>
    </div>
    <div class="list">
      <div class="list-header">
        <h3>班级列表</h3>
      </div>
      <el-table :data="classList" style="width: 100%"
        :header-cell-style="{ backgroundColor: 'rgb(246, 247, 249)', textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }" :row-style="{ height: '50px' }"
        :header-row-style="{ height: '70px' }">
        <el-table-column prop="classId" label="序号" width="100" />
        <el-table-column prop="className" label="班级" width="180" />
        <el-table-column label="学生人数" width="180">
          <template #default="{ row }">
            {{ row.student ? row.student.length : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="svgNum" label="平均分" width="180" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="goDetail(row)">查看作业</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>


</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { classDetailAPI } from '@/api/ClassAPI'

const router = useRouter()
const route = useRoute()
const homeworkId = Number(route.query.id)

interface Class {
  classId: number
  className: string
  svgNum: string
}

const classIds = Array.isArray(route.query.classIds)
  ? route.query.classIds
  : (typeof route.query.classIds === 'string' ? route.query.classIds.split(',') : []);
const classList = ref<Class[]>([])

const getClassList = async () => {
  const classPromises = classIds.map(async (id) => {
    const re = await classDetailAPI(Number(id));
    if (re.data.code == 200) {
      return {
        classId: re.data.data.classId,
        className: re.data.data.className,
        svgNum: re.data.data.svgNum ?? 0,
      }
    }
    return null
  })
  const classResults = await Promise.all(classPromises)
  classList.value = classResults.filter(item => item !== null)
}

const goDetail = (row: Class) => {
  router.push({
    name: 'taskconditionDetail',
    query: {
      classId: row.classId,
      homeworkId: homeworkId
    }
  })
}

onMounted(() => {
  getClassList()
})
</script>


<style scoped>
.create-wrapper {
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    background-color: white;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px
}

.list {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 30px;
    width: 100%;
    min-height: calc(100vh - 100px);
    background-color: #fff;

    .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}

.pageing {
    display: flex;
    justify-content: end;
    padding: 20px;
    padding-top: 3dvh;
    margin-top: auto;
}

.isRed {
    color: red;
}

.isSubmit {
    color: #409EFF;
}

.isCorrect {
    color: #67C23A;
}
</style>
