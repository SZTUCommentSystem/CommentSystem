import request from "@/utils/https";

export const loginAPI = (data: { username: string, password: string }) => {
    return request({
        url: '/user/login',
        method: "post",
        data
    })
}