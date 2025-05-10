<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import { ref, reactive, watch, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { questionListAPI } from '@/api/QuestionAPI';
import { SubmitTaskAPI } from '@/api/TaskAPI/TaskQuestionList';
import { useRouter } from 'vue-router';

// 路由
const router = useRouter();

// 作业内容
const taskContent = reactive({
    title: '',
    description: '',
    problemIds: [],
    deadline: [],
    teacher: '', // 添加 teacher 字段
})

// 题目
// 展示可选择的题目
const search = reactive({
    searchType: '',
    searchQuestion: '',
    searchTag: '',
});
const questionList = ref([]);
// 获取题目列表
const getQuestionList = async () => {
    const res = await questionListAPI();
    questionList.value = res.data.data;
    console.log("获取的题目列表:", questionList.value); // 检查题目数据是否正确
};

// 动态创建可选择数组
const dynamicArray = ref([]);
watch(questionList, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // 根据 problems 列表的长度动态创建一个数组
        dynamicArray.value = new Array(newVal.length).fill(null).map((_, index) => {
            return { questionId: questionList.value[index].id, checked: false };
        });
        console.log("动态数组更新:", dynamicArray.value); // 确保动态数组正确更新
    }
});

// 被选择的题目
const problems = ref([]);

// 标签
const tags = ref([]);

// 判断是否选择了题目
watch(problems, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        const allTags = newVal.map((item) => item.tags).flat();
        tags.value = Array.from(new Set(allTags));
    }
})

// 选择题目相关
const selDialogVisible = ref(false);
const selectProblem = () => {
    console.log("选择前的 dynamicArray:", dynamicArray.value); // 先打印动态数组的状态

    taskContent.problemIds = dynamicArray.value
        .filter((item) => item.checked)
        .map((item) => item.questionId);

    problems.value = dynamicArray.value
        .filter((item) => item.checked)
        .map((item) => questionList.value.find(q => q.id === item.questionId));

    selDialogVisible.value = false;

    console.log("选中的题目 ID:", taskContent.problemIds);
    console.log("选中的题目信息:", problems.value);
};
// 提交作业
const submitTask = async () => {
    try {
        if (!taskContent.title) {
            ElMessageBox.alert('标题不能为空！', '错误', {
                confirmButtonText: '确定',
                type: 'error',
            });
            return;
        }
        if (!taskContent.teacher) {
            ElMessageBox.alert('老师名字不能为空！', '错误', {
                confirmButtonText: '确定',
                type: 'error',
            });
            return;
        }
        if (!tags.value.length) {
            ElMessageBox.alert('题目跟标签不能为空！', '错误', {
                confirmButtonText: '确定',
                type: 'error',
            });
            return;
        }

        // 格式化日期
        taskContent.deadline = taskContent.deadline.map((date: Date) =>
            dayjs(date).format('YYYY-MM-DD HH:mm:ss')
        );

        // 将 tags 添加到 taskContent
        taskContent.tags = tags.value;

        // 获取选中的题目 ID
        taskContent.selectedQuestion = dynamicArray.value
            .filter(item => item.checked)
            .map(item => item.questionId);

        console.log("提交时的任务内容:", taskContent); // 确保数据正确

        // 提交
        const res = await SubmitTaskAPI(taskContent);

        if (res.code === 200) {
            ElMessageBox.alert('提交成功！', '成功', {
                confirmButtonText: '确定',
                type: 'success',
                callback: () => {
                    router.push('/home/task');
                }
            });
        } else {
            ElMessageBox.alert('提交失败，请重试！', '错误', {
                confirmButtonText: '确定',
                type: 'error',
            });
        }

        console.log("提交结果:", res);
    } catch (error) {
        console.log("提交错误:", error);
        ElMessageBox.alert('提交过程中发生错误，请重试！', '错误', {
            confirmButtonText: '确定',
            type: 'error',
        });
    }
};

onMounted(() => {
    getQuestionList();
});
</script>

<template>
    <div class="create-wrapper">
        <div class="header">
            <el-page-header @back="router.push('/home/task')" content="新建作业" title="返回">
            </el-page-header>
        </div>
        <div class="create-title-top">
            <div class="left">
                <p>标题：</p>
                <input type="text" v-model="taskContent.title" placeholder="请输入题目标题" />
            </div>
            <div class="right">
                <p>老师名字：</p> <!-- 将“目录”改为“老师名字” -->
                <input type="text" v-model="taskContent.teacher" placeholder="请输入老师名字" /> <!-- 改为绑定到 teacher 字段 -->
            </div>
        </div>
        <div class="create-title">
            <p>描述（可选）：</p>
            <input type="text" v-model="taskContent.description" placeholder="请输入作业简介" />
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
                <el-date-picker v-model="taskContent.deadline" type="datetimerange" start-placeholder="Start date"
                    end-placeholder="End date" format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd"
                    time-format="A hh:mm:ss" />
            </div>
        </div>
        <div class="button_submit">
            <el-button type="primary" @click="submitTask">提交</el-button>
            <router-link to="/home/task">
                <el-button type="success">保存</el-button>
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
                    <li style="margin-bottom: 10px;" v-for="(problem, index) in questionList" :key="index">
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

}

.header {
    font-size: 20px;
    background-color: white;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px
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