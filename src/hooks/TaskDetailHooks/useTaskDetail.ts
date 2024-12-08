import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { TaskDetailAPI } from '@/api/TaskAPI/TaskQuestionList';
import dayjs from 'dayjs';

export function useTaskDetail() {
    // 获取传参
    const route = useRoute()

    // 作业内容
    interface TaskDetail {
        title: string;
        description: string;
        selectedQuestion: number[];
        DeadLine: [string, string];
    }

    const taskDetail = reactive<TaskDetail>({
        title: '',
        description: '',
        selectedQuestion: [],
        DeadLine: ['', ''] as [string, string],
    })
    const getTaskDetail = async () => {
        const res = await TaskDetailAPI(Number(route.query.id))
        const data = res.data.data;
        Object.assign(taskDetail, data);

        taskDetail.DeadLine = [
            dayjs(data.DeadLine[0]).format('YYYY-MM-DD HH:mm:ss'),
            dayjs(data.DeadLine[1]).format('YYYY-MM-DD HH:mm:ss')
        ];
        console.log(taskDetail);
    }

    return {
        taskDetail,
        getTaskDetail
    }
}