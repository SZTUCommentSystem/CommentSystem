import { ref } from 'vue';

interface Task {
    id: number;
    title: string;
    tags: string[];
    teacher: string;
    selectedQuestion: number[];
    PublishStatus: number; // 0: 未发布 1: 已发布 2: 已截止
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

const EndList = () => {
    // 截止作业
    const endDialogVisible = ref(false);
    const endTaskId = ref(0);

    const confirmEndTask = (id: number) => {
        endTaskId.value = id;
        endDialogVisible.value = true;
    };

    const endTask = (TaskList: Task[]) => {
        TaskList.forEach((item) => {
            if (item.id === endTaskId.value) {
                item.PublishStatus = 2;
            }
        });
        endDialogVisible.value = false;

        return TaskList;
    }

    return { endDialogVisible, endTaskId, confirmEndTask, endTask }
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

export { PubList, EndList, DelList }