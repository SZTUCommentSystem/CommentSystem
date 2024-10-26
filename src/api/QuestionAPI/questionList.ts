import request from "@/utils/https";

export const questionListAPI = () => {
    return request({
        url: '/home/questionList',
        method: "get",
    })
}

export const submitQuestionAPI = (data: Object) => {
    return request({
        url: '/home/submitQuestion',
        method: "post",
        data
    })
}

export const questionDetailAPI = (id: number) => {
    return request({
        url: '/home/questionDetail',
        method: "get",
        params: { id }
    })
}