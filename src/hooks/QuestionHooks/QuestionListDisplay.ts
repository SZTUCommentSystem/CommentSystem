import { reactive, computed } from "vue";
import { questionListAPI } from '@/api/QuestionAPI/questionList';


export default function QuestionListDisplay() {
    const state = reactive({
        QuestionList: [],
        // 分页相关的状态
        currentPage: 1, // 当前页码
        pageSize: 20, // 每页显示的题目数量
        selectedType: '', // 选中的题目类型
        searchQuery: '', // 搜索关键词
    });

    const getList = async () => {
        try {
            const res = await questionListAPI();
            console.log('API 返回的数据:', res.data.data); // 调试信息
            if (Array.isArray(res.data.data)) {
                state.QuestionList = res.data.data;
            } else {
                console.error('API 返回的数据不是数组:', res.data.data);
            }
        } catch (error) {
            console.error('获取题目列表失败:', error);
        }
    };

    // 过滤后的题目列表
    const filteredQuestions = computed(() => {
        if (!Array.isArray(state.QuestionList) || state.QuestionList.length === 0) {
            return [];
        }
        return state.QuestionList.filter((question: { type: string; title: string }) => {
            const matchesType = state.selectedType ? question.type === state.selectedType : true;
            const matchesSearch = question.title.includes(state.searchQuery);
            return matchesType && matchesSearch;
        });
    });

    // 计算当前页显示的题目（基于过滤后的题目）
    const paginatedQuestions = computed(() => {
        const start = (state.currentPage - 1) * state.pageSize;
        const end = start + state.pageSize;
        return filteredQuestions.value.slice(start, end);
    });

    // 处理分页变化
    const handlePageChange = (page: number) => {
        state.currentPage = page;
    };

    const handlePageSizeChange = (size: number) => {
        state.pageSize = size;
    };

    return {
        state,
        getList,
        filteredQuestions,
        paginatedQuestions,
        handlePageChange,
        handlePageSizeChange
    }
}