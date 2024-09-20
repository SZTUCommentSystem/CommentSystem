import { ref } from 'vue'
export default function DelAndAddList(TaskList: { id: number, title: string, description: string, teacher: string }[]) {
    // 删除章节
    const delDialogVisible = ref(false)
    const delTaskId = ref(0)
    const confirmDelTask = (id: number) => {
        delTaskId.value = id;
        delDialogVisible.value = true
    }
    const deleteTask = () => {
        TaskList = TaskList.filter((item) => item.id !== delTaskId.value);
        delDialogVisible.value = false
        return TaskList
    }

    return { delDialogVisible, delTaskId, confirmDelTask, deleteTask }
}