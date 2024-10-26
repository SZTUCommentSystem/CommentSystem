import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

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

const app = createApp(App)


app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
