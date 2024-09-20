import { reactive, computed } from "vue";

export default function ListDisplay() {
    const state = reactive({
        TaskList: [
            {
                id: 1,
                title: "Task 1",
                description: "This is Task 1",
                teacher: '胡某',
                IsDropList: false,
            },
            {
                id: 2,
                title: "Task 2",
                description: "This is Task 2",
                teacher: '张某',
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                IsDropList: false,
            },
        ],
        pageSize: 5,
        pageNum: 1
    });

    //列表展示
    const handleSizeChange = (val: number) => {
        state.pageSize = val
    }
    const handleCurrentChange = (val: number) => {
        state.pageNum = val
    }
    // 根据当前页码和每页显示数量计算当前显示的章节列表
    const displayedTasks = computed(() => {
        const start = (state.pageNum - 1) * state.pageSize;
        const end = start + state.pageSize;
        return state.TaskList.slice(start, end);
    });

    return { state, handleSizeChange, handleCurrentChange, displayedTasks }
}