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

//展示是否有章节
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
    <div>
        <p><router-link to="/home/chapter">主页</router-link> > </p>
        <div class="base">
            <div class="title">
                <h2>章节列表</h2>
                <div class="title_button">
                    <el-button type="primary" @click="addDialogVisible = true">创建章节</el-button>
                    <el-button type="primary">发布章节</el-button>
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
                                    :to="{ path: '/home/chapter/task', query: { listId: item.id, title: item.title } }">进入章节</router-link>
                                <a href="javascripy:;" @click="confirmDelChapter(item.id)">删除章节</a>
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
                    <el-pagination :current-page="state.pageNum" :page-size="state.pageSize" :page-sizes="[10]"
                        v-if="state.ChapterList.length > 0" layout="total, prev, pager, next, jumper"
                        :total="state.ChapterList.length" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </el-config-provider>
            </div>
        </div>
        <!-- 添加新章节 -->
        <el-dialog v-model="addDialogVisible" title="添加新章节" width="500" center>
            <div>
                <el-form label-width="80px">
                    <el-form-item label="章节名称">
                        <el-input v-model="newChapter.title" placeholder="请输入章节名称"></el-input>
                    </el-form-item>
                    <el-form-item label="章节描述">
                        <el-input v-model="newChapter.description" placeholder="请输入章节描述"></el-input>
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
        </el-dialog>
        <!-- 删除章节 -->
        <el-dialog v-model="delDialogVisible" title="删除章节" width="30%" center>
            <div>确定删除该章节吗？</div>
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

            &::after {
                content: "";
                display: table;
                clear: both;
            }

            .list_li {
                float: left;
                display: flex;
                /* justify-content: space-between; */
                height: 150px;
                width: 43%;
                margin: 1rem 2rem;
                border: 1px solid #ccc;
                border-radius: 7px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                /* 动画效果 */
                transition: transform 0.3s ease;

                &:hover {
                    transform: scale(1.05);
                }

                .pane {
                    display: flex;
                    align-items: center;
                    margin: 0 auto;
                    padding-left: 10px;
                    height: 100%;

                    .pane_rep {
                        width: 70%;

                        h5 {
                            margin-bottom: 20px;
                        }
                    }

                    .pane_skip {
                        width: 30%;
                        margin-left: 128px;

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
        right: 35px;
        bottom: 20px;
    }
}
</style>