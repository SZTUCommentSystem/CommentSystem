import request from "@/utils/https";

// 获取标签列表
export const labelListAPI = (data: any) => {
    return request({
        url: 'function/topiclabel/list',
        method: "get",
        data
    })
}

// 新增标签
export const addLabelAPI = (data: any) => {
    return request({
        url: 'function/topiclabel',
        method: "post",
        data
    })
}

// 修改标签
export const changeLabelAPI = (data: any) => {
    return request({
        url: 'function/topiclabel',
        method: "put",
        data
    })
}

// 删除标签
export const deleteLabelAPI = (id: number) => {
    return request({
        url: `function/topiclabel/${id}`,
        method: 'delete'
    })
}