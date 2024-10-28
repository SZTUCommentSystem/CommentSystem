import { ref } from 'vue';

interface Task {
    id: number;
    title: string;
    tags: string[];
    teacher: string;
    selectedQuestion: number[];
    PublishStatus: number;
    IsDropList: boolean;
}

const PubList = () => {
    // 发布作业
    const pubDialogVisible = ref(false);
    const pubTaskId = ref(0);

    const confirmPubTask = (id: number) => {
        pubTaskId.value = id;
        pubDialogVisible.value = true;
    };

    const publishTask = (TaskList: Task[]) => {
        TaskList.forEach((item) => {
            if (item.id === pubTaskId.value) {
                item.PublishStatus = 1;
            }
        });
        pubDialogVisible.value = false;

        return TaskList;
    };

    return { pubDialogVisible, pubTaskId, confirmPubTask, publishTask };
}


const DelList = () => {
    // 删除作业
    const delDialogVisible = ref(false)
    const delTaskId = ref(0)
    const confirmDelTask = (id: number) => {
        delTaskId.value = id;
        delDialogVisible.value = true
    }
    const deleteTask = (TaskList: Task[]) => {
        TaskList = TaskList.filter((item) => item.id !== delTaskId.value);
        delDialogVisible.value = false
        return TaskList
    }

    return { delDialogVisible, delTaskId, confirmDelTask, deleteTask }
}

export { PubList, DelList }