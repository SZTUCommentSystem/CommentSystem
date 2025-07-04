<template>
    <div class="create-wrapper">
        <div class="header">
            <el-page-header @back="router.go(-1)" content="查看作业" title="返回">
            </el-page-header>
        </div>
        <div class="list">
            <div class="list-header">
                <h3>作业详情</h3>
                <el-button v-if="!ListIndex" type="success" plain @click="Export">导出excel表格</el-button>
            </div>
            <ClassList v-if="ListIndex" :classList="classList" @updateListDate="updateListDate"></ClassList>
            <StudentList v-else 
                :className="className" 
                :classId="classi.classId" 
                :homeworkId="homeworkId"
                :studentList="classi.student" 
                @updateIndex="ListIndex = !ListIndex"
            ></StudentList>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { useRouter, useRoute } from 'vue-router';

// 导入主要数据和事件
import ExcelEport from '@/hooks/TaskConditionHooks/ExcelExport';

// 学生和班级列表
import StudentList from './components/StudentList.vue';
import ClassList from './components/ClassList.vue';
import { classDetailAPI, studentListAPI, studentTaskInfoAPI, submitStudentTaskAPI } from '@/api/ClassAPI';
import { taskDetailAPI } from "@/api/TaskAPI";

//// 作业详情
const router = useRouter();
const route = useRoute();

const homeworkId = Number(route.query.id);

// 切换学生和班级列表，并获取班级对应学生列表
const ListIndex = ref(true);
const className = ref('');
const classi = ref <Class>();
const updateListDate = (classObj: Class) => {
    ListIndex.value = !ListIndex.value;
    className.value = classObj.className;
    classi.value = classList.value.filter(item => item.className == classObj.className)[0]
}

// 获取班级数据，同时获取每个班级的学生列表
export interface Student {
    homeworkStudentId: number
    studentId: string
    studentNo?: string
    studentName: string
    infoState: number 
    score?: number
}
interface Class {
    classId: number
    className: string
    svgNum: string
    student: Student[]
}
// 获取题目列表
const taskQuestList = ref<string[]>([])
const getTaskDetail = async () => {
  const res = await taskDetailAPI(homeworkId);
  if (res.data.code == 200) {
    taskQuestList.value = res.data.data.topicIds.split(',')
  }
}

const classIds = Array.isArray(route.query.classIds)
    ? route.query.classIds
    : (typeof route.query.classIds === 'string' ? route.query.classIds.split(',') : []);
const classList = ref<Class[]>([])
const getClassList = async () => {
    try {
        classList.value = []; // 清空

        // 并发请求所有班级
        const classPromises = classIds.map(async (id) => {
            const re = await classDetailAPI(Number(id));
            const res = await studentListAPI(Number(id));
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
                            homeworkId: homeworkId,
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
                // 返回班级对象
                return {
                    classId: re.data.data.classId,
                    className: re.data.data.className,
                    svgNum: re.data.data.svgNum ?? 0,
                    student: students
                };
            }
            return null;
        });

        // 等待所有班级请求完成
        const classResults = await Promise.all(classPromises);
        // 过滤掉无效班级
        classList.value = classResults.filter(item => item !== null);
        console.log(classList.value)
    } catch (error) {
        console.log(error.message)
    }
}

//导出Excel表格
const Export = () => {
    const exportData = (classList.value[0]?.student || []).map(stu => ({
        名字: stu.studentName,
        分数: stu.score ?? ''
    }));
    ElMessageBox.alert(`您当前选择导出Excel表格为:${classList.value[0]?.className}`, {
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

onMounted(() => {
    getTaskDetail();
    getClassList();
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
