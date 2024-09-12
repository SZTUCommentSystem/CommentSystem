import axios from 'axios';
import { de } from 'element-plus/es/locales.mjs';

const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})

//axios拦截器
//暂定

export default request;