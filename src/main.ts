import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Cookies from 'js-cookie'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 导入Bootstrap的CSS文件
import 'bootstrap/dist/css/bootstrap.min.css'
// 导入Bootstrap的JS文件
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 引入 Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/index.css';


import App from './App.vue'
import router from './router'
import { useUserStore } from './store/user';

const app = createApp(App)

// 引入pinia实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 使用持久化插件
app.use(pinia)
// 恢复 token
const userStore = useUserStore();
const token = Cookies.get('token'); // 从 Cookie 中获取 token

if (token) {
    userStore.setToken(token); // 恢复 token
}


app.use(router)
app.use(ElementPlus)

app.mount('#app')
