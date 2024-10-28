//用于模拟作业列表数据

function TaskList() {
    return [
        {
            id: 1,
            title: "Task 1",
            tags: ["标签1", "标签2"],
            teacher: '胡某',
            selectedQuestion: [1, 3],
            PublishStatus: 2, //0代表未发布，1代表已发布，2代表已结束
            IsDropList: false,
            DeadLine: ['2023-01-01 00:00:00', '2023-01-02 00:00:00']
        },
        {
            id: 2,
            title: "Task 2",
            tags: ["标签1", "标签2", "标签3"],
            teacher: '张某',
            selectedQuestion: [2],
            PublishStatus: 1,
            IsDropList: false,
            DeadLine: ['2023-01-03 00:00:00', '2023-01-04 00:00:00']
        },
        {
            id: 3,
            title: "Task 3",
            tags: ["标签1"],
            teacher: '冯某',
            selectedQuestion: [1, 2, 3],
            PublishStatus: 0,
            IsDropList: false,
            DeadLine: ['2023-01-05 00:00:00', '2023-01-06 00:00:00']
        },
    ]
}

export default [
    {
        url: '/api/home/taskList',
        type: 'get',
        response: config => {
            return {
                code: 200,
                data: TaskList(),
                message: 'success'
            }
        }
    },
    {
        url: '/api/home/taskDetail',
        type: 'get',
        response: (config: { query: { id: number; }; }) => {
            const { id } = config.query;
            const taskList = TaskList();
            const task = taskList.find(item => item.id == id);
            return {
                code: 200,
                data: task,
                message: 'success'
            }
        }
    }
]