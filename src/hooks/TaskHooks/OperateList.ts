import { ref } from 'vue'
import type { HomeworkTask } from './TaskListDisplay'

// 发布作业
const PubList = () => {
    const pubDialogVisible = ref(false)
    const pubTaskId = ref(0)

    const confirmPubTask = (id: number) => {
        pubTaskId.value = id
        pubDialogVisible.value = true
    }

    return { pubDialogVisible, pubTaskId, confirmPubTask }
}

// 截止作业
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

// 
const DelList = () => {
    const delDialogVisible = ref(false)
    const delTaskId = ref(0)
    const confirmDelTask = (id: number) => {
        delTaskId.value = id
        delDialogVisible.value = true
    }

    return { delDialogVisible, delTaskId, confirmDelTask }
}

export { PubList, EndList, DelList }