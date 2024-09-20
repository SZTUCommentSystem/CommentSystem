<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { ElConfigProvider } from "element-plus";
import { zhCn } from "element-plus/es/locale/index.mjs";
// import { useRoute } from "vue-router";

//引入参数
// const route = useRoute();
// 从ListDisplay.ts中引入
import ListDisplay from "./hooks/ListDisplay";
// 从DelAndAddList.ts中引入
import DelAndAddList from "./hooks/DelAndAddList";

const { state, handleSizeChange, handleCurrentChange, displayedTasks } = ListDisplay();

const { delDialogVisible, confirmDelTask, deleteTask: deleteTaskOriginal } = DelAndAddList(state.TaskList);

const deleteTask = () => {
    state.TaskList = deleteTaskOriginal();
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

//展示下拉框
const IsDropList = ref(false);

</script>
<template>
    <div class="all_class">
        <div class="base">
            <div class="title">
                <h2>作业列表</h2>
                <div class="title_button">
                    <el-button type="primary">去创建作业</el-button>
                </div>
            </div>
            <div class="list">
                <ul>
                    <li v-for="item in displayedTasks" :key="item.id" v-if="IsTask" class="list_li">
                        <div class="pane">
                            <div class="pane_top">
                                <div class="pane_rep">
                                    <div class="status">
                                        <p>未发布</p>
                                        <h5>标题：{{ item.title }}</h5>
                                    </div>
                                    <p>描述：{{ item.description }}</p>
                                    <p>老师：{{ item.teacher }}</p>
                                    <p>截止时间：0213</p>
                                </div>
                                <div class="pane_skip">
                                    <el-dropdown placement="bottom">
                                        <el-button> 更多 </el-button>
                                        <template #dropdown>
                                            <el-dropdown-menu>
                                                <el-dropdown-item>立即发布</el-dropdown-item>
                                                <el-dropdown-item>立即截止</el-dropdown-item>
                                                <el-dropdown-item
                                                    @click="confirmDelTask(item.id)">立即删除</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
                                    <br>
                                    <div class="icon" @click="item.IsDropList = !item.IsDropList">
                                        <img v-show="item.IsDropList === false" src="@/assets/img/向下的箭头.png" alt="">
                                        <img v-show="item.IsDropList === true" src="@/assets/img/向上的箭头.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="pane_drop_list" v-if="item.IsDropList">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>班级</th>
                                            <th>状态</th>
                                            <th>提交情况</th>
                                            <th>截止时间</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>2</td>
                                            <td>3</td>
                                            <td>4</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </li>
                    <li v-else class="list_not_li">
                        <h1>尚未发布作业</h1>
                    </li>
                </ul>
            </div>
            <div class="paging">
                <el-config-provider :locale="zhCn">
                    <el-pagination :current-page="state.pageNum" background :page-size="state.pageSize"
                        :page-sizes="[10]" v-if="state.TaskList.length > 0" layout="total, prev, pager, next, jumper"
                        :total="state.TaskList.length" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </el-config-provider>
            </div>
        </div>
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
            font-size: 2vw;
            margin-left: 2.6vw;
        }

        .title_button {
            display: flex;
            align-items: center;
            margin: 1.5vw 2vw;

            button {
                margin-right: 1vw;
                height: 4.5vh;
                width: 8vw;
                border-radius: 0.3vw;
            }
        }

    }

    .list {
        ul {
            position: relative;
            margin: 1vw;
            margin-bottom: 2vw;
            padding: 1.5vw;
            min-height: 20vh;
            background-color: #e7e7e736;

            .list_li {
                /* display: flex; */
                height: auto;
                margin: 1vw 2vw;
                border: 1px solid #ccc;
                border-radius: 1vw;

                &:hover {
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }

                &:last-child {
                    margin-bottom: 0;
                }

                .pane {
                    width: 100%;
                }

                .pane_top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-left: 2vw;
                    width: 100%;
                    height: 20vh;

                    .pane_rep {
                        width: 69%;

                        p {
                            padding: 0;
                            margin: 0;
                        }

                        .status {
                            display: flex;
                            align-items: center;
                            margin-bottom: 1vw;

                            p {
                                text-align: center;
                                width: 4vw;
                                margin-right: 10px;
                                background-color: #409EFF;
                                color: #fff;
                                border-radius: 0.5vw;

                            }

                            h5 {
                                font-size: 1.6vw;
                                margin-bottom: 0;
                            }
                        }
                    }

                    .pane_skip {
                        margin-right: 1vw;
                        margin-top: 2vh;

                        button:focus {
                            outline: none;
                        }

                        a {
                            margin-right: 10px;
                        }

                        button {
                            border-radius: 20px;
                        }

                        .circle {
                            position: absolute;
                            top: 0;
                            right: 0;
                            color: #000;
                            width: 1.5vw;
                            height: 1.5vw;
                            border-radius: 10%;
                            text-align: center;
                            line-height: 1.5vw;
                            cursor: pointer;
                        }

                        .icon {
                            margin-top: 2vh;
                            margin-left: 1.5vw;
                            cursor: pointer;

                            img {
                                width: 1.5vw;
                                height: 1vw;
                            }
                        }
                    }
                }

                .pane_drop_list {
                    width: 100%;
                    height: 12vh;

                    table {
                        margin: 0 auto;
                        padding: 10vw 0;

                        thead {
                            color: #000;
                            font-size: 1.2vw;
                            background-color: #c8c8c8;

                            th {
                                padding: 0.5vw 1.5vw;
                            }
                        }

                        tbody {
                            color: #000;
                            font-size: 1.2vw;
                            border-bottom: 1px solid #ccc;

                            td {
                                padding: 0.5vw 1.5vw;
                            }
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
                    font-size: 3vw;
                    font-style: italic;
                    color: #c8c8c8;
                }
            }
        }
    }

    .paging {
        position: absolute;
        right: 1vw;
        bottom: 2vw;
    }
}

.all_class ::v-deep el-icon--right svg:hover {
    cursor: pointer;
}

/* 修改Element分页样式 */
/* .all_class ::v-deep .el-dialog__title {
    font-size: 1.5vw;
}

.all_class ::v-deep .el-dialog__headerbtn {
    font-size: 1.2vw;
}

.all_class ::v-deep .btn-prev,
.all_class ::v-deep .btn-next {
    width: 2vw;
    height: 2vw;
}

.all_class ::v-deep .el-icon {
    font-size: 1vw;
}

.all_class ::v-deep .el-pager .number {
    height: 2vw;
    min-width: 2vw;
    font-size: 1vw;
} */
</style>