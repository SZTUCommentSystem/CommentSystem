import { ref } from 'vue'

function PubList(TaskList: { id: number, title: string, tags: Array<string>, teacher: string, PublishStatus: number, IsDropList: boolean }[]) {
    // 发布章节
    const pubDialogVisible = ref(false)
    const pubTaskId = ref(0)
    const confirmPubTask = (id: number) => {
        pubTaskId.value = id;
        pubDialogVisible.value = true
    }
    const publishTask = () => {
        TaskList.forEach((item) => {
            if (item.id === pubTaskId.value) {
                item.PublishStatus = 1
            }
        });
        pubDialogVisible.value = false
        return TaskList
    }

    return { pubDialogVisible, pubTaskId, confirmPubTask, publishTask }
}

function DelList(TaskList: { id: number, title: string, tags: Array<string>, teacher: string, PublishStatus: number, IsDropList: boolean }[]) {
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

export { PubList, DelList }