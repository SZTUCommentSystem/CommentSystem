<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue';
import { questionListAPI } from '@/api/QuestionAPI/questionList'
import { TaskDetailAPI, TaskQuestionListAPI } from '@/api/TaskAPI/TaskQuestionList';
import dayjs from 'dayjs';

// 获取传参
const route = useRoute()

// 作业内容
const taskDetail = reactive({
    title: '',
    description: '',
    selectedQuestion: [],
    DeadLine: [],
})
const getTaskDetail = async () => {
    const res = await TaskDetailAPI(route.query.id)
    const data = res.data.data;
    Object.assign(taskDetail, data);

    taskDetail.DeadLine = [
        dayjs(data.DeadLine[0]).format('YYYY-MM-DD HH:mm:ss'),
        dayjs(data.DeadLine[1]).format('YYYY-MM-DD HH:mm:ss')
    ];
    console.log(taskDetail);
}

// 根据题目id获取题目列表
const problems = ref([])
const tags = ref([])
const getTaskQuestionList = async () => {
    const res = await TaskQuestionListAPI(taskDetail.selectedQuestion)
    problems.value = res.data.data
    const allTags = problems.value.map((item) => item.tags).flat()
    tags.value = Array.from(new Set(allTags))
}
// 判断题目是否有改变
watch(problems, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        const allTags = newVal.map((item) => item.tags).flat();
        tags.value = Array.from(new Set(allTags));
    }
})

// 展示可选择的题目
const questionList = ref([]);
// 获取题目列表
const getQuestionList = async () => {
    const res = await questionListAPI();
    questionList.value = res.data.data;
};
// 动态创建可选择数组
const dynamicArray = ref([]);
watch(questionList, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // 根据 problems 列表的长度动态创建一个数组
        dynamicArray.value = new Array(newVal.length).fill(null).map((_, index) => {
            const checked = taskDetail.selectedQuestion.includes(questionList.value[index].id);
            return { questionId: questionList.value[index].id, checked: checked };
        });
    }
});

// 选择题目相关
const selDialogVisible = ref(false);
const selectProblem = () => {
    taskDetail.selectedQuestion = dynamicArray.value.filter((item) => item.checked).map((item) => item.questionId);
    problems.value = dynamicArray.value.filter((item) => item.checked).map((item) => questionList.value.find(q => q.id === item.questionId));
    selDialogVisible.value = false;
    console.log(taskDetail);
};

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
        <h2 style="margin-bottom: 10px;">作业详情</h2>
        <div class="create-title">
            <p>标题：</p>
            <input type="text" v-model="taskDetail.title" placeholder="请输入作业标题" />
        </div>
        <div class="create-title">
            <p>描述（可选）：</p>
            <input type="text" v-model="taskDetail.description" placeholder="请输入作业简介" />
        </div>
        <div class="create-title auto-height">
            <p>请选择本次作业的题目：</p>
            <el-button type="primary" plain @click="selDialogVisible = true">去题库选择</el-button>
            <ul style="padding: 0; margin-top: 10px;">
                <li style="margin-bottom: 10px;" v-for="problem in problems" :key="problems.id">
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
        <el-dialog v-model="selDialogVisible" title="选择题目" width="30%" center>
            <div class="select">
                <el-input placeholder="搜索题目" style="width: 200px; font-size: 15px" :prefix-icon="Search" />
                <div class="select-title">
                    <span style="margin-right: 30px;">序号</span>
                    <span style="margin-right: 70px;">标题</span>
                    <span>类型</span>
                </div>
                <ul style="margin:0;padding: 0; margin-top: 10px;">
                    <li style="margin-bottom: 10px;" v-for="(problem, index) in questionList" :key="questionList.id">
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

.create-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
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
    width: 375px;
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

    .select-title {
        display: flex;
        width: 100%;
        padding: 10px;
        background-color: #f9f9f9;
        margin-top: 10px;
    }
}
</style>