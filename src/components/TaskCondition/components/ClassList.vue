<template>
    <div>
        <h5>班级列表</h5>
        <el-table :data="props.classList" style="width: 100%"
            :header-cell-style="{ backgroundColor: 'rgb(246, 247, 249)', textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }" :row-style="{ height: '50px' }"
            :header-row-style="{ height: '70px' }">
            <el-table-column prop="classId" label="序号" width="100" />
            <el-table-column prop="className" label="班级" width="180" />
            <el-table-column label="学生人数" width="180">
                <template #default="{ row }">
                    {{ row.student ? row.student.length : 0 }}
                </template>
            </el-table-column>
            <el-table-column label="提交人数" width="180">
                <template #default="{ row }">
                    {{ row.student ? row.student.filter(s => s.infoState === 1 || s.infoState === 2).length : 0 }}
                </template>
            </el-table-column>
            <el-table-column prop="svgNum" label="平均分" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <div>
                        <el-button type="primary" @click.prevent="emit('updateListDate', row)">查看作业</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['classList']);
const emit = defineEmits(['updateListDate']);
</script>

<style scoped>
h5 {
    padding: 20px;
}
</style>