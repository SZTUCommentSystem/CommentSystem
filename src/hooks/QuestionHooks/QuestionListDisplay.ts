import { ref, reactive, computed, watch } from "vue";
import { questionListAPI, deleteQuestionAPI, questionTypeAPI } from '../../api/QuestionAPI';
import { labelInfoAPI } from "@/api/LabelAPI";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/store/user";

export default function QuestionListDisplay() {
    const state = reactive({
        questionList: [],
        // 分页相关的状态
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示的题目数量
        total: 0, // 题目总数
        selectedType: '', // 选中的题目类型
        searchQuery: '', // 搜索关键词
    });

    const questionTypeList = ref([]);
    const useStore = useUserStore();

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
            const res = await questionTypeAPI({pageSize: 9999});
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
        let data = {
            pageNum: state.currentPage,
            pageSize: state.pageSize,
            courseId: useStore.selectClass.courseId,
            topicTypeId: state.selectedType,
            topicTitle: state.searchQuery,
        }
        try {
            const res = await questionListAPI(data);
            if (res.data.code == 200) {
                state.questionList = res.data.rows;
                state.total = res.data.total;
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
            await ElMessageBox.confirm(
                '此操作将永久删除该题目, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            );

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
            return matchesType && matchesSearch;
        })
    );

    let timer:any = null;
    // 监听筛选条件变化，重置页码
    watch(
        () => [state.selectedType, state.searchQuery, state.currentPage, state.pageSize],
        () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                state.currentPage = 1; // 重置页码
                getList(); // 重新获取题目列表
            }, 400);
        }
    );

    // 计算当前页显示的题目（基于过滤后的题目）
    const paginatedQuestions = computed(() => state.questionList);

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