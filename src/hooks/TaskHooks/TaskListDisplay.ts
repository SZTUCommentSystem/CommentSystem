import { ref, reactive, computed } from "vue";

import { useUserStore } from "@/store/user";

import { taskListAPI, taskCategoryListAPI } from "@/api/TaskAPI/TaskQuestionList";
import { questionDetailAPI } from "@/api/QuestionAPI";
import { labelInfoAPI } from "@/api/LabelAPI";

// 新的作业类型
export interface HomeworkTask {
    homeworkId: number;         // 作业信息id（唯一）
    courseId: number;           // 课程id
    homeworkTitle: string;      // 作业名称
    homeworkContentId: number;  // 作业分类id
    homeworkDescribe: string;   // 作业介绍
    topicIds: string;           // 对应的题目id（多）
    limitTime: string;         
    classIds: number;           // 班级id
    userId: number;             // 用户id（布置老师）
    tags?: string[];            // 标签（可选）
}

interface State {
    TaskList: HomeworkTask[];
    pageSize: number;
    pageNum: number;
}

interface HomeWorkComment {
    courseId: number; // 课程id
    homeworkContentId: number; // 作业分类id
    homeworkContentName: string; // 作业分类名称
    spreadIndex: boolean; // 是否展开
}

// 获取所有题目的标签（去重）
export const getTagsByQuestionIds = async (questionIds: number[]) => {
    const labelIdSet = new Set<number>();

    // 1. 获取所有题目的 labelIds
    const detailPromises = questionIds.map(id => questionDetailAPI(id));
    const details = await Promise.all(detailPromises);

    details.forEach(res => {
        if (res.data?.data?.labelIds) {
            const ids = res.data.data.labelIds
                .split(',')
                .map((id: string) => Number(id))
                .filter((id:number) => !isNaN(id));
            ids.forEach((id:number) => labelIdSet.add(id));
        }
    });

    // 2. 获取所有标签详情
    const labelIds = Array.from(labelIdSet);
    const labelPromises = labelIds.map(id => labelInfoAPI(id));
    const labelResults = await Promise.all(labelPromises);

    // 3. 收集标签名并去重
    const tagSet = new Set<string>();
    labelResults.forEach(res => {
        if (res.data?.data?.topicLabelName) {
            tagSet.add(res.data.data.topicLabelName);
        }
    });

    return Array.from(tagSet);
};

export default function ListDisplay() {
    const useStore = useUserStore();
    // 分类
    const homeWorkComment = reactive<HomeWorkComment[]>([]);

    const state = reactive<State>({
        TaskList: [],
        pageSize: 10,
        pageNum: 1
    });

    // 获取作业分类列表
    const getHomeworkComment = async () => {
        let data = {
            courseId: useStore.selectClass.courseId,
            pageSize: 1000,
            pageNum: 1
        }
        try {
            const res = await taskCategoryListAPI(data)
            if (res.data.code == 200) {
                const categories = res.data.rows;
                homeWorkComment.length = 0; // 清空现有数据
                categories.forEach((item: any) => {
                    homeWorkComment.push({
                        courseId: item.courseId,
                        homeworkContentId: item.homeworkContentId,
                        homeworkContentName: item.homeworkContentName,
                        spreadIndex: false
                    });
                });

                console.log('作业分类列表:', homeWorkComment);
            }
        } catch (error) {
            console.log('获取作业分类列表失败:', error);
        }
    }
    // 获取作业列表
    const getTaskList = async () => {
        try {
            const res = await taskListAPI();
            if (res.data.code == 200) {
                // 这里建议后端返回的字段名和 HomeworkTask 保持一致
                state.TaskList = res.data.rows as HomeworkTask[];
            } else {
                console.error('API 返回的数据不是数组:', res.data.rows);
            }
        } catch (error) {
            console.error('获取作业列表失败:', error);
        }
    };

    // 分页
    const handleSizeChange = (val: number) => {
        state.pageSize = val;
    };
    const handleCurrentChange = (val: number) => {
        state.pageNum = val;
        window.scrollTo(0, 0);
    };

    // 作业状态筛选（如有 PublishStatus 字段可加筛选）
    const selectedType = ref("");
    const FilterStatus = computed(() => {
        return state.TaskList.filter(item => {
            if (selectedType.value === "") {
                return true;
            } else {
                // 这里如有发布状态字段可筛选
                // return item.PublishStatus === Number(selectedType.value);
                return true;
            }
        });
    });

    // 当前页显示的作业
    const displayedTasks = computed(() => {
        const start = (state.pageNum - 1) * state.pageSize;
        const end = start + state.pageSize;
        return FilterStatus.value.slice(start, end);
    });

    return {
        homeWorkComment,
        state,
        handleSizeChange,
        getHomeworkComment,
        getTaskList,
        handleCurrentChange,
        selectedType,
        FilterStatus,
        displayedTasks
    };
}