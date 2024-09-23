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
                <router-link to="/home/createtask" class="title_button"><el-button
                        type="primary">去创建作业</el-button></router-link>
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
                                                <el-dropdown-item @click="confirmDelTask(item.id)">
                                                    立即删除
                                                </el-dropdown-item>
                                                <el-dropdown-item>编辑作业</el-dropdown-item>
                                                <el-dropdown-item>查看批语</el-dropdown-item>
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
p {
    font-size: 12px;

    a {
        color: #000;

        &:hover {
            color: #409EFF;
        }
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
            margin: 0;
            margin-left: 30px;
        }

        .title_button {
            margin: 15px 20px;

            button {
                margin-right: 10px;
                height: 35px;
                width: 110px;
                border-radius: 10px;
            }
        }

    }

    .list {
        ul {
            position: relative;
            margin: 10px;
            margin-bottom: 30px;
            padding: 13px;
            min-height: calc(100vh - 100px);
            background-color: #e7e7e736;


            .list_li {
                height: auto;
                margin: 10px 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
                transition: box-shadow 0.3s;

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
                    padding-left: 35px;
                    width: 100%;
                    height: 128px;

                    .pane_rep {
                        width: 69%;

                        p {
                            padding: 0;
                            margin: 0;
                            font-size: 15px;
                        }

                        .status {
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;

                            p {
                                text-align: center;
                                font-size: 14px;
                                width: 60px;
                                margin-right: 10px;
                                background-color: #409EFF;
                                color: #fff;
                                border-radius: 10px;

                            }

                            h5 {
                                font-size: 18px;
                                margin-bottom: 0;
                                font-weight: 600;
                            }
                        }
                    }

                    .pane_skip {
                        margin-right: 25px;

                        button:focus {
                            outline: none;
                        }

                        a {
                            margin-right: 10px;
                        }

                        button {
                            border-radius: 20px;
                        }

                        .icon {
                            margin-top: 17px;
                            margin-left: 20px;
                            cursor: pointer;

                            img {
                                width: 20px;
                                height: 17px;
                            }
                        }
                    }
                }

                .pane_drop_list {
                    width: 100%;
                    height: 100px;

                    table {
                        margin: 0 auto;

                        thead {
                            color: #000;
                            font-size: 14px;
                            background-color: #c8c8c8;

                            th {
                                padding: 10px 20px;
                            }
                        }

                        tbody {
                            color: #000;
                            font-size: 14px;
                            border-bottom: 1px solid #ccc;

                            td {
                                padding: 10px 20px;
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
            }
        }
    }

    .paging {
        position: absolute;
        right: 10px;
        bottom: 30px;
    }
}

.all_class ::v-deep el-icon--right svg:hover {
    cursor: pointer;
}
</style>