<template>
    <div class="create-wrapper">
        <div class="header">
            <el-page-header @back="router.push('/home/task')" content="新建作业" title="返回">
            </el-page-header>
        </div>
        <div class="create-title-top">
            <div class="left">
                <p>标题：</p>
                <input type="text" v-model="taskContent.homeworkTitle" placeholder="请输入题目标题" />
            </div>
            <div class="right">
                <p>目录：</p>
                <el-select
                    v-model="taskContent.homeworkContent"
                    placeholder="请选择目录"
                    style="width: 100%;"
                    popper-class="type-select-dropdown"
                    :teleported="false"
                    filterable
                >
                    <el-option
                        v-for="item in homeworkComment"
                        :key="item.homeworkContentId"
                        :label="item.homeworkContentName"
                        :value="item.homeworkContentName"
                    >
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span>{{ item.homeworkContentName }}</span>
                            <span style="margin-left: 10px;">
                                <img
                                    src="@/assets/img/编辑.png"
                                    class="icon-btn"
                                    style="margin-left: 8px;"
                                    @click.stop="openEditHomeworkDialog(item)"
                                />
                                <img
                                    src="@/assets/img/删除2.png"
                                    class="icon-btn"
                                    style="margin-left: 8px;"
                                    @click.stop="removeType(item.homeworkContentId)"
                                />
                            </span>
                        </div>
                    </el-option>
                    <el-input
                        v-if="inputVisble"
                        ref="InputRef"
                        v-model="newHomeworkContent"
                        placeholder="请输入新目录"
                        class="type-input"
                        size="default"
                        @keyup.enter="addType"
                        @blur="addType"
                    />
                    <el-button
                        v-else
                        key="primary"
                        type="primary"
                        text
                        style="margin-left: 6px;"
                        @click="showInput"
                    >
                        添加
                    </el-button>
                </el-select>
            </div>
        </div>
        <div class="create-title">
            <p>描述（可选）：</p>
            <input type="text" v-model="taskContent.homeworkDescribe" placeholder="请输入作业简介" />
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
                <el-date-picker
                    v-model="taskContent.timeRange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="请选择开始时间"
                    end-placeholder="请选择截止时间"
                    format="YYYY-MM-DD"
                />
            </div>
        </div>
        <div class="button_submit">
            <el-button type="primary" @click="submitTask">保存</el-button>
            <router-link to="/home/task">
                <el-button>取消</el-button>
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
                <el-table
                    :data="questionList"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    :row-key="(row: Question) => row.topicId"
                >
                    <el-table-column type="selection" width="55" />
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
        <!-- 编辑目录弹窗 -->
        <el-dialog v-model="editHomeworkDialogVisible" title="编辑目录" width="400px">
            <el-input v-model="editHomeworkContentValue" placeholder="请输入目录名称" />
            <template #footer>
                <el-button @click="editHomeworkDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmEditHomeworkContent()">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import { Search } from '@element-plus/icons-vue';

import { questionListAPI, questionDetailAPI, questionTypeAPI } from '@/api/QuestionAPI';
import { labelInfoAPI } from '@/api/LabelAPI';
import { taskDetailAPI, changeTaskAPI } from '@/api/TaskAPI';
import { taskCategoryListAPI, addTaskCategoryAPI, changeTaskCategoryAPI, deleteTaskCategoryAPI } from "@/api/TaskAPI";

import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// 定义作业内容的类型
interface TaskContent {
    courseId: number;
    homeworkId?: number;
    homeworkTitle: string;
    homeworkDescribe: string;
    topicIds: number[];
    // limitTime?: Date;
    timeRange: [Date, Date];
    homeworkContent?: string;
    userId?: number;
}

const taskContent = reactive<TaskContent>({
    courseId: userStore.selectClass.courseId,
    homeworkId: null,
    homeworkTitle: '',
    homeworkDescribe: '',
    topicIds: [],
    // limitTime: undefined,
    timeRange: [undefined, undefined],
    homeworkContent: '', // 目录
});

// 题目相关
const problems = ref<any[]>([]);
const tags = ref<string[]>([]);

// 目录相关
interface HomeWorkComment {
    courseId: number;
    homeworkContentId: number;
    homeworkContentName: string;
    spreadIndex: boolean;
}
const homeworkComment = reactive<HomeWorkComment[]>([]);

// 题目类型
interface QuestionType {
    courseId: number;
    topicTypeId: number;
    topicTypeName: string;
}
const questionTypeList = ref<QuestionType[]>([]);

