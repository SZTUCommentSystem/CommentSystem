<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { ElConfigProvider } from "element-plus";
import { zhCn } from "element-plus/es/locale/index.mjs";
import { useRoute } from "vue-router";

//引入参数
const route = useRoute();
// 从ListDisplay.ts中引入
import ListDisplay from "./hooks/ListDisplay";
// 从DelAndAddList.ts中引入
import DelAndAddList from "./hooks/DelAndAddList";

const { state, handleSizeChange, handleCurrentChange, displayedTasks } = ListDisplay();

const { delDialogVisible, confirmDelTask, deleteTask: deleteTaskOriginal, addDialogVisible, newTask, addTask: addTaskOriginal } = DelAndAddList(state.TaskList);

const deleteTask = () => {
    state.TaskList = deleteTaskOriginal();
}

const addTask = () => {
    state.TaskList = addTaskOriginal();
}

//展示是否有作业
const IsTask = ref(true);
watchEffect(() => {
    if (state.TaskList.length === 0) {
        IsTask.value = false;
    } else {
        IsTask.value = true;
    }
});
</script>
<template>
    <div>
        <p><router-link to="/home/chapter">主页</router-link> > {{ route.query.title }} > </p>
        <div class="base">
            <div class="title">
                <h2>作业列表</h2>
                <div class="title_button">
                    <el-button type="primary" @click="addDialogVisible = true">创建作业</el-button>
                    <el-button type="primary">发布作业</el-button>
                </div>
            </div>
            <div class="list">
                <ul>
                    <li v-for="item in displayedTasks" :key="item.id" v-if="IsTask" class="list_li">
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
                                    :to="{ path: '/home/task', query: { listId: item.id, title: item.title } }">查看作业详情</router-link>
                                <!-- 暂定a，后面改routerlink -->
                                <a href="javascript:;">查看作业批语库</a>
                                <i class="circle" @click="confirmDelTask(item.id)">x</i>
                            </div>
                        </div>
                    </li>
                    <li v-else class="list_not_li">
                        <h1>尚未发布作业</h1>
                    </li>
                </ul>
            </div>
            <router-link to="/home/chapter" class="returnChapter">返回</router-link>
            <div class="paging">
                <el-config-provider :locale="zhCn">
                    <el-pagination :current-page="state.pageNum" :page-size="state.pageSize" :page-sizes="[10]"
                        v-if="state.TaskList.length > 0" layout="total, prev, pager, next, jumper"
                        :total="state.TaskList.length" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </el-config-provider>
            </div>
        </div>
        <!-- 添加新作业 -->
        <el-dialog v-model="addDialogVisible" title="添加新作业" width="500" center>
            <div>
                <el-form label-width="80px">
                    <el-form-item label="作业名称">
                        <el-input v-model="newTask.title" placeholder="请输入作业名称"></el-input>
                    </el-form-item>
                    <el-form-item label="作业描述">
                        <el-input v-model="newTask.description" placeholder="请输入作业描述"></el-input>
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
        <!-- 删除作业 -->
        <el-dialog v-model="delDialogVisible" title="删除作业" width="30%" center>
            <div>确定删除该作业吗？</div>
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
p a {
    color: #000;

    &:hover {
        color: #409EFF;
    }
}

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
        ul {
            position: relative;
            margin: 15px 1rem;
            padding: 1rem 0;
            min-height: 200px;
            background-color: #e7e7e736;

            .list_li {
                display: flex;
                justify-content: space-between;
                height: 150px;
                margin: 1rem 2rem;
                border: 1px solid #ccc;
                border-radius: 7px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                /* 动画效果 */
                transition: transform 0.3s ease;

                &:hover {
                    transform: scale(1.05);
                }

                &:last-child {
                    margin-bottom: 0;
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
                    position: relative;
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

                        .circle {
                            position: absolute;
                            top: 0;
                            right: 0;
                            background-color: red;
                            color: #fff;
                            width: 20px;
                            height: 20px;
                            border-radius: 10%;
                            text-align: center;
                            line-height: 20px;
                            cursor: pointer;
                        }
                    }
                }
            }

            .list_not_li {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);

                h1 {
                    /* font-size: 20px; */
                    font-style: italic;
                    color: #c8c8c8;
                }
            }
        }
    }

    .paging {
        position: absolute;
        right: 35px;
        bottom: 20px;
    }

    .returnChapter {
        position: absolute;
        left: 38px;
        bottom: 26px;
        color: #000;

        &:hover {
            color: #409EFF;
        }
    }
}
</style>