import request from "@/utils/https";

// 获取作业列表
export const TaskListAPI = () => {
    return request({
        url: '/home/taskList',
        method: 'get'
    })
}

// 根据上传id获取作业详情
export const TaskDetailAPI = (id: number) => {
    return request({
        url: '/home/taskDetail',
        method: 'get',
        params: {
            id
        }
    })
}

// 获取作业题目列表
export const TaskQuestionListAPI = (ids: number[]) => {
    return request({
        url: '/home/taskQuestionList',
        method: 'post',
        data: {
            ids
        }
    })
}

// 提交作业
export const SubmitTaskAPI = (data: Object) => {
    return request({
        url: '/home/submitTask',
        method: 'post',
        data: data
    })
}