// 题库列表
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

// 题库搜索
const search = reactive<{
    searchType: string;
    searchQuestion: string;
}>({
    searchType: '',
    searchQuestion: '',
});

// 标签缓存
const labelCache = new Map<number, string>();
const pendingLabelRequests = new Map<number, Promise<string>>();
const getLabelName = async (id: number) => {
    if (labelCache.has(id)) return labelCache.get(id)!;
    if (pendingLabelRequests.has(id)) return pendingLabelRequests.get(id)!;
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

// 目录列表
const getHomeworkComment = async () => {
    let data = {
        courseId: userStore.selectClass.courseId,
        pageSize: 1000,
        pageNum: 1
    }
    try {
        const res = await taskCategoryListAPI(data)
        if (res.data.code == 200) {
            const categories = res.data.rows;
            homeworkComment.length = 0;
            categories.forEach((item: any) => {
                homeworkComment.push({
                    courseId: item.courseId,
                    homeworkContentId: item.homeworkContentId,
                    homeworkContentName: item.homeworkContentName,
                    spreadIndex: false
                });
            });
        }
    } catch (error) {
        console.log('获取作业分类列表失败:', error);
    }
}

// 题目类型列表
const getTypeList = async () => {
    let data = {
        courseId: userStore.selectClass.courseId,
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
const getTypeName = (typeId: number) => {
    const type = questionTypeList.value.find(item => item.topicTypeId === typeId);
    return type ? type.topicTypeName : '';
};

// 题库列表
const getQuestionList = async () => {
    let data = {
        courseId: userStore.selectClass.courseId,
        pageNum: 1,
        ////////////////////这里暂时没管是不是分页器、、、、、、、、、、、、、、、、、、
        pageSize: 10,
        topicTypeId: search.searchType ? Number(search.searchType) : undefined,
        topicTitle: search.searchQuestion || undefined,
    };
    const res = await questionListAPI(data);
    if (res.data.code === 200) {
        const formatted = await Promise.all(res.data.rows.map(async (item: any) => ({
            ...item,
            topicLabelName: getTypeName(item.topicTypeId),
            labelNames: await getLabelNamesByIds(item.labelIds),
        })));
        questionList.value = formatted;
    }
};

// 题库选择
const selectedRows = ref<Question[]>([]);
const handleSelectionChange = (rows: Question[]) => {
    selectedRows.value = rows;
};
const selDialogVisible = ref(false);
const selectProblem = () => {
    taskContent.topicIds = selectedRows.value.map(item => item.topicId);
    problems.value = [...selectedRows.value];
    selDialogVisible.value = false;
};

// 标签联动
watch(problems, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        const allTags = newVal.map(item => item.labelNames).flat();
        tags.value = Array.from(new Set(allTags));
    }
});

// 目录编辑相关
const editHomeworkDialogVisible = ref(false)
const editHomeworkContentId = ref<number | null>(null)
const editHomeworkContentValue = ref('')

function openEditHomeworkDialog(item: HomeWorkComment) {
    editHomeworkContentId.value = item.homeworkContentId
    editHomeworkContentValue.value = item.homeworkContentName
    editHomeworkDialogVisible.value = true
}

const confirmEditHomeworkContent = async () => {
    let item = homeworkComment.find(item => item.homeworkContentId === editHomeworkContentId.value);
    let data = {
        courseId: userStore.selectClass.courseId,
        homeworkContentId: item?.homeworkContentId,
        homeworkContentName: editHomeworkContentValue.value.trim(),
    }
    const res = await changeTaskCategoryAPI(data)
    if (res.data.code === 200) {
        ElMessage.success('修改成功')
        getHomeworkComment()
        editHomeworkContentId.value = null
        editHomeworkContentValue.value = ''
        editHomeworkDialogVisible.value = false
    } else {
        ElMessage.error('修改失败，请稍后再试')
        editHomeworkDialogVisible.value = false
    }
}

// 删除目录
const removeType = async (idx: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该类型吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await deleteTaskCategoryAPI(idx)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      getTypeList()
      getHomeworkComment()
    } else {
      ElMessage.error('删除失败，请稍后再试')
    }
  } catch (error) {
    console.error('删除题目类型失败:', error)
    ElMessage.error('删除失败，请稍后再试')
  }
}

