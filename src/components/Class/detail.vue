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
             <el-statistic title="总布置作业" :value="taskLists.length" />
           </el-col>
           <el-col :span="6">
             <el-statistic :value="72">
               <template #title>
                 <div style="display: inline-flex; align-items: center">
                  班级最近一次作业平均分
                 </div>
               </template>
               <template #suffix>/100</template>
             </el-statistic>
           </el-col>
           <el-col :span="6">
             <el-statistic title="班级邀请码" :value="route.query.classId" />
           </el-col>
         </el-row>
       </div>
      <div class="student-list">
        <h3 class="section-title">学生列表</h3>
        <el-table :data="paginatedStudents" style="width: 100%">
          <el-table-column type="index" label="序号"  width="100px"></el-table-column>
          <el-table-column prop="studentNo" label="学生ID" ></el-table-column>
          <el-table-column prop="studentName" label="学生姓名"></el-table-column>
          <el-table-column prop="studentTel" label="手机号"></el-table-column>
          <el-table-column prop="studentEmail" label="邮箱"></el-table-column>
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
          <div v-for="task in taskLists" :key="task.homeworkContentId" class="task-item" @click.self="router.push('/home/task/taskcondition')">
            <div class="task-header m-2">
              <h5>作业标题：{{ task.homeworkTitle }}</h5>
            </div>
            <div class="task-tags m-2" v-if="task.topicIds.length">
              <div v-for="tag in task.topicIds" :key="tag.topicLabelId" class="task-tag">{{ tag.topicLabelName }}</div>
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
import {computed, onMounted, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { classDetailAPI, studentListAPI } from '@/api/ClassAPI/index'
import { taskListAPI } from '@/api/TaskAPI/TaskQuestionList'
import { labelInfoAPI } from "@/api/LabelAPI";

const source = ref(0)
source.value = 72

const router = useRouter()
const route = useRoute()

interface Student {
  studentId: number;
  studentName: string;
  userId: number;
  classId: number;
  studentTel: string; // 学生电话
  studentEmail: string; // 学生邮箱
  studentNo: string; // 学号
}

const students = ref<Student[]>([])
// 获取学生列表
const getStudentsList = async () => {
  try {
    const res = await studentListAPI(Number(route.query.classId))
    students.value = res.data.rows
    console.log('获取学生列表成功:', students.value)
  } catch (error) {
    console.error('获取学生列表失败:', error)
  }
}

// 获取班级对应作业列表
interface Tag {
  topicLabelId: number,
  topicLabelName: string
}
interface Task {
  homeworkContentId: number,
  topicIds: Tag[],
  homeworkTitle: string,
  limitTime: Date,
}
const taskLists = ref<Task[]>([])

const getTaskList = async () => {
  try {
    const classId = String(route.query.classId)
    const res = await taskListAPI({ classId })

    // 并发处理每个作业的 topicIds
    const rows: Task[] = await Promise.all(
      res.data.rows.map(async (item: any) => {
        const idArr = item.topicIds ? item.topicIds.split(',') : []
        // 并发获取所有标签信息
        const tags: Tag[] = await Promise.all(
          idArr.map(async (id: string) => {
            const tagRes = await labelInfoAPI(Number(id))
            // 假设返回结构为 { topicLabelId, topicLabelName }
            return tagRes.data.data
          })
        )
        return {
          ...item,
          topicIds: tags
        }
      })
    )

    taskLists.value = rows

    console.log('获取作业列表成功:', taskLists.value)
  } catch (error) {
    console.error('获取作业列表失败:', error)
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

const deleteStudent = (student: { id: number }) => {
  students.value = students.value.filter(s => s.studentId !== student.id)
}
// 发布作业
const publishTask = () => {
  router.push('/home/task')
};

onMounted(() => {
  getStudentsList()
  getTaskList()
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