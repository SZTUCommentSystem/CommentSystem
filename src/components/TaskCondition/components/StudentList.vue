<template>
    <div class="list-header">
        <h5 @click="emit('updateIndex')"><-{{ props.className }}</h5>
        <div class="search">
            <el-input v-model="searchNameQuery" placeholder="请输入姓名"
                style="width: 200px; font-size: 15px; margin-right: 10px;" :prefix-icon="Search" />
            <el-input v-model="searchStudentIdQuery" placeholder="请输入学号" style="width: 200px; font-size: 15px"
                :prefix-icon="Search" />
        </div>
    </div>
    <el-table :data="displayStudent" style="width: 100%"
        :header-cell-style="{ backgroundColor: 'rgb(246, 247, 249)', textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }" :row-style="{ height: '50px' }" :header-row-style="{ height: '70px' }">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="studentName" label="姓名" width="180" />
        <el-table-column prop="studentNo" label="学号" width="200" />
        <el-table-column label="作业状态" width="200">
            <template #default="{ row }">
                <span :class="getStatusClass(row)">
                    {{ row.infoState === 0 ? '未提交' : row.infoState === 1 ? '已提交' : row.infoState === 2 ? '已批改' : '未知' }}
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
                            classId: props.classId,
                            homeworkId: props.homeworkId
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
</template>

<script setup lang="ts">
import { zhCn } from "element-plus/es/locale/index.mjs";
import { Search } from '@element-plus/icons-vue';

import type { Student } from "../index.vue"

// 导入主要数据和事件
import StudentList from '@/hooks/TaskConditionHooks/StudentList';
import { onMounted } from "vue";

const getStatusClass = (row: any) => {
    if (row.status === '已发布') {
        return 'isRed';
    }
    else if (row.status === '已提交') {
        return 'isSubmit';
    }
    else {
        return 'isCorrect';
    }
}

const props = defineProps<{
    className: string;
    studentList: Student[];
    classId: number,
    homeworkId: number
}>();

const emit = defineEmits(['updateIndex'])

const {
    displayStudent,
    handleSizeChange,
    handleCurrentChange,
    searchNameQuery,
    searchStudentIdQuery,
    filteredStudent,
    pageNum,
    pageSize
} = StudentList(props.studentList);

onMounted(() => {
    console.log(displayStudent)
})
</script>

<style scoped>
.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h5 {
        padding: 20px;
        cursor: pointer;
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