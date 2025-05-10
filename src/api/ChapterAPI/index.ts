import request from "@/utils/https";

// 获取章节列表
export const getChapterListAPI = () => {
    return request({
        url: 'function/chapter/list',
        method: 'get'
    })
}

// 获取章节细节
export const getChapterDetailAPI = (id: number) => {
    return request({
        url: `function/chapter/${id}`,
        method: 'get',
    })
}

// 新增章节
export const addChapterAPI = (data: object) => {
    return request({
        url: 'function/chapter',
        method: 'post',
        data
    })
}

// 修改章节
export const changeChapterAPI = (data: object) => {
    return request({
        url: 'function/chapter',
        method: 'put',
        data
    })
}

// 删除章节
export const deleteChapterAPI = (id: number) => {
    return request({
        url: `function/chapter/${id}`,
        method: 'delete',
    })
}