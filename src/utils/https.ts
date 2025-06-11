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
        const { data } = response;
        if (data?.code === 401) {
            userStore.clearUser();
            Cookies.remove('token');
            if (router.currentRoute.value.name !== 'login') {
                router.push('/login');
            }
        }
        return response;
    },
)

export default request;