// 增加目录
const inputVisble = ref(false)
const newHomeworkContent = ref('')
const showInput = () => {
  inputVisble.value = true
  nextTick(() => {
    const inputRef = ref<HTMLInputElement | null>(null)
    inputRef.value = document.querySelector('.tag-input') as HTMLInputElement
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}
const addType = async () => {
  if (!newHomeworkContent.value.trim()) {
    ElMessage.warning('类型名称不能为空')
    inputVisble.value = false
    return
  }
  let data = {
    courseId: userStore.selectClass.courseId,
    homeworkContentName: newHomeworkContent.value.trim(),
  }
  const res = await addTaskCategoryAPI(data)
  if(res.data.code === 200) {
    ElMessage.success('添加成功')
    newHomeworkContent.value = ''
    getTypeList()
    getHomeworkComment()
  } else {
    ElMessage.error('添加失败，请稍后再试')
  }
  inputVisble.value = false
}

// 获取详情并填充
const getDetail = async () => {
    try {
        // 先获取目录列表，保证目录id和名称能对应
        await getHomeworkComment();
        const res = await taskDetailAPI(Number(route.query.id))
        if (res.data.code == 200) {
            const ret = res.data.data;
            taskContent.homeworkId = ret.homeworkId
            // 标题、描述
            taskContent.homeworkTitle = ret.homeworkTitle || '';
            taskContent.homeworkDescribe = ret.homeworkDescribe || '';
            // 目录（用目录id找到目录名）
            const content = homeworkComment.find(item => item.homeworkContentId === ret.homeworkContentId);
            taskContent.homeworkContent = content ? content.homeworkContentName : '';
            // 截止时间
            taskContent.timeRange[0] = ret.startTime ? dayjs(ret.startTime).toDate() : undefined;
            taskContent.timeRange[1] = ret.limitTime ? dayjs(ret.limitTime).toDate() : undefined;
            // 题目
            if (ret.topicIds) {
                const topicIdArr = ret.topicIds.split(',').map((id: string) => Number(id));
                const formatted: any[] = [];
                for (const id of topicIdArr) {
                    const questionRes = await questionDetailAPI(id);
                    if (questionRes.data.code === 200 && questionRes.data.data) {
                        const item = questionRes.data.data;
                        formatted.push({
                            ...item,
                            topicLabelName: getTypeName(item.topicTypeId),
                            labelNames: await getLabelNamesByIds(item.labelIds),
                        });
                    }
                }
                problems.value = formatted;
                selectedRows.value = formatted;
                taskContent.topicIds = topicIdArr;
                // 标签
                const allTags = formatted.map((item: any) => item.labelNames).flat();
                tags.value = Array.from(new Set(allTags));
            } else {
                problems.value = [];
                selectedRows.value = [];
                tags.value = [];
                taskContent.topicIds = [];
            }
        }
    } catch (error: any) {
        console.log(error.message)
    }
}

// 提交作业
const submitTask = async () => {
    try {
        if (!taskContent.homeworkTitle) {
            ElMessage.error('标题不能为空！');
            return;
        }
        if (!taskContent.homeworkContent) {
            ElMessage.error('目录不能为空！');
            return;
        }
        if (!tags.value.length) {
            ElMessage.error('请选择至少一个题目！');
            return;
        }
        taskContent.topicIds = problems.value.map(item => item.topicId);
        let homeworkCommentId = homeworkComment.filter(item => item.homeworkContentName == taskContent.homeworkContent);
        const submitData = {
            ...taskContent,
            topicIds: taskContent.topicIds.join(','),
            homeworkContentId: homeworkCommentId[0]?.homeworkContentId,
        };
        delete submitData.homeworkContent;
        const res = await changeTaskAPI(submitData);
        if (res.data.code === 200) {
            ElMessage.success('保存作业成功')
            router.push({
                name: 'task',
                query: { forceRefresh: Date.now() },
            })
        } else {
            ElMessage.error('保存作业失败，请稍后再试');
            console.error('保存作业失败:', res.data.message);
        }
    } catch (error) {
        ElMessage.error('保存作业失败，请稍后再试');
        console.error('保存作业失败:', error);
    }
};

onMounted(() => {
    getTypeList();
    getQuestionList();
    getDetail();
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

    .right :deep(.el-select__wrapper) {
        height: 47px;
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

.icon-btn {
    width: 15px;
    height: 15px;
    cursor: pointer;
    margin-left: 10px;
}

.type-input {
    width: 20%;
    margin-top: 5px;
    margin-left: 20px;
}
</style>