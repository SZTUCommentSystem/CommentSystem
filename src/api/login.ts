import request from "@/utils/https";

// 登录
export const loginAPI = (params: object) => {
    return request({
        url: '/login',
        method: 'post',
        params
    })
}

// 注册
export const registerAPI = (params: object) => {
    return request({
        url: '/register',
        method: 'post',
        params
    })
}