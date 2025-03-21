import axios from 'axios';
import router from '../router';

const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})

//axios拦截器
// 前端示例（Axios）
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.data?.code === 'NOT_LOGIN') {
            router.push('/login') // 跳转登录页
        }
        return Promise.reject(error)
    }
)
//暂定

export default request;