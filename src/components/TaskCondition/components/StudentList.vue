<script setup lang="ts">import { useRoute } from 'vue-router';
import { zhCn } from "element-plus/es/locale/index.mjs";
import { Search } from '@element-plus/icons-vue';

// 导入主要数据和事件
import StudentList from '@/hooks/TaskConditionHooks/StudentList';

// 学生列表
const { status, displayStudent, handleSizeChange, handleCurrentChange, searchNameQuery, searchStudentIdQuery, searchClassQuery, filteredStudent } = StudentList();

const getStatusClass = (row: any) => {
    if (row.status === '未提交') {
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
}>();
const emit = defineEmits(['updateListDate']);
</script>
<template>
    <div class="list-header">
        <h5 @click="emit('updateListDate')"><-{{ props.className }}</h5>
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
        <el-table-column prop="id" label="序号" width="100" />
        <el-table-column prop="class" label="班级" width="180" />
        <el-table-column prop="name" label="姓名" width="150" />
        <el-table-column prop="studentId" label="学号" width="180" />
        <el-table-column prop="status" label="作业状态" width="180">
            <template #default="{ row }">
                <span :class="getStatusClass(row)">{{ row.status }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="score" label="得分" width="180" />
        <el-table-column label="操作">
            <template #default="scope">
                <div>
                    <router-link :to="{ path: '/home/corret', query: { id: scope.row.id } }">批改作业</router-link>
                    <router-link to="" style="margin-left: 10px;">追加点评</router-link>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <div class="pageing">
        <el-config-provider :locale="zhCn">
            <el-pagination :current-page="status.pageNum" background :page-size="status.pageSize" :page-sizes="[10]"
                v-if="filteredStudent.length > 0" layout="total, prev, pager, next, jumper"
                :total="filteredStudent.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-config-provider>
    </div>
</template>

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