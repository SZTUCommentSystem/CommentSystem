import request from "@/utils/https";

export const studentListAPI = () => {
    return request({
        url: '/home/studentList',
        method: 'get'
    })
}

export const studentInfoAPI = (id: number) => {
    return request({
        url: '/home/studentInfo',
        method: 'get',
        params: {
            id
        }
    })
}