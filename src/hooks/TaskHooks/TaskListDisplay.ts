import { ref, reactive, computed, onMounted } from "vue";
// 获取作业列表
import { TaskListAPI } from "@/api/TaskAPI/TaskQuestionList";

export default function ListDisplay() {
    interface Task {
        id: number;
        title: string;
        tags: string[];
        teacher: string;
        selectedQuestion: number[];
        PublishStatus: number;
        IsDropList: boolean;
        DeadLine: string;
    }

    const state = reactive({
        TaskList: [] as Task[],
        pageSize: 10,
        pageNum: 1
    });

    // 获取作业列表
    const getTaskList = async () => {
        try {
            const res = await TaskListAPI();
            if (Array.isArray(res.data.data)) {
                state.TaskList = res.data.data;
            } else {
                console.error('API 返回的数据不是数组:', res.data.data);
            }
        } catch (error) {
            console.error('获取作业列表失败:', error);
        }
    }

    //列表展示
    const handleSizeChange = (val: number) => {
        state.pageSize = val
    }
    const handleCurrentChange = (val: number) => {
        state.pageNum = val
        window.scrollTo(0, 0)
    }

    //选择作业状态
    const selectedType = ref("");
    const FilterStatus = computed(() => {
        return state.TaskList.filter(item => {
            if (selectedType.value === "") {
                return true;
            } else {
                return item.PublishStatus === Number(selectedType.value);
            }
        });
    })

    // 根据当前页码和每页显示数量计算当前显示的章节列表
    const displayedTasks = computed(() => {
        const start = (state.pageNum - 1) * state.pageSize;
        const end = start + state.pageSize;
        return FilterStatus.value.slice(start, end);
    });
    return { state, handleSizeChange, getTaskList, handleCurrentChange, selectedType, FilterStatus, displayedTasks }
}