import { ref, reactive, computed } from "vue";

export default function ListDisplay() {
    const state = reactive({
        TaskList: [
            {
                id: 1,
                title: "Task 1",
                description: "This is Task 1",
                teacher: '胡某',
                PublishStatus: 2, //0代表未发布，1代表已发布，2代表已结束
                IsDropList: false,
            },
            {
                id: 2,
                title: "Task 2",
                description: "This is Task 2",
                teacher: '张某',
                PublishStatus: 1,
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                PublishStatus: 0,
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                PublishStatus: 0,
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                PublishStatus: 0,
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                PublishStatus: 0,
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                PublishStatus: 0,
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                PublishStatus: 0,
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                PublishStatus: 0,
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                PublishStatus: 0,
                IsDropList: false,
            },
            {
                id: 3,
                title: "Task 3",
                description: "This is Task 3",
                teacher: '冯某',
                PublishStatus: 0,
                IsDropList: false,
            },
        ],
        pageSize: 10,
        pageNum: 1
    });

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
    return { state, handleSizeChange, handleCurrentChange, selectedType, FilterStatus, displayedTasks }
}