<template>
    <div class="container">
        <div class="overlay" v-if="isSidebarVisible" @click="toggleSidebar"></div>
        <div class="sidebar" :class="{ 'sidebar-visible': isSidebarVisible }">
            <button class="close-btn" @click="toggleSidebar">x</button>
            <el-table :data="studentList" style="width: 100%" @row-click="jumpToStudent" row-style="cursor:pointer">
                <el-table-column prop="class" label="班级" width="150" />
                <el-table-column prop="name" label="姓名" width="90" />
                <el-table-column label="本题状态">
                    <template #default="scope">
                        <span v-if="props.statusData[props.nowTask - 1][scope.$index] === 1" class="selected">
                            已批改
                        </span>
                        <span v-else>未批改</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <button class="open-btn" @click="toggleSidebar">学生列表</button>
        <!-- 其他内容 -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import type { Student } from '@/components/TaskCondition/index.vue';
import { studentListAPI } from '@/api/ClassAPI';

// 定义 `StatusData` 的类型
interface StatusData {
    [index: number]: number[];
}

// 接受父组件传递的数据
const props = defineProps<{
    className: string,


    taskNumber: number;
    nowTask: number;
    statusData: StatusData;
}>();

const emit = defineEmits(['updateStudentNumber']);

// 学生列表
const studentList = ref<Student[]>([]);

const getudentList = async () => {
    const res = await studentListAPI();
    studentList.value = res.data.data;
    emit('updateStudentNumber', studentList.value.length);
}

const isSidebarVisible = ref(false);

const toggleSidebar = () => {
    isSidebarVisible.value = !isSidebarVisible.value;
};

// 跳转到对应的学生
const router = useRouter();
const jumpToStudent = (row: Student) => {
    router.push({ path: '/home/corret', query: { id: row.id } });
    window.location.reload();
};

onMounted(() => {
    getudentList();
})
</script>

<style scoped>
.container {
    position: relative;
}

.open-btn {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
    width: 30px;
    /* 设置按钮宽度 */
    height: 100px;
    /* 设置按钮高度 */
    writing-mode: vertical-rl;
    /* 文字纵向排列 */
    text-orientation: mixed;
    /* 文字方向 */
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar {
    position: fixed;
    left: -30%;
    top: 0;
    width: 30%;
    height: 100%;
    background-color: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    transition: left 0.3s ease;
    z-index: 2001;
}

.sidebar-visible {
    left: 0;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    border-radius: 100%;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2000;
}

.selected {
    display: flex;
    align-items: center;
    color: #fff;
    text-align: center;
    width: 43px;
    background-color: #409eff;
}
</style>