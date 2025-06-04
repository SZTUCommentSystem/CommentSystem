import { ref, reactive, computed, watch } from "vue";
import { questionListAPI, deleteQuestionAPI, questionTypeAPI } from '../../api/QuestionAPI';


export default function QuestionListDisplay() {
    const state = reactive({
        questionList: [],
        // 分页相关的状态
        currentPage: 1, // 当前页码
        pageSize: 20, // 每页显示的题目数量
        selectedType: '', // 选中的题目类型
        searchQuery: '', // 搜索关键词
        searchTag: '', // 搜索标签
    });

    const questionTypeList = ref([]);

    const getList = async () => {
        try {
            const res = await questionListAPI();
            if (res.data.code == 200) {
                state.questionList = res.data.rows;
                console.log('获取题目列表成功:', state.questionList);
            } else {
                console.error('API 返回的数据不是数组:', res.data.data);
            }
        } catch (error) {
            console.error('获取题目列表失败:', error);
        }
    };

    const getTypeList = async () => {
        try {
            const res = await questionTypeAPI();
            if (res.data.code == 200) {
                questionTypeList.value = res.data.rows;
                console.log('获取题目类型列表成功:', questionTypeList.value);
            } else {
                console.error('API 返回的数据不是数组:', res.data.rows);
            }
        }
        catch (error) {
            console.error('获取题目类型列表失败:', error);
        }
    }

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
    const filteredQuestions = computed(() =>
        state.questionList.filter((question: any) => {
            const matchesType = state.selectedType ? question.type === state.selectedType : true;
            const matchesSearch = question.topicTitle.includes(state.searchQuery);
            const labelArr = question.labelIds ? question.labelIds.split(',') : [];
            const matchesTag = state.searchTag !== ''
                ? labelArr.includes(state.searchTag)
                : true;
            return matchesType && matchesSearch && matchesTag;
        })
    );

    // 监听筛选条件变化，重置页码
    watch(
        () => [state.selectedType, state.searchQuery, state.searchTag],
        () => {
            state.currentPage = 1;
        }
    );

    // 计算当前页显示的题目（基于过滤后的题目）
    const paginatedQuestions = computed(() => {
        const total = filteredQuestions.value.length;
        const maxPage = Math.max(1, Math.ceil(total / state.pageSize));
        // 如果当前页码超出最大页码，自动修正
        if (state.currentPage > maxPage) {
            state.currentPage = maxPage;
        }
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
        state.currentPage = 1;
    };

    return {
        state,
        questionTypeList,
        getList,
        getTypeList,
        handleDel,
        filteredQuestions,
        paginatedQuestions,
        handlePageChange,
        handlePageSizeChange
    }
}