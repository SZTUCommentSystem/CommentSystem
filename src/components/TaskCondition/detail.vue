<template>
<div class="create-wrapper">
    <div class="header">
      <el-page-header @back="router.go(-1)" content="查看作业" title="返回">
      </el-page-header>
    </div>
    <div class="list">
        <div class="list-header">
            <el-input v-model="searchNameQuery" placeholder="请输入姓名"
                style="width: 200px; font-size: 15px; margin-right: 10px;" :prefix-icon="Search" />
            <el-input v-model="searchStudentIdQuery" placeholder="请输入学号" style="width: 200px; font-size: 15px; margin-right: 10px;"
                :prefix-icon="Search" />
            <el-select
                v-model="homeWorkStatus"
                placeholder="请选择作业状态"
                style="width: 200px;"
                popper-class="type-select-dropdown"
                :teleported="false"
                filterable
            >
                <el-option
                    v-for="item in homeWorkStatusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </div>
        <el-table :data="displayStudent" style="width: 96%"
        :header-cell-style="{ backgroundColor: 'rgb(246, 247, 249)', textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }" :row-style="{ height: '50px' }" :header-row-style="{ height: '70px' }">
            <el-table-column type="index" label="序号" width="100" />
            <el-table-column prop="studentName" label="姓名" width="180" />
            <el-table-column 
                prop="studentNo" 
                label="学号" 
                width="180" 
                sortable 
                :sort-method="sortStudentNo"
            />
            <el-table-column prop="submitTime" label="提交时间" width="180" />
            <el-table-column label="作业状态" width="200">
                <template #default="{ row }">
                    <span :class="getStatusClass(row)">
                        {{ row.infoState }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="score" label="得分" width="180" />
            <el-table-column label="操作">
                <template #default="scope">
                    <div>
                        <router-link :to="{
                            name: 'corret', query: {
                                studentId: scope.row.studentId,
                                classId: classInfo.classId,
                                homeworkId: classInfo.homeworkId
                            }
                        }">批改作业</router-link>
                        <router-link to="" style="margin-left: 10px;">追加点评</router-link>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageing">
            <el-config-provider :locale="zhCn">
                <el-pagination :current-page="pageNum" background :page-size="pageSize" :page-sizes="[10]"
                    v-if="filteredStudent.length > 0" layout="total, prev, pager, next, jumper"
                    :total="filteredStudent.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-config-provider>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { zhCn } from "element-plus/es/locale/index.mjs";
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import type { Action } from "element-plus";

import { taskDetailAPI } from "@/api/TaskAPI";
import { classDetailAPI, studentListAPI, studentTaskInfoAPI, submitStudentTaskAPI } from '@/api/ClassAPI';
import ExcelEport from "@/hooks/TaskConditionHooks/ExcelExport";

// 导入主要数据和事件
import StudentList from '@/hooks/TaskConditionHooks/StudentList';

const router = useRouter();
const route = useRoute();

interface Student {
  homeworkStudentId: number
  studentId: string
  studentNo?: string
  studentName: string
  infoState: string 
  score?: number
}

interface ClassI {
  classId: number
  homeworkId: number
  className: string
  svgNum: string
  student: Student[]
}

const classInfo = ref<ClassI>({
  classId: Number(route.query.classId),
  homeworkId: Number(route.query.homeworkId),
  className: '',
  svgNum: '',
  student: []
});

// 作业状态
const homeWorkStatusList = ref([
    {
        label: '全部',
        value: ''
    },
    {
        label: '已批改',
        value: '已批改'
    },
    {
        label: '未批改',
        value: '未批改'
    },
    {
        label: '未提交',
        value: '未提交'
    }
])
const homeWorkStatus = ref('全部')

// 获取题目列表
const taskQuestList = ref<string[]>([])
const getTaskDetail = async () => {
    const res = await taskDetailAPI(classInfo.value.homeworkId);
    if (res.data.code == 200) {
        taskQuestList.value = res.data.data.topicIds.split(',')
    }
}

