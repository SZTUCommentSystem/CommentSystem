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
                <p>目录：</p>
                <input type="text" v-model="taskContent.catalogue" placeholder="请输入目标目录，若无该目录则新建目录" />
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
                <li style="margin-bottom: 10px;" v-for="problem in problems" :key="problem.topicId">
                    <div class="problem">
                        <span>{{ problem.topicTitle }}</span>
                        <span>{{ problem.topicLabelName }}</span>
                        <div class="problem-tag">
                            <el-tag v-for="tag in problem.labelNames" :key="tag">
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
                <el-date-picker v-model="taskContent.deadline" type="datetimerange" start-placeholder="开始日期"
                    end-placeholder="结束日期" format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd"
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
                        <el-select v-model="search.searchType" placeholder="全部"
                            style="margin-right: 10px; width: 200px;">
                            <el-option label="全部" value=""></el-option>
                            <el-option
                                v-for="type in questionTypeList" :key="type.topicTypeId"
                                :label="type.topicTypeName" :value="type.topicTypeId">
                            </el-option>
                        </el-select>
                    </li>
                    <li>
                        <el-input v-model="search.searchQuestion" placeholder="搜索题目"
                            style="width: 200px; font-size: 15px" :prefix-icon="Search" />
                    </li>
                </ul>
                <el-table :data="questionList" style="width: 100%">
                    <el-table-column label="序号" width="60">
                        <template #default="scope">
                        {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="topicLabelName" width="200" label="类型" />
                    <el-table-column prop="topicTitle" label="标题" />
                    <el-table-column label="标签">
                        <template #default="scope">
                            <el-tag v-for="tag in scope.row.labelNames" :key="tag" style="margin-left: 5px;">{{ tag }}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
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

<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus';
import * as dayjs from 'dayjs';
import { ref, reactive, watch, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';

import { questionListAPI, questionTypeAPI } from '@/api/QuestionAPI';
import { labelInfoAPI } from '@/api/LabelAPI';
import { SubmitTaskAPI } from '@/api/TaskAPI/TaskQuestionList';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const useStore = useUserStore();
const router = useRouter();

// 定义作业内容的类型
interface TaskContent {
    title: string;
    description: string;
    problemIds: number[];
    deadline: Date[];
    catalogue: string;
    tags?: string[];
}

const taskContent = reactive<TaskContent>({
    title: '',
    description: '',
    problemIds: [],
    deadline: [],
    catalogue: '',
});

// 获取题目类型列表
interface QuestionType {
    courseId: number;
    topicTypeId: number;
    topicTypeName: string;
}
const questionTypeList = ref<QuestionType[]>([]);

const getTypeList = async () => {
    let data = {
        courseId: useStore.selectClass.courseId,
        pageNum: 1,
        pageSize: 1000,
    };
    try {
        const res = await questionTypeAPI(data);
        if (res.data.code == 200) {
            questionTypeList.value = res.data.rows;
        }
    }
    catch (error) {
        console.error('获取题目类型列表失败:', error);
    }
};

// 模糊搜索功能
const search = reactive<{
    searchType: string;
    searchQuestion: string;
}>({
    searchType: '',
    searchQuestion: '',
});

// 获取题目类型名称
const getTypeName = (typeId: number) => {
    const type = questionTypeList.value.find(item => item.topicTypeId === typeId);
    return type ? type.topicTypeName : '';
};

// 获取题目标签信息
const labelCache = new Map<number, string>();
const pendingLabelRequests = new Map<number, Promise<string>>();

const getLabelName = async (id: number) => {
    if (labelCache.has(id)) {
        return labelCache.get(id)!;
    }
    if (pendingLabelRequests.has(id)) {
        return pendingLabelRequests.get(id)!;
    }
    // 发起请求并存入 pending
    const promise = labelInfoAPI(id).then(res => {
        if (res.data.code === 200) {
            const name = res.data.data.topicLabelName;
            labelCache.set(id, name);
            pendingLabelRequests.delete(id);
            return name;
        } else {
            pendingLabelRequests.delete(id);
            return '';
        }
    });
    pendingLabelRequests.set(id, promise);
    return promise;
};

const getLabelNamesByIds = async (labelIds: string) => {
    if (!labelIds) return [];
    const ids = labelIds.split(',').map(Number).filter(id => !isNaN(id));
    const names = await Promise.all(ids.map(id => getLabelName(id)));
    return names;
};

// 题目列表
interface Question {
    courseId: number;
    labelIds: string;
    topicId: number;
    topicTitle: string;
    topicTypeId: number;
    topicLabelName?: string;
    labelNames?: string[];
}
const questionList = ref<Question[]>([]);

const getQuestionList = async () => {
    let data = {
        courseId: useStore.selectClass.courseId,
        pageNum: 1,
        pageSize: 10,
        topicTypeId: search.searchType ? Number(search.searchType) : undefined,
        topicTitle: search.searchQuestion || undefined,
    };

    const res = await questionListAPI(data);
    if (res.data.code === 200) {
        // 格式化每个题目的类型名和标签名
        const formatted = await Promise.all(res.data.rows.map(async (item: any) => ({
            ...item,
            topicLabelName: getTypeName(item.topicTypeId),
            labelNames: await getLabelNamesByIds(item.labelIds),
        })));
        questionList.value = formatted;
    }
};

// 动态数组，用于存储选中的题目
const dynamicArray = ref<{ questionId: number; checked: boolean }[]>([]);

watch(questionList, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        dynamicArray.value = newVal.map(item => ({
            questionId: item.topicId,
            checked: false,
        }));
    }
});

const problems = ref<any[]>([]);
const tags = ref<string[]>([]);

let timer:any = null;
watch(
    () => [search.searchType, search.searchQuestion],
    () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            getQuestionList();
        }, 300);
    },
    {
        immediate: true
    }
)

watch(problems, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        const allTags = newVal.map(item => item.labelNames).flat();
        tags.value = Array.from(new Set(allTags));
    }
});

const selDialogVisible = ref(false);

const selectProblem = () => {
    taskContent.problemIds = dynamicArray.value
        .filter(item => item.checked)
        .map(item => item.questionId);

    problems.value = dynamicArray.value
        .filter(item => item.checked)
        .map(item => questionList.value.find(q => q.topicId === item.questionId))
        .filter(Boolean);

    selDialogVisible.value = false;
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
        if (!taskContent.catalogue) {
            ElMessageBox.alert('目录不能为空！', '错误', {
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

        const formattedDeadline = taskContent.deadline.map((date: Date) =>
            dayjs(date).format('YYYY-MM-DD HH:mm:ss')
        );

        taskContent.tags = tags.value;

        taskContent.problemIds = dynamicArray.value
            .filter(item => item.checked)
            .map(item => item.questionId);

        const submitData = {
            ...taskContent,
            deadline: formattedDeadline
        };

        const res = await SubmitTaskAPI(submitData);
        if (res.data.code === 200) {
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
    } catch (error) {
        ElMessageBox.alert('提交过程中发生错误，请重试！', '错误', {
            confirmButtonText: '确定',
            type: 'error',
        });
    }
};

onMounted(() => {
    getTypeList();
    getQuestionList();
});
</script>

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
    flex-direction: column;
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