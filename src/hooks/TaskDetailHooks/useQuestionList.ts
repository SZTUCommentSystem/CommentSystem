import { reactive, ref, watch, computed } from 'vue'
import { questionListAPI } from '../../api/QuestionAPI'
import { TaskQuestionListAPI } from '@/api/TaskAPI/TaskQuestionList';

// 根据题目id获取题目列表
export interface Problem {
    id: number;
    title: string;
    type: string;
    tags: string[];
}

// 展示可选择的题目
export interface Question {
    id: number;
    title: string;
    type: string;
    tags: string[];
}

export function useQuestionList(taskDetail: any) {

    // 绑定的搜索题目、搜索tag、选择题目类型
    const search = reactive({
        searchQuestion: '',
        searchTag: '',
        searchType: ''
    })

    const problems = ref<Problem[]>([])
    const tags = ref<string[]>([])
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

    const questionList = ref<Question[]>([]);
    // 获取题目列表
    const getQuestionList = async () => {
        const res = await questionListAPI();
        questionList.value = res.data.data;
    };
    // 动态创建可选择数组
    const dynamicArray = ref<{ questionId: number; checked: boolean }[]>([]);
    watch(questionList, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            // 根据 problems 列表的长度动态创建一个数组
            dynamicArray.value = new Array(newVal.length).fill(null).map((_, index) => {
                const checked = taskDetail.selectedQuestion.includes(questionList.value[index].id);
                return { questionId: questionList.value[index].id, checked: checked };
            });
        }
    });

    // 计算过滤后的题目列表
    const filteredQuestionList = computed(() => {
        return questionList.value.filter((question) => {
            const matchesQuestion = search.searchQuestion === '' || question.title.includes(search.searchQuestion);
            const matchesTag = search.searchTag === '' || question.tags.includes(search.searchTag);
            const matchesType = search.searchType === '' || question.type === search.searchType;
            return matchesQuestion && matchesTag && matchesType;
        });
    });

    // 选择题目相关
    const selDialogVisible = ref(false);
    const selectProblem = () => {
        taskDetail.selectedQuestion = dynamicArray.value
            .filter((item) => item.checked)
            .map((item) => item.questionId);
        problems.value = dynamicArray.value
            .filter((item) => item.checked)
            .map((item) => filteredQuestionList.value.find(q => q.id === item.questionId))
            .filter((item): item is Problem => item !== undefined);
        selDialogVisible.value = false;
        console.log(taskDetail);
    };

    return {
        search,
        problems,
        tags,
        getTaskQuestionList,
        filteredQuestionList,
        getQuestionList,
        dynamicArray,
        selDialogVisible,
        selectProblem
    }
}