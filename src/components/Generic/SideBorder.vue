<template>
    <div class="container">
        <div class="overlay" v-if="isSidebarVisible" @click="toggleSidebar"></div>
        <div class="sidebar" :class="{ 'sidebar-visible': isSidebarVisible }">
            <button class="close-btn" @click="toggleSidebar">x</button>
            <el-table :data="students" style="width: 100%" @row-click="update" row-style="cursor:pointer">
                <el-table-column prop="className" label="班级" width="150" />
                <el-table-column prop="studentName" label="姓名" width="150" />
                <el-table-column prop="infoState" label="本题状态" width="90" />
            </el-table>
        </div>
        <button class="open-btn" @click="toggleSidebar">学生列表</button>
        <!-- 其他内容 -->
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { studentTaskInfoAPI } from '@/api/ClassAPI';

// 接受父组件传递的数据
const props = defineProps<{
    studentList: any
    homeworkId: number
}>();

const emit = defineEmits(['updateStudent']);

// 学生列表
const students = ref<{
    className: string,
    studentName: string,
    infoState: string,
}[]>([])

const getudentList = async () => {
    // 获取所有学生id
    const ids = props.studentList.student
        .filter((item: any) => item.studentId)
        .map((item: any) => item.studentId);

    const results = await Promise.all(
        ids.map((id: number) => studentTaskInfoAPI({homeworkId:props.homeworkId, studentId: id}))
    );
    const studen = results
        .filter(res => res.data.code == 200)
        .map(res => res.data.rows[0])
        .map((stu: any) => ({
            className: props.studentList.className,
            studentName: stu && props.studentList.student.find((st: any) => st.studentId == stu.studentId)?.studentName || '',
            infoState: stu && stu.infoState
        }));
    students.value = studen;
}

watch(
    () => props.studentList.student,
    (newVal) => {
        if (newVal && newVal.length > 0) {
            getudentList();
        }
    },
    { immediate: true }
);

const isSidebarVisible = ref(false);
const toggleSidebar = () => {
    isSidebarVisible.value = !isSidebarVisible.value;
};

// 更新学生参数
const update = (id: number) => {
    emit('updateStudent', id);
}
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