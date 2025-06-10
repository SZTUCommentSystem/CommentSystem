import axios from 'axios';
import router from '../router';
import { useUserStore } from '../store/user';
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'

const userStore = useUserStore();

const request = axios.create({
    baseURL: '/api',
    timeout: 50000
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
            const { data } = error.response;
            console.error('请求错误:', error.response);

            if (data?.code === 401) {
                userStore.clearUser();
                Cookies.remove('token');
                ElMessage.warning('登录已过期，请重新登录');
                if (router.currentRoute.value.name !== 'login') {
                    router.push('/login');
                }
            } else {
                ElMessage.error(data?.message || '请求失败');
            }
        }
        return Promise.reject(error);
    }
)

export default request;