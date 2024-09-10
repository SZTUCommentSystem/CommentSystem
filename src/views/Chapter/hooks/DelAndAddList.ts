import { ref, reactive } from 'vue'
export default function DelAndAddList(ChapterList: { id: number, title: string, description: string }[]) {
    // 删除章节
    const delDialogVisible = ref(false)
    const delChapterId = ref(0)
    const confirmDelChapter = (id: number) => {
        delChapterId.value = id;
        delDialogVisible.value = true
    }
    const deleteChapter = () => {
        ChapterList = ChapterList.filter((item) => item.id !== delChapterId.value);
        delDialogVisible.value = false
        return ChapterList
    }
    // 添加新章节
    const addDialogVisible = ref(false)
    const newChapter = reactive({
        title: "",
        description: ""
    })
    const addChapter = () => {
        const Chapter = {
            id: ChapterList[ChapterList.length - 1].id + 1,
            title: newChapter.title,
            description: newChapter.description
        }
        ChapterList.push(Chapter)
        addDialogVisible.value = false
        return ChapterList
    }

    return { delDialogVisible, delChapterId, confirmDelChapter, deleteChapter, addDialogVisible, newChapter, addChapter }
}