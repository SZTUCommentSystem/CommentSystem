import request from "@/utils/https";

// 登录
export const loginAPI = (data: object) => {
    return request({
        // url: '/user/login',
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

// 获取用户信息
export const getUserInfoAPI = () => {
    return request({
        url: '/getInfo',
        method: 'get'
    })
}

// 上传
export const uploadFileAPI = (file: FormData) => {
    return request({
        url: '/common/upload',
        method: 'post',
        data: file,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}