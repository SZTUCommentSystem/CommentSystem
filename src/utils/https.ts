import axios from 'axios';
import router from '../router';
import { useUserStore } from '../store/user';

const userStore = useUserStore();

const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        let token = userStore.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401 || data?.code === 'NOT_LOGIN') {
                userStore.clearUser();
                router.push('/login');
            } else {
                console.error(data?.message || '请求失败');
            }
        }
        return Promise.reject(error);
    }
)

export default request;