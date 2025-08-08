import request from "@/utils/https";

// 获取问题列表
export const questionListAPI = (data: Object) => {
    return request({
        url: 'function/topic/list',
        method: "get",
        params: data
    })
}

// 获取问题详情
export const questionDetailAPI = (id: number) => {
    return request({
        url: `function/topic/${id}`,
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

// 更新问题
export const changeQuestionAPI = (data: Object) => {
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
        method: "delete",
    })
}

// 获取问题类型列表
export const questionTypeAPI = (data: Object) => {
    return request({
        url: 'function/topictype/list',
        method: "get",
        data
    })
}

// 获取单个问题类型
export const questionTypeDetailAPI = (id: number) => {
    return request({
        url: `function/topictype/${id}`,
        method: "get",
    })
}

// 新增问题类型
export const addQuestionTypeAPI = (data: Object) => {
    return request({
        url: 'function/topictype',
        method: "post",
        data
    })
}

// 更新问题类型
export const changeQuestionTypeAPI = (data: Object) => {
    return request({
        url: 'function/topictype',
        method: "put",
        data
    })
}

// 删除问题类型
export const deleteQuestionTypeAPI = (id: number) => {
    return request({
        url: `function/topictype/${id}`,
        method: "delete",
    })
}

// 获取题目对应的批语列表
export const questionCommentListAPI = (data: Object) => {
    return request({
        url: `function/topicComment/list`,
        method: "get",
        params: data
    })
}