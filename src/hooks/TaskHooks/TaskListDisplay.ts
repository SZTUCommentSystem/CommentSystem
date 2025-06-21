import { ref, reactive, computed } from "vue";
import { useUserStore } from "@/store/user";
import { taskListAPI, taskCategoryListAPI } from "@/api/TaskAPI";
import { questionDetailAPI } from "@/api/QuestionAPI";
import { labelInfoAPI } from "@/api/LabelAPI";

// 新的作业类型
export interface HomeworkTask {
    homeworkId: number;
    courseId: number;
    homeworkTitle: string;
    homeworkContentId: number;
    homeworkDescribe: string;
    topicIds: string;
    limitTime: string;
    classIds: string;
    userId: number;
    tags?: string[];
}

interface State {
    TaskList: HomeworkTask[];
}

interface HomeWorkComment {
    courseId: number;
    homeworkContentId: number;
    homeworkContentName: string;
    spreadIndex: boolean;
}

// 获取所有题目的标签（去重）
export const getTagsByQuestionIds = async (questionIds: number[]) => {
    const labelIdSet = new Set<number>();
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

    const labelIds = Array.from(labelIdSet);
    const labelPromises = labelIds.map(id => labelInfoAPI(id));
    const labelResults = await Promise.all(labelPromises);

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
    const homeWorkComment = reactive<HomeWorkComment[]>([]);

    const state = reactive<State>({
        TaskList: []
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
                homeWorkComment.length = 0;
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
            const res = await taskListAPI({});
            if (res.data.code == 200) {
                state.TaskList = res.data.rows as HomeworkTask[];
            } else {
                console.error('API 返回的数据不是数组:', res.data.rows);
            }
        } catch (error) {
            console.error('获取作业列表失败:', error);
        }
    };

    // 作业状态筛选（如有 PublishStatus 字段可加筛选）
    const selectedType = ref("");
    const FilterStatus = computed(() => {
        return state.TaskList.filter(item => {
            if (selectedType.value === "") {
                return true;
            } else {
                // 如有发布状态字段可筛选
                // return item.PublishStatus === Number(selectedType.value);
                return true;
            }
        });
    });

    return {
        homeWorkComment,
        state,
        getHomeworkComment,
        getTaskList,
        FilterStatus
    };
}