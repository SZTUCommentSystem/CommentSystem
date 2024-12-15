<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { useRouter } from 'vue-router';

// 导入主要数据和事件
import ExcelEport from '@/hooks/TaskConditionHooks/ExcelExport';

// 学生和班级列表
import StudentList from './components/StudentList.vue';
import ClassList from './components/ClassList.vue';

//// 作业详情

const router = useRouter();

// 切换学生和班级列表，并发送班级名字
const ListIndex = ref(true);
const className = ref('');

const updateListDate = (name?: string) => {
    ListIndex.value = !ListIndex.value;
    className.value = name || '';
    console.log(className.value);

}

//导出Excel表格
//导出表格的数据
const data = reactive([
    { 名字: 'hyt', serct: '测试' },
]);


const Export = () => {
    ElMessageBox.alert(`您当前选择导出Excel表格为:111`, {
        confirmButtonText: '确认',
        callback: (action: Action) => {
            if (action === 'confirm') {
                ExcelEport(data).then(() => {
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

</script>

<template>
    <div class="create-wrapper">
        <div class="header">
            <el-page-header @back="router.push('/home/task')" content="查看作业" title="返回">
            </el-page-header>
        </div>
        <div class="list">
            <div class="list-header">
                <h3>作业详情</h3>
                <el-button type="success" plain @click="Export">导出excel表格</el-button>
            </div>
            <StudentList v-if="!ListIndex" :className="className" @updateListDate="updateListDate"></StudentList>
            <ClassList v-else @updateListDate="updateListDate"></ClassList>
        </div>
    </div>

</template>

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