const getClassDetail = async () => {
    try {
        // 获取班级详情
        const re = await classDetailAPI(classInfo.value.classId);
        // 获取班级学生列表
        const res = await studentListAPI(classInfo.value.classId);
        if (res.data.code == 200) {
            // 并发请求所有学生的作业详情
            const students: Student[] = await Promise.all(
                res.data.rows.map(async (student: any) => {
                    let infoState = '未提交';
                    let totalScore = 0;
                    let allCorrected = true;
                    let hasSubmit = false;

                    // 获取作业详情
                    const taskRes = await studentTaskInfoAPI({
                        homeworkId: classInfo.value.homeworkId,
                        studentId: student.studentId,
                    });

                    if (taskRes.data.code == 200 && taskRes.data.rows && taskRes.data.rows.length > 0) {
                        const homeworkStudentId = taskRes.data.rows[0].id;

                        // 遍历所有题目，判断是否全部已批改，累加分数
                        for (const topicId of taskQuestList.value) {
                            const da = {
                                studentId: student.studentId,
                                homeworkStudentId,
                                topicId
                            }
                            const re = await submitStudentTaskAPI(da);
                            if (re.data.code == 200 && re.data.rows.length > 0) {
                                const row = re.data.rows[0];
                                // 只要有一题不是已批改，则不是全部已批改
                                if (row.infoState !== '已批改') {
                                    allCorrected = false;
                                }
                                if (row.infoState === '已提交' || row.infoState === '已批改') {
                                    hasSubmit = true;
                                }
                                totalScore += Number(row.infoNum) ?? 0;
                            } else {
                                allCorrected = false;
                            }
                        }

                        if (hasSubmit) {
                            infoState = allCorrected ? '已批改' : '已提交';
                        }
                    }

                    return {
                        studentId: student.studentId,
                        studentNo: student.studentNo,
                        studentName: student.studentName,
                        infoState,
                        score: totalScore,
                    };
                })
            );
            // 更新班级信息
            classInfo.value.className = re.data.data.className;
            classInfo.value.svgNum = re.data.data.svgNum ?? 0;
            classInfo.value.student = students;
        }
    } catch (error) {
        console.log(error.message)
    }
  console.log(classInfo.value)
}

const getStatusClass = (row: any) => {
    if (row.infoState === '未提交') {
        return 'isRed';
    }
    else if (row.infoState === '已提交') {
        return 'isSubmit';
    }
    else {
        return 'isCorrect';
    }
}

const {
    displayStudent,
    handleSizeChange,
    handleCurrentChange,
    searchNameQuery,
    searchStudentIdQuery,
    filteredStudent,
    pageNum,
    pageSize
} = StudentList(computed(() => classInfo.value.student), computed(() => homeWorkStatus.value));

const sortStudentNo = (a: any, b: any) => {
  // 按数字大小排序（学号可能是字符串）
  return Number(a.studentNo) - Number(b.studentNo);
};

//导出Excel表格
const Export = () => {
    const exportData = (classInfo.value.student || []).map(stu => ({
        名字: stu.studentName,
        分数: stu.score ?? ''
    }));
    ElMessageBox.alert(`您当前选择导出Excel表格为:${classInfo.value.className}`, {
        confirmButtonText: '确认',
        callback: (action: Action) => {
            if (action === 'confirm') {
                ExcelEport(exportData).then(() => {
                    ElMessage({
                        type: 'success',
                        message: '导出成功'
                    })
                }).catch(() => {
                    ElMessage({
                        type: 'error',
                        message: '导出失败'
                    })
                })
            }
        },
    })
}

onMounted(async () => {
  getTaskDetail()
  await getClassDetail();
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
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;

        h5 {
            padding: 20px;
            cursor: pointer;
        }
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