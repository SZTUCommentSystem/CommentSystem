import axios from 'axios';

const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})

//axios拦截器
//暂定

export default request;