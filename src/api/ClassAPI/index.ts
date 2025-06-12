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

// 获取学生列表
export const studentListAPI = (classId: number) => {
    return request({
        url: `function/student/list`,
        method: "get",
        params: { classId }
    })
}