import request from "@/utils/https";

// 获取作业列表
export const taskListAPI = (data: any) => {
    return request({
        url: 'function/homework/list',
        method: 'get',
        params: data
    })
}

// 根据上传id获取作业详情
export const taskDetailAPI = (id: number) => {
    return request({
        url: `function/homework/${id}`,
        method: 'get',
    })
}

// 新增作业
export const addTaskAPI = (data: Object) => {
    return request({
        url: 'function/homework',
        method: 'post',
        data
    })
}

// 更新作业
export const changeTaskAPI = (data: Object) => {
    return request({
        url: `function/homework`,
        method: 'put',
        data
    })
}

// 删除作业
export const deleteTaskAPI = (id: number) => {
    return request({
        url: `function/homework/${id}`,
        method: 'delete',
    })
}

// 发布作业
export const pubTaskAPI = (data: any) => {
    return request({
        url: 'function/homework/release',
        method: 'get',
        data
    })
}

// 获取作业分类列表
export const taskCategoryListAPI = (data: object) => {
    return request({
        url: 'function/homeworkcontent/list',
        method: 'get',
        params: data
    })
}

// 新增作业分类
export const addTaskCategoryAPI = (data: Object) => {
    return request({
        url: 'function/homeworkcontent',
        method: 'post',
        data
    })
}

// 更新作业分类
export const changeTaskCategoryAPI = (data: Object) => {
    return request({
        url: `function/homeworkcontent`,
        method: 'put',
        data
    })
}

// 删除作业分类
export const deleteTaskCategoryAPI = (id: number) => {
    return request({
        url: `function/homeworkcontent/${id}`,
        method: 'delete',
    })
}