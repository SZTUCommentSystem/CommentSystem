<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { ElConfigProvider } from "element-plus";
import { zhCn } from "element-plus/es/locale/index.mjs";

// 从ListDisplay.ts中引入
import ListDisplay from "./hooks/ListDisplay";
// 从DelAndAddList.ts中引入
import DelAndAddList from "./hooks/DelAndAddList";

const { state, handleSizeChange, handleCurrentChange, displayedChapters } = ListDisplay();

const { delDialogVisible, confirmDelChapter, deleteChapter: deleteTaskOriginal, addDialogVisible, newChapter, addChapter: addChapterOriginal } = DelAndAddList(state.ChapterList);

const deleteChapter = () => {
    state.ChapterList = deleteTaskOriginal();
}

const addChapter = () => {
    state.ChapterList = addChapterOriginal();
}

//展示是否有作业
const IsChapter = ref(true);
watchEffect(() => {
    if (state.ChapterList.length === 0) {
        IsChapter.value = false;
    } else {
        IsChapter.value = true;
    }
});
</script>
<template>
    <div class="all_class">
        <div class="base">
            <div class="title">
                <h2>作业列表</h2>
                <div class="title_button">
                    <el-button type="primary" @click="addDialogVisible = true">去创建作业</el-button>
                    <!-- <el-button type="primary">发布作业</el-button> -->
                </div>
            </div>
            <div class="list">
                <ul>
                    <li v-for="item in displayedChapters" :key="item.id" v-if="IsChapter" class="list_li">
                        <div class="pane">
                            <div class="pane_rep">
                                <h5>标题：{{ item.title }}</h5>
                                <p>描述：{{ item.description }}</p>
                            </div>
                            <div class="pane_skip">
                                <router-link
                                    :to="{ path: '/home/chapter/task', query: { listId: item.id, title: item.title } }">进入作业</router-link>
                                <br>
                                <a href="javascript:;" @click="confirmDelChapter(item.id)">删除作业</a>
                                <br>
                                <a href="javascript:;">批改作业</a>
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
                        :page-sizes="[10]" v-if="state.ChapterList.length > 0" layout="total, prev, pager, next, jumper"
                        :total="state.ChapterList.length" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </el-config-provider>
            </div>
        </div>
        <!-- 添加新作业
        <el-dialog v-model="addDialogVisible" title="添加新作业" width="30vw" center>
            <div>
                <el-form label-width="5vw">
                    <el-form-item label="作业名称" class="font2vw">
                        <el-input v-model="newChapter.title" placeholder="请输入作业名称"></el-input>
                    </el-form-item>
                    <el-form-item label="作业描述">
                        <el-input v-model="newChapter.description" placeholder="请输入作业描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="addChapter">
                        确定
                    </el-button>
                    <el-button @click="addDialogVisible = false">取消</el-button>
                </div>
            </template>
</el-dialog> -->
        <!-- 删除作业 -->
        <el-dialog v-model="delDialogVisible" title="删除作业" width="30vw" center>
            <div>确定删除该作业吗？</div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="deleteChapter">
                        确定
                    </el-button>
                    <el-button @click="delDialogVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<style scoped>
.font2vw {
    font-size: 2vw;
}

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
    border-radius: 2%;
    background-color: #fff;

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
            font-size: 2vw;
            margin-left: 1.5vw;
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
            padding-left: 1.5vw;
            min-height: 200px;
            background-color: #e7e7e736;

            &::after {
                content: "";
                display: table;
                clear: both;
            }

            .list_li {
                float: left;
                height: 10vw;
                width: 43%;
                margin: 1vw 2vw;
                border: 1px solid #ccc;
                border-radius: 1vw;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                /* 动画效果 */
                transition: transform 0.3s ease;

                &:hover {
                    transform: scale(1.05);
                }

                &:first-child,
                &:nth-child(2) {
                    margin-top: 2vw;
                }

                &:nth-last-child(1),
                &:nth-last-child(2) {
                    margin-bottom: 2vw;
                }

                .pane {
                    display: flex;
                    align-items: center;
                    margin: 0 auto;
                    padding-left: 1vw;
                    height: 100%;

                    .pane_rep {
                        width: 70%;

                        h5 {
                            font-size: 1.6vw;
                            margin-bottom: 20px;
                        }
                    }

                    .pane_skip {
                        width: 30%;
                        margin-left: 1vw;

                        a {
                            margin-right: 10px;
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
        right: 1vw;
        bottom: 1vw;
    }
}

/* .all_class ::v-deep .el-dialog__title {
    font-size: 1.5vw;
} */

.all_class button {
    height: 3.5vh;
}

.all_class ::v-deep .el-pagination .el-pager li {
    font-size: 1.2vw;
}

.all_class ::v-deep .el-input__wrapper {
    padding: 0.3vw;
}
</style>