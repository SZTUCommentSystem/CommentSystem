import { ref, reactive, computed, watch } from "vue";
import { questionListAPI, deleteQuestionAPI, questionTypeAPI } from '../../api/QuestionAPI';
import { labelInfoAPI } from "@/api/LabelAPI";
import { ElMessage } from "element-plus";

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

    // 标签名缓存
    const topicLabelNameMap = ref<Record<number, string>>({});

    // 批量预取所有题目用到的标签名
    const prefetchAllLabelNames = async (questions: any[]) => {
        const allLabelIds = Array.from(
            new Set(
                questions.flatMap((q: any) =>
                    q.labelIds
                        ? q.labelIds.split(',').map(Number)
                        : []
                )
            )
        );
        for (const id of allLabelIds) {
            if (!topicLabelNameMap.value[id]) {
                fetchLabelName(id);
            }
        }
    };

    // 获取标签名
    const fetchLabelName = async (labelId: number) => {
        if (topicLabelNameMap.value[labelId]) {
            return topicLabelNameMap.value[labelId];
        }
        const res = await labelInfoAPI(labelId);
        if (res.data.data.topicLabelName) {
            topicLabelNameMap.value[labelId] = res.data.data.topicLabelName;
            return res.data.topicLabelName;
        }
        return labelId;
    };

    // 通过ID获取标签名
    const getLabelById = (id: number) => topicLabelNameMap.value[id] || id;

    // 获取题目类型列表
    const getTypeList = async () => {
        try {
            const res = await questionTypeAPI();
            if (res.data.code == 200) {
                questionTypeList.value = res.data.rows;
            }
        }
        catch (error) {
            console.error('获取题目类型列表失败:', error);
        }
    }

    // 获取题目列表并预取标签名
    const getList = async () => {
        try {
            const res = await questionListAPI();
            if (res.data.code == 200) {
                state.questionList = res.data.rows;
                await prefetchAllLabelNames(res.data.rows);
            }
        } catch (error) {
            console.error('获取题目列表失败:', error);
        }
    };

    // 删除题目
    const handleDel = async (event: any, id: number) => {
        event.stopPropagation();
        try {
            const res = await deleteQuestionAPI(id);
            if (res.data.code === 200) {
                ElMessage.success('删除题目成功');
                getList();
            }    
        } catch (error) {
            console.error('删除题目失败:', error);
        }
    }

    // 过滤后的题目列表
    const filteredQuestions = computed(() =>
        state.questionList.filter((question: any) => {
            // 题型过滤
            const matchesType = state.selectedType
                ? String(question.topicTypeId) === String(state.selectedType)
                : true;
            // 标题搜索
            const matchesSearch = question.topicTitle.includes(state.searchQuery);
            // 标签过滤（数字数组）
            const labelArr = question.labelIds
                ? question.labelIds.split(',').map(Number)
                : [];
            const matchesTag = state.searchTag
                ? labelArr.includes(Number(state.searchTag))
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
        topicLabelNameMap,
        getLabelById,
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