import request from "@/utils/https";

// 获取班级列表
export const classListAPI = () => {
    return request({
        url: 'function/bclass/list',
        method: "get",
    })
}

// 获取班级详情
export const classDetailAPI = (classId: number) => {
    return request({
        url: `function/bclass/${classId}`,
        method: "get",
    })
}

// 新建班级
export const addClassAPI = (data: any) => {
    return request({
        url: 'function/bclass',
        method: 'post',
        data
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

// 查询学生作业详细信息
export const studentTaskInfoAPI = (data: any) => {
    return request({
        url: 'function/homeworkstudent/list',
        method: "get",
        params: data
    })
}

// 获取学生提交的作业信息
export const submitStudentTaskAPI = (data: any) => {
    return request({
        url: `function/topicstudent/list`,
        method: 'get',
        params: data
    })
}

// 批改后提交学生返回情况
export const submitCorretTaskAPI = (data: any) => {
    return request({
        url: 'function/topicstudent',
        method: 'put',
        data
    })
}