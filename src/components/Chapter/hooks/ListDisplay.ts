import { reactive, computed } from "vue";

export default function ListDisplay() {
    const state = reactive({
        ChapterList: [
            {
                id: 1,
                title: "Chapter 1",
                description: "This is Chapter 1",
            },
            {
                id: 2,
                title: "Chapter 2",
                description: "This is Chapter 2",
            },
            {
                id: 3,
                title: "Chapter 3",
                description: "This is Chapter 3",
            },
            {
                id: 3,
                title: "Chapter 3",
                description: "This is Chapter 3",
            },
            {
                id: 3,
                title: "Chapter 3",
                description: "This is Chapter 3",
            },

        ],
        pageSize: 4,
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
    const displayedChapters = computed(() => {
        const start = (state.pageNum - 1) * state.pageSize;
        const end = start + state.pageSize;
        return state.ChapterList.slice(start, end);
    });

    return { state, handleSizeChange, handleCurrentChange, displayedChapters }
}