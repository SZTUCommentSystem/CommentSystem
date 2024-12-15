<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue';
import { useTaskDetail } from '@/hooks/TaskDetailHooks/useTaskDetail'
import { useQuestionList } from '@/hooks/TaskDetailHooks/useQuestionList'

const route = useRoute()

const { getTaskDetail, taskDetail } = useTaskDetail()
const {
    search,
    problems,
    tags,
    getTaskQuestionList,
    filteredQuestionList,
    getQuestionList,
    dynamicArray,
    selDialogVisible,
    selectProblem
} = useQuestionList(taskDetail)

onMounted(async () => {
    await getTaskDetail();
    getQuestionList();
    getTaskQuestionList();
})

// 监听路由参数变化
watch(() => route.query, async (newQuery, oldQuery) => {
    if (newQuery.id !== oldQuery.id) {
        await getTaskDetail();
        getTaskQuestionList();
        getQuestionList();
    }
});

</script>

<template>
    <div class="create-wrapper">
        <div class="header">
            <el-page-header @back="$router.push('/home/task')" content="编辑作业" title="返回">
            </el-page-header>
        </div>
        <div class="create-title-top">
            <div class="left">
                <p>标题：</p>
                <input type="text" v-model="taskDetail.title" placeholder="请输入题目标题" />
            </div>
            <div class="right">
                <p>目录：</p>
                <input type="text" v-model="taskDetail.title" placeholder="请输入作业要放入的目录" />
            </div>
        </div>
        <div class="create-title auto-height">
            <p>请选择本次作业的题目：</p>
            <el-button type="primary" plain @click="selDialogVisible = true">去题库选择</el-button>
            <ul style="padding: 0; margin-top: 10px;">
                <li style="margin-bottom: 10px;" v-for="problem in problems" :key="problem.id">
                    <div class="problem">
                        <span>{{ problem.title }}</span>
                        <span>{{ problem.type }}</span>
                        <div class="problem-tag">
                            <el-tag v-for="tag in problem.tags" :key="tag">
                                {{ tag }}
                            </el-tag>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="create-title">
            <p>根据选择的题目得到的标签为：</p>
            <div class="problem-tag">
                <el-tag v-for="tag in tags" :key="tag">
                    {{ tag }}
                </el-tag>
            </div>
        </div>
        <div class="create-title">
            <p>请选择本次作业的截止时间：</p>
            <div class="block">
                <el-date-picker v-model="taskDetail.DeadLine" type="datetimerange" start-placeholder="Start date"
                    end-placeholder="End date" format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd"
                    time-format="A hh:mm:ss" />
            </div>
        </div>
        <div class="button_submit">
            <el-button type="primary">提交</el-button>
            <router-link to="/home/task">
                <el-button>取消</el-button>
            </router-link>
        </div>


        <!-- 选择题目 -->
        <el-dialog v-model="selDialogVisible" title="选择题目" width="60%" center>
            <div class="select">
                <ul class="select-header">
                    <li>
                        <el-select v-model="search.searchType" placeholder="选择题目类型"
                            style="margin-right: 10px; width: 200px;">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="选择题" value="选择题"></el-option>
                            <el-option label="填空题" value="填空题"></el-option>
                            <el-option label="判断题" value="判断题"></el-option>
                            <el-option label="编程题" value="编程题"></el-option>
                            <el-option label="工程制图" value="工程制图"></el-option>
                            <el-option label="工程设计" value="工程设计"></el-option>
                        </el-select>

                    </li>
                    <li>
                        <el-input v-model="search.searchQuestion" placeholder="搜索题目"
                            style="width: 200px; font-size: 15px" :prefix-icon="Search" />
                    </li>
                    <li>
                        <el-input v-model="search.searchTag" placeholder="搜索标签" style="width: 200px; font-size: 15px"
                            :prefix-icon="Search" />
                    </li>
                </ul>
                <div class="select-title">
                    <span style="margin-right: 22%;">序号</span>
                    <span style="margin-right: 27%;">标题</span>
                    <span style="margin-right: 31%;">类型</span>
                    <span>标签</span>
                </div>
                <ul style="margin:0;padding: 0; margin-top: 10px;width: 100%;">
                    <li style="margin-bottom: 10px;" v-for="(problem, index) in filteredQuestionList" :key="index">
                        <div class="select-problem" @click="dynamicArray[index].checked = !dynamicArray[index].checked"
                            :class="{ blue: dynamicArray[index].checked }">
                            <span>{{ index }}</span>
                            <span>{{ problem.title }}</span>
                            <span>{{ problem.type }}</span>
                            <div class="problem-tag">
                                <el-tag v-for="tag in problem.tags" :key="tag">
                                    {{ tag }}
                                </el-tag>
                            </div>
                            <div class="selected" v-show="dynamicArray[index].checked === true">√</div>
                        </div>
                    </li>
                </ul>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="selectProblem">
                        确定
                    </el-button>
                    <el-button @click="selDialogVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.blue {
    border: 1px solid #409eff !important;
}

.header {
    font-size: 20px;
    background-color: white;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px
}

.create-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

}

.create-title-top {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;


    .left,
    .right {
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        background-color: #fff;
        width: 49%;
    }


    .right {
        width: 50%;
        margin-left: 10px;
    }

    p {
        margin: 0;
        font-size: 18px;
        margin-bottom: 10px;
    }

    input {
        display: inline-block;
        width: 100%;
        height: 45px;
        padding-left: 10px;
        border: 1px solid #ccc;
        border-radius: 10px;

        &:focus {
            outline: none;
        }
    }
}

.create-title {
    display: flex;
    /* 纵向排列 */
    flex-direction: column;
    /* 向左对齐 */
    align-items: flex-start;
    width: 100%;
    height: 98px;
    margin-bottom: 5px;
    padding: 10px 20px;
    background-color: #fff;

    p {
        margin: 0;
        font-size: 18px;
        margin-bottom: 10px;
    }

    input {
        display: inline-block;
        width: 100%;
        height: 45px;
        margin-top: 5px;
        padding-left: 10px;
        border: 1px solid #ccc;
        border-radius: 10px;

        &:focus {
            outline: none;
        }
    }
}

.auto-height {
    height: auto;
}

.select-problem,
.problem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px;
    background-color: #f9f9f9;


    span {
        margin-right: 10px;
    }

    i {
        cursor: pointer;
        margin-left: 100px;
    }
}

.select-problem {
    position: relative;
    width: 100%;
    cursor: pointer;
    border: 1px solid transparent;

    &:hover {
        border: 1px solid #409eff;
    }

    .selected {
        position: absolute;
        right: 0;
        top: 0;
        width: 10px;
        height: 10px;
        color: #fff;
        text-align: center;
        line-height: 10px;
        font-size: 5px;
        background-color: #409eff;
    }
}

.problem-tag {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.block {
    margin-top: 10px;
}

.button_submit {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-right: 15px;

    button {
        margin-left: 10px;
        padding: 0 35px;
    }
}

.select {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;

    .select-header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 10px;
        background-color: #f9f9f9;
    }

    .select-title {
        display: flex;
        width: 100%;
        padding: 10px;
        background-color: #f9f9f9;
        margin-top: 10px;
    }
}
</style>