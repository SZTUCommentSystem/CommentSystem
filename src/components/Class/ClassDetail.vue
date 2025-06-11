<template>
  <div class="flex-container ">
    <div class="header">
      <el-page-header @back="router.push('/home/class')" content="班级详情" title="返回" >
      </el-page-header>
    </div>
    <div class="flex-container bg-white p-4">
      <div class="static">
         <h3 class="section-title">班级数据总览</h3>
         <el-row>
           <el-col :span="6">
             <el-statistic title="总布置作业" :value="26" />
           </el-col>
           <el-col :span="6">
             <el-statistic :value="72">
               <template #title>
                 <div style="display: inline-flex; align-items: center">
                  班级平均分
                 </div>
               </template>
               <template #suffix>/100</template>
             </el-statistic>
           </el-col>
         </el-row>
       </div>
      <div class="student-list">
        <h3 class="section-title">学生列表</h3>
        <el-table :data="paginatedStudents" style="width: 100%">
          <el-table-column type="index" label="序号"  width="100px"></el-table-column>
          <el-table-column prop="id" label="学生ID" ></el-table-column>
          <el-table-column prop="name" label="学生姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="moveClass(scope.row)" type="primary" size="small" plain>移动分班</el-button>
              <el-button @click="deleteStudent(scope.row)" type="danger" size="small" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: center; margin-top: 20px;margin-bottom: 20px;">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="students.length"
              :page-size="pageSize"
              @current-change="handlePageChange"
          />
        </div>
        <div class="work-list">
          <div class="section-header">
            <h3 class="section-title mt-4">已布置作业列表</h3>
            <el-button type="success" @click="publishTask">发布作业</el-button>
          </div>
          <div v-for="task in tasks" :key="task.id" class="task-item" @click.self="router.push('/home/task/taskcondition')">
            <div class="task-header m-2">
              <h5>作业标题：{{ task.title }}</h5>
            </div>
            <div class="task-tags m-2">
              <div v-for="tag in task.tags" :key="tag" class="task-tag">{{ tag }}</div>
            </div>
            <div class="p-4" @click.stop>
              <el-collapse>
                <el-collapse-item title="布置老师：胡某 截至时间：11：15" name="1">
                  <el-row :gutter="20">
                    <el-col :span="7" class="centered">
                      <div>
                        <el-statistic title="已提交" value="23/56">
                        </el-statistic>
                      </div>
                    </el-col>
                    <el-col :span="8" class="centered">
                      <div>
                        <el-statistic title="未提交" value="33/56">
                        </el-statistic>
                      </div>
                    </el-col>
                    <el-col :span="8" class="centered">
                      <div>
                        <el-statistic title="已批改" value="10/56">
                        </el-statistic>
                      </div>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
import type { ElPageHeader } from "element-plus";
import {computed, onMounted, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { classDetailAPI } from '@/api/ClassAPI/index'

const source = ref(0)
source.value = 72

const router = useRouter()
const route = useRoute()
//数据拟定
const students = ref(Array.from({ length: 50 }, (_, i) => ({
  id: `2022002020${String(i + 1).padStart(2, '0')}`,
  name: ['宋江', '卢俊义', '吴用', '公孙胜', '关胜', '林冲', '秦明', '呼延灼', '花荣', '柴进', '李应', '朱仝', '鲁智深', '武松', '董平', '张清', '杨志', '徐宁', '索超', '戴宗', '刘唐', '李逵', '史进', '穆弘', '雷横', '李俊', '阮小二', '张横', '阮小五', '张顺', '阮小七', '杨雄', '石秀', '解珍', '解宝', '燕青', '朱武', '黄信', '孙立', '宣赞', '郝思文', '韩滔', '彭玘', '单廷珪', '魏定国', '萧让', '裴宣', '欧鹏', '邓飞'][i % 50],
  grade: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
  phone: `1380000${String(i + 1).padStart(4, '0')}`,
  email: `student${i + 1}@example.com`
})))
// 获取学生列表
const getStudentsList = async () => {
  try {
    const res = await classDetailAPI(route.query.classId as string)
    students.value = res.data.rows
    console.log('获取学生列表成功:', students.value)
  } catch (error) {
    console.error('获取学生列表失败:', error)
  }
}


const currentPage = ref(1)
const pageSize = 10

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return students.value.slice(start, end)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
}
const moveClass = (student: { id: string; name: string; grade: string; phone: string; email: string }) => {
  console.log('移动分班:', student)
}

const deleteStudent = (student: { id: string }) => {
  students.value = students.value.filter(s => s.id !== student.id)
}
const tasks = ref([
  { id: 1, title: 'Task1', tags: ['Tag1', 'Tag2'] },
  { id: 2, title: 'Task2', tags: ['Tag3', 'Tag4'] },
  // Add more tasks as needed
]);


const viewTask = (taskId: number) => {
  console.log('查看作业:', taskId);
};

// 发布作业
const publishTask = () => {
  router.push('/home/task')
};

onMounted(() => {
  getStudentsList()
})
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.header {
  font-size: 20px;
  background-color: white;padding: 10px;
}
.el-col {
  text-align: center;
}
.student-list {
  margin-top: 20px;
  width: 100%;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-left: 10px;
}
.task-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.task-header {
  font-size: 16px;
  font-weight: bold;
}

.task-tags {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.task-tag {
  background-color: #e0f7fa;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.task-actions {
  margin-top: 10px;
  text-align: right;
}
.task-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.task-item:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>