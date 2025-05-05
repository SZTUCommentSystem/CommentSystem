import request from "@/utils/https";

// 获取课程列表
export const getCourseListAPI = () => {
    return request({
        url: 'function/course/list',
        method: 'get'
    })
}

// 获取课程细节
export const getCourseDetailAPI = (id: number) => {
    return request({
        url: `function/course/${id}`,
        method: 'get',
    })
}

// 新增课程
export const addCourseAPI = (params: object) => {
    return request({
        url: 'function/course',
        method: 'post',
        params
    })
}

// 修改课程
export const changeCourseAPI = (params: object) => {
    return request({
        url: 'function/course',
        method: 'put',
        params
    })
}

// 删除课程
export const deleteCourseAPI = (id: number) => {
    return request({
        url: `function/course/${id}`,
        method: 'delete',
    })
}
