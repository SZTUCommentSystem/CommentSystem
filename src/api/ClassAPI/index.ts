import request from "@/utils/https";

// 获取班级列表
export const classListAPI = () => {
    return request({
        url: 'function/bclass/list',
        method: "get",
    })
}

// 获取班级详情
export const classDetailAPI = (classId: string) => {
    return request({
        url: `function/bclass/${classId}`,
        method: "get",
    })
}