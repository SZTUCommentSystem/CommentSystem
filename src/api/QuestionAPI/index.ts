import request from "@/utils/https";

// 获取问题列表
export const questionListAPI = () => {
    return request({
        url: 'function/topic/list',
        method: "get",
    })
}

// 新增问题
export const addQuestionAPI = (data: Object) => {
    return request({
        url: 'function/topic',
        method: "post",
        data
    })
}

// 获取问题详情
export const questionDetailAPI = (id: number) => {
    return request({
        url: `function/topic/${id}`,
        method: "get",
    })
}

// 更新问题
export const updateQuestionAPI = (data: Object) => {
    return request({
        url: 'function/topic',
        method: "put",
        data
    })
}

// 删除问题
export const deleteQuestionAPI = (id: number) => {
    return request({
        url: `function/topic/${id}`,
        method: "get",
    })
}

// 获取问题类型列表
export const questionTypeAPI = () => {
    return request({
        url: 'function/topictype/list',
        method: "get",
    })
}

// 获取单个问题类型
export const questionTypeDetailAPI = (id: number) => {
    return request({
        url: `function/topictype/${id}`,
        method: "get",
    })
}