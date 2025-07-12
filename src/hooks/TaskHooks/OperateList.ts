import { ref } from 'vue'

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

export { PubList, DelList }