<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { ElConfigProvider } from "element-plus";
import { zhCn } from "element-plus/es/locale/index.mjs";
import { useRouter } from "vue-router";

// 导入相关ts文件
import ListDisplay from "../../hooks/TaskHooks/TaskListDisplay";
import { PubList, DelList } from "../../hooks/TaskHooks/OperateList";

//载入主要数据和事件
const { state, handleSizeChange, handleCurrentChange, selectedType, FilterStatus, displayedTasks } = ListDisplay();


// 发布作业
const { pubDialogVisible, confirmPubTask, publishTask: publishTaskOriginal } = PubList(state.TaskList);
const publishTask = () => {
    state.TaskList = publishTaskOriginal();
}


const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedTags = ref(['工程1班', '工程4班'])
const tags = ['工程1班', '工程2班', '工程3班', '工程4班']

const handleCheckAllChange = (val: boolean) => {
    checkedTags.value = val ? tags : []
    isIndeterminate.value = false
}
const handleCheckedTagsChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === tags.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < tags.length
}

//删除相关事件
const { delDialogVisible, confirmDelTask, deleteTask: deleteTaskOriginal } = DelList(state.TaskList);

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

//添加点击事件，带着title跳转到创建作业页面
const router = useRouter();
const toTaskDetail = (title: string) => {
    router.push({ path: "/home/task/taskdetail", query: { title: title } });
}


</script>
<template>
    <div class="all_class">
        <div class="base">
            <div class="title">
                <div class="title-left">
                    <h2>作业列表</h2>
                    <el-select v-model="selectedType" placeholder="选择作业状态" style="width: 200px;">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未发布" value="0"></el-option>
                        <el-option label="已发布" value="1"></el-option>
                        <el-option label="已结束" value="2"></el-option>
                    </el-select>
                </div>
                <router-link to="/home/task/taskcreate" class="title_button"><el-button
                        type="primary">去创建作业</el-button></router-link>
            </div>
            <div class="list">
                <ul>
                    <li v-for="item in displayedTasks" :key="item.id" v-if="IsTask" class="list_li">
                        <div class="pane">
                            <div class="pane-top">
                                <div class="pane-rep">
                                    <div class="status">
                                        <p v-if="item.PublishStatus === 0" class="unpublish">未发布</p>
                                        <p v-else-if="item.PublishStatus === 1" class="publish">已发布</p>
                                        <p v-else class="ended">已结束</p>
                                        <h5>标题：{{ item.title }}</h5>
                                    </div>
                                    <div class="task-tag">
                                        <el-tag v-for="tag in item.tags" :key="tag">
                                            {{ tag }}
                                        </el-tag>
                                    </div>
                                    <p>老师：{{ item.teacher }}</p>
                                    <p>截止时间：0213</p>
                                </div>
                                <div class="pane-skip">
                                    <el-dropdown placement="bottom">
                                        <el-button> 更多 </el-button>
                                        <template #dropdown>
                                            <el-dropdown-menu>
                                                <el-dropdown-item @click="confirmPubTask(item.id)">
                                                    立即发布
                                                </el-dropdown-item>
                                                <el-dropdown-item>立即截止</el-dropdown-item>
                                                <el-dropdown-item @click="confirmDelTask(item.id)">
                                                    立即删除
                                                </el-dropdown-item>
                                                <el-dropdown-item>编辑作业</el-dropdown-item>
                                                <el-dropdown-item @click="toTaskDetail(item.title)">
                                                    查看作业
                                                </el-dropdown-item>
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
                            <div class="pane-drop-list" v-if="item.IsDropList">
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
                    <li v-else class="list-not-li">
                        <h1>尚未发布作业</h1>
                    </li>
                </ul>
            </div>
            <div class="paging">
                <el-config-provider :locale="zhCn">
                    <el-pagination :current-page="state.pageNum" background :page-size="state.pageSize"
                        :page-sizes="[10]" v-if="FilterStatus.length > 0" layout="total, prev, pager, next, jumper"
                        :total="FilterStatus.length" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </el-config-provider>
            </div>
        </div>

        <!-- 发布作业 -->
        <el-dialog v-model="pubDialogVisible" title="发布作业" width="30%" center>
            <div>请选择要发布的班级</div>
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                全选
            </el-checkbox>
            <el-checkbox-group v-model="checkedTags" @change="handleCheckedTagsChange">
                <el-checkbox v-for="tag in tags" :key="tag" :label="tag" :value="tag">
                    {{ tag }}
                </el-checkbox>
            </el-checkbox-group>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="publishTask">
                        确定
                    </el-button>
                    <el-button @click="pubDialogVisible = false">取消</el-button>
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

        .title-left {
            display: flex;
            align-items: center;
        }

        h2 {
            margin: 0 30px;
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
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.3s;

                &:hover {
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                }

                &:last-child {
                    margin-bottom: 0;
                }

                .pane {
                    width: 100%;
                }

                .pane-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-left: 35px;
                    width: 100%;
                    height: 128px;

                    .pane-rep {
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
                                color: #fff;
                                border-radius: 10px;
                            }

                            .unpublish {
                                background-color: #f56c6c;
                            }

                            .publish {
                                background-color: #409EFF;
                            }

                            .ended {
                                background-color: #bebfbe;
                            }

                            h5 {
                                font-size: 18px;
                                margin-bottom: 0;
                                font-weight: 600;
                            }
                        }

                        .task-tag {
                            display: flex;
                            align-items: center;
                            flex-wrap: wrap;
                            gap: 10px;
                        }
                    }

                    .pane-skip {
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

                .pane-drop-list {
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

            .list-not-li {
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