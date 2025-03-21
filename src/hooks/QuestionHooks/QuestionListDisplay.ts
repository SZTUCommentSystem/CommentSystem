import { reactive, computed } from "vue";
import { questionListAPI, deleteQuestionAPI } from '@/api/QuestionAPI/questionList';


export default function QuestionListDisplay() {
    const state = reactive({
        QuestionList: [],
        // 分页相关的状态
        currentPage: 1, // 当前页码
        pageSize: 20, // 每页显示的题目数量
        selectedType: '', // 选中的题目类型
        searchQuery: '', // 搜索关键词
        searchTag: '', // 搜索标签
    });

    const getList = async () => {
        try {
            const res = await questionListAPI();
            if (Array.isArray(res.data.data)) {
                state.QuestionList = res.data.data;
            } else {
                console.error('API 返回的数据不是数组:', res.data.data);
            }
        } catch (error) {
            console.error('获取题目列表失败:', error);
        }
    };

    // 删除题目
    const handleDel = async (event:any , id: number) => {
        // 阻止事件冒泡
        event.stopPropagation();
        // 调用删除题目的 API
        // 成功后，重新获取题目列表
        try {
            console.log(111);
            
            await deleteQuestionAPI(id);
            await getList();
        } catch (error) {
            console.error('删除题目失败:', error);
        }
    }

    // 过滤后的题目列表
    const filteredQuestions = computed(() => {
        if (!Array.isArray(state.QuestionList) || state.QuestionList.length === 0) {
            return [];
        }
        return state.QuestionList.filter((question: { type: string; title: string; tags: Array<string> }) => {
            const matchesType = state.selectedType ? question.type === state.selectedType : true;
            const matchesSearch = question.title.includes(state.searchQuery);
            const matchesTag = state.searchTag !== '' ? question.tags.includes(state.searchTag) : true;
            return matchesType && matchesSearch && matchesTag;
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
        handleDel,
        filteredQuestions,
        paginatedQuestions,
        handlePageChange,
        handlePageSizeChange
    }
}