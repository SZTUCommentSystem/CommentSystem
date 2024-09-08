<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ElConfigProvider } from "element-plus";
import { zhCn } from "element-plus/es/locale/index.mjs";

const state = reactive({
    TaskList: [
        {
            id: 1,
            title: "Task 1",
            description: "This is task 1",
        },
        {
            id: 2,
            title: "Task 2",
            description: "This is task 2",
        },
        {
            id: 3,
            title: "Task 3",
            description: "This is task 3",
        },
    ],
    pageSize: 5,
    pageNum: 1
});

//列表展示
const handleSizeChange = (val: number) => {
    state.pageSize = val
}
const handleCurrentChange = (val: number) => {
    state.pageNum = val
}
// 根据当前页码和每页显示数量计算当前显示的章节列表
const displayedTasks = computed(() => {
    const start = (state.pageNum - 1) * state.pageSize;
    const end = start + state.pageSize;
    return state.TaskList.slice(start, end);
});
// 删除章节
const delDialogVisible = ref(false)
const delTaskId = ref(0)
const confirmDelTask = (id: number) => {
    delTaskId.value = id;
    delDialogVisible.value = true
}
const deleteTask = () => {
    state.TaskList = state.TaskList.filter((item) => item.id !== delTaskId.value);
    delDialogVisible.value = false
}
// 添加新章节
const addDialogVisible = ref(false)
const newTask = reactive({
    title: "",
    description: ""
})
const addTask = () => {
    const task = {
        id: state.TaskList[state.TaskList.length - 1].id + 1,
        title: newTask.title,
        description: newTask.description
    }
    state.TaskList.push(task);
    addDialogVisible.value = false
}
</script>
<template>
    <div>
        <p>作业 > </p>
        <div class="base">
            <div class="title">
                <h2>章节列表</h2>
                <div class="title_button">
                    <el-button type="primary" @click="addDialogVisible = true">创建新章节</el-button>
                    <el-button type="primary">发布新章节</el-button>
                </div>
            </div>
            <div class="list">
                <ul>
                    <li v-for="item in displayedTasks" :key="item.id">
                        <div class="left">
                            <img src="" alt="">
                        </div>
                        <div class="right">
                            <div class="right_rep">
                                <h5>标题：{{ item.title }}</h5>
                                <p>描述：{{ item.description }}</p>
                            </div>
                            <div class="right_skip">
                                <router-link
                                    :to="{ path: '/', query: { listId: item.id, title: item.title } }">进入章节</router-link>
                                <a href="javascripy:;" @click="confirmDelTask(item.id)">删除章节</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="paging">
                <el-config-provider :locale="zhCn">
                    <el-pagination :current-page="state.pageNum" :page-size="state.pageSize" :page-sizes="[10]"
                        v-if="state.TaskList.length > 0" layout="total, prev, pager, next, jumper"
                        :total="state.TaskList.length" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </el-config-provider>
            </div>
        </div>
        <!-- 添加新章节 -->
        <el-dialog v-model="addDialogVisible" title="添加新章节" width="500" center>
            <div>
                <el-form label-width="80px">
                    <el-form-item label="章节名称">
                        <el-input v-model="newTask.title" placeholder="请输入章节名称"></el-input>
                    </el-form-item>
                    <el-form-item label="章节描述">
                        <el-input v-model="newTask.description" placeholder="请输入章节描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="addTask">
                        确定
                    </el-button>
                    <el-button @click="addDialogVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 删除章节 -->
        <el-dialog v-model="delDialogVisible" title="删除章节" width="30%" center>
            <div>确定删除该章节吗？</div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="deleteTask">
                        确定
                    </el-button>
                    <el-button @click="delDialogVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>

</template>
<style scoped>
.base {
    position: relative;
    width: 100%;
    min-height: 300px;
    padding: 20px 0 65px 0;
    border-radius: 7px;
    background-color: #fff;

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
            margin-left: 40px;
        }

        .title_button {
            display: flex;
            align-items: center;
            margin-right: 30px;

            button {
                margin-right: 10px;
            }
        }

    }

    .list {
        li {
            display: flex;
            justify-content: space-between;
            height: 150px;
            margin: 1rem 2.5rem;
            border: 1px solid #ccc;
            border-radius: 7px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            /* 动画效果 */
            transition: transform 0.3s ease;

            &:hover {
                transform: scale(1.05);
            }

            .left {
                width: 20%;
                height: 100%;

                img {
                    border-radius: 7px 0 0 7px;
                    width: 100%;
                    height: 100%;
                }
            }

            .right {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 10px;
                padding-left: 10px;
                width: 80%;
                height: 100%;

                .right_rep {
                    h5 {
                        margin-bottom: 20px;
                    }
                }

                .right_skip {
                    margin-right: 10px;

                    a {
                        margin-right: 10px;
                    }
                }
            }
        }
    }

    .paging {
        position: absolute;
        right: 35px;
        bottom: 20px;
    }
}
</style>