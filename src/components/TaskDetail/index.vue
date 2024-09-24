<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { zhCn } from "element-plus/es/locale/index.mjs";
import { Search } from '@element-plus/icons-vue';

const route = useRoute();

const status = reactive({
    studentList: [
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 2,
            name: '李四',
            studentId: '201922522312',
            status: '已提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },
        {
            id: 1,
            name: '张三',
            studentId: '201800102312',
            status: '未提交',
            score: 100,
        },

    ],
    pageSize: 20,
    pageNum: 1
});

//列表展示
const handleSizeChange = (val: number) => {
    status.pageSize = val
}
const handleCurrentChange = (val: number) => {
    status.pageNum = val
    window.scrollTo(0, 0)
}
// 根据当前页码和每页显示数量计算当前显示的章节列表
const displayStudent = computed(() => {
    const start = (status.pageNum - 1) * status.pageSize;
    const end = start + status.pageSize;
    return filteredStudent.value.slice(start, end);
});

//过滤搜索数组
const searchNameQuery = ref('');
const searchStudentIdQuery = ref('');
const filteredStudent = computed(() => {
    return status.studentList.filter(student => {
        const matchesSearchName = student.name.includes(searchNameQuery.value);
        const matchesSearchId = student.studentId.includes(searchStudentIdQuery.value);
        return matchesSearchName && matchesSearchId;
    });
});
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
                <el-table-column prop="status" label="作业状态" width="180" />
                <el-table-column prop="score" label="得分" width="180" />
                <el-table-column label="操作">
                    <div>
                        <router-link to="">查看作业</router-link>
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
</style>
