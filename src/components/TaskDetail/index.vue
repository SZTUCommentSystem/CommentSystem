<script setup lang="ts">
import { useRoute } from 'vue-router';
import { zhCn } from "element-plus/es/locale/index.mjs";
import { Search } from '@element-plus/icons-vue';
// 导入主要数据和事件
import StudentList from '../../hooks/TaskDetailHooks/StudentList';

const route = useRoute();

const { status, displayStudent, handleSizeChange, handleCurrentChange, searchNameQuery, searchStudentIdQuery, filteredStudent } = StudentList();

const getStatusClass = (row) => {
    return row.status === '未提交' ? 'isRed' : 'isSubmit';
}
</script>

<template>
    <div class="container">
        <h4 style="display: flex;align-items: center">
            <router-link to="/home/task">
                <img src="@/assets/img/左箭头.png" alt="" style="width: 30px; margin-right: 10px;">
            </router-link>
            {{ route.query.title }}
        </h4>
        <div class="submit-list">
            <div class="header">
                <h5>学生列表</h5>
                <div class="search">
                    <el-input v-model="searchNameQuery" placeholder="请输入姓名"
                        style="width: 200px; font-size: 15px; margin-right: 10px;" :prefix-icon="Search" />
                    <el-input v-model="searchStudentIdQuery" placeholder="请输入学号" style="width: 200px; font-size: 15px"
                        :prefix-icon="Search" />
                </div>
            </div>
            <el-table :data="displayStudent" style="width: 100%"
                :header-cell-style="{ backgroundColor: 'rgb(246, 247, 249)', textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }" :row-style="{ height: '50px' }"
                :header-row-style="{ height: '70px' }">
                <el-table-column prop="id" label="序号" width="100" />
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column prop="studentId" label="学号" width="280" />
                <el-table-column prop="status" label="作业状态" width="180">
                    <template #default="{ row }">
                        <span :class="getStatusClass(row)">{{ row.status }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="score" label="得分" width="180" />
                <el-table-column label="操作">
                    <div>
                        <router-link to="">批改作业</router-link>
                        <router-link to="" style="margin-left: 10px;">追加点评</router-link>
                    </div>
                </el-table-column>
            </el-table>
            <div class="pageing">
                <el-config-provider :locale="zhCn">
                    <el-pagination :current-page="status.pageNum" background :page-size="status.pageSize"
                        :page-sizes="[10]" v-if="filteredStudent.length > 0" layout="total, prev, pager, next, jumper"
                        :total="filteredStudent.length" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </el-config-provider>
            </div>
        </div>

    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.submit-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 30px;
    margin-top: 10px;
    width: 100%;
    min-height: calc(100vh - 100px);
    background-color: #fff;

    h5 {
        padding: 20px;
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
</style>
