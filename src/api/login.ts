import request from "@/utils/https";

// 登录
export const loginAPI = (data: object) => {
    return request({
        url: '/login',
        method: 'post',
        data
    })
}

// 注册
export const registerAPI = (data: object) => {
    return request({
        url: '/register',
        method: 'post',
        data
    })
}