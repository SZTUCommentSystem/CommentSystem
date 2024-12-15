<script setup lang="ts">
import { ref } from 'vue';

const classData = ref([
    {
        id: 1,
        class: '一班',
        studentNum: 30,
        submitNum: 20,
        average: 80
    },
    {
        id: 2,
        class: '二班',
        studentNum: 30,
        submitNum: 20,
        average: 80
    },
    {
        id: 3,
        class: '三班',
        studentNum: 30,
        submitNum: 20,
        average: 80
    },
    {
        id: 4,
        class: '四班',
        studentNum: 30,
        submitNum: 20,
        average: 80
    }
]);

const emit = defineEmits(['updateListDate']);

</script>
<template>
    <div>
        <h5>班级列表</h5>
        <el-table :data="classData" style="width: 100%"
            :header-cell-style="{ backgroundColor: 'rgb(246, 247, 249)', textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }" :row-style="{ height: '50px' }"
            :header-row-style="{ height: '70px' }">
            <el-table-column prop="id" label="序号" width="100" />
            <el-table-column prop="class" label="班级" width="180" />
            <el-table-column prop="studentNum" label="学生人数" width="180" />
            <el-table-column prop="submitNum" label="提交人数" width="180" />
            <el-table-column prop="average" label="平均分" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <div>
                        <router-link to="" @click="emit('updateListDate', row.class)">查看作业</router-link>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style scoped>
h5 {
    padding: 20px;
}
</style>