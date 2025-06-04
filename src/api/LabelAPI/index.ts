import request from "@/utils/https";

// 获取标签列表
export const labelListAPI = () => {
    return request({
        url: 'function/topiclabel/list',
        method: "get",
    })
}