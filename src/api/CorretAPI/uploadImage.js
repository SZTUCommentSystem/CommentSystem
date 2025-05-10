import request from "@/utils/https";

// 上传文件
export const uploadFile = (formData) => {
    return request({
        url: '/upload',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}