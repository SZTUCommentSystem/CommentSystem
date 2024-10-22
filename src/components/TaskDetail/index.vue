<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import { zhCn } from "element-plus/es/locale/index.mjs";
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

// 导入主要数据和事件
import StudentList from '@/hooks/TaskDetailHooks/StudentList';
import ExcelEport from '@/hooks/TaskDetailHooks/ExcelExport';

const route = useRoute();

//// 作业详情
// 班级选择
const classSelect = reactive({
    class: '全部',
    classList: ['全部', '一班', '二班', '三班']
});

//导出Excel表格
//导出表格的数据
const data = reactive([
    { name: 'hyt', serct: 'hyt是sb' },
]);


const Export = () => {
    ElMessageBox.alert(`您当前选择导出Excel表格为:${classSelect.class}`, {
        confirmButtonText: '确认',
        callback: (action: Action) => {
            if (action === 'confirm') {
                ExcelEport(data);
                ElMessage({
                    type: 'success',
                    message: '导出成功'
                })
            }
        },
    })
}

// 学生列表
const { status, displayStudent, handleSizeChange, handleCurrentChange, searchNameQuery, searchStudentIdQuery, filteredStudent } = StudentList();

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
</script>

<template>
    <div class="container">
        <h4 style="display: flex;align-items: center">
            <router-link to="/home/task">
                <img src="@/assets/img/左箭头.png" alt="" style="width: 30px; margin-right: 10px;">
            </router-link>
            {{ route.query.title }}
        </h4>

        <div class="create-title">
            <h5 style="margin-bottom: 20px;">作业详情</h5>
            <div class="task-details">
                <div class="class-select">
                    班级：
                    <el-dropdown split-button type="primary">
                        {{ classSelect.class }}
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="item in classSelect.classList" :key="item"
                                    @click="classSelect.class = item">{{ item }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="submit-condition">
                    <p>已提交：1 / 20</p>
                    <p>已批改：1 / 1</p>
                </div>
                <el-button type="success" plain @click="Export">导出excel表格</el-button>
            </div>
        </div>

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
                            <router-link
                                :to="{ path: '/home/corret', query: { name: scope.row.name } }">批改作业</router-link>
                            <router-link to="" style="margin-left: 10px;">追加点评</router-link>
                        </div>
                    </template>
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

.create-title {
    display: flex;
    /* 纵向排列 */
    flex-direction: column;
    /* 向左对齐 */
    align-items: flex-start;
    width: 100%;
    height: auto;
    margin-bottom: 5px;
    padding: 10px 20px;
    background-color: #fff;

    p {
        margin: 0;
        font-size: 18px;
        margin-bottom: 10px;
    }
}

.task-details {
    display: flex;
    align-items: center;
    width: 100%;

    .class-select {
        display: flex;
        align-items: center;
    }

    .submit-condition {
        display: flex;
        flex: 1;
        align-items: center;
        gap: 20px;
        margin-left: 20px;

        p {
            margin-bottom: 0;
        }
    }
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

.isCorrect {
    color: #67C23A;
}
</style>
