import { ref } from 'vue'
import type { HomeworkTask } from './TaskListDisplay' // 导入你的主类型

const PubList = () => {
    const pubDialogVisible = ref(false)
    const pubTaskId = ref(0)

    const confirmPubTask = (id: number) => {
        pubTaskId.value = id
        pubDialogVisible.value = true
    }

    const publishTask = (TaskList: HomeworkTask[]) => {
        TaskList.forEach((item) => {
            if (item.homeworkId === pubTaskId.value) {
                // 你可以加上 PublishStatus 字段到 HomeworkTask 类型
                (item as any).PublishStatus = 1
            }
        })
        pubDialogVisible.value = false
        return TaskList
    }

    return { pubDialogVisible, pubTaskId, confirmPubTask, publishTask }
}

const EndList = () => {
    const endDialogVisible = ref(false)
    const endTaskId = ref(0)

    const confirmEndTask = (id: number) => {
        endTaskId.value = id
        endDialogVisible.value = true
    }

    const endTask = (TaskList: HomeworkTask[]) => {
        TaskList.forEach((item) => {
            if (item.homeworkId === endTaskId.value) {
                (item as any).PublishStatus = 2
            }
        })
        endDialogVisible.value = false
        return TaskList
    }

    return { endDialogVisible, endTaskId, confirmEndTask, endTask }
}

const DelList = () => {
    const delDialogVisible = ref(false)
    const delTaskId = ref(0)
    const confirmDelTask = (id: number) => {
        delTaskId.value = id
        delDialogVisible.value = true
    }
    const deleteTask = (TaskList: HomeworkTask[]) => {
        TaskList = TaskList.filter((item) => item.homeworkId !== delTaskId.value)
        delDialogVisible.value = false
        return TaskList
    }

    return { delDialogVisible, delTaskId, confirmDelTask, deleteTask }
}

export { PubList, EndList, DelList }