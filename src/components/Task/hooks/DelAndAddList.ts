import { ref, reactive } from 'vue'
export default function DelAndAddList(TaskList: { id: number, title: string, description: string }[]) {
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
    // 添加新章节
    const addDialogVisible = ref(false)
    const newTask = reactive({
        title: "",
        description: ""
    })
    const addTask = () => {
        const Task = {
            id: TaskList[TaskList.length - 1].id + 1,
            title: newTask.title,
            description: newTask.description
        }
        TaskList.push(Task);
        addDialogVisible.value = false
        return TaskList
    }

    return { delDialogVisible, delTaskId, confirmDelTask, deleteTask, addDialogVisible, newTask, addTask }
}