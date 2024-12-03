<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { loginAPI } from '@/api/login';
import { useRouter } from 'vue-router'

const router = useRouter()

interface RuleForm {
    username: string
    password: string
}

const ruleFormRef = ref<FormInstance>()
const ruleFrom = reactive<RuleForm>({
    username: '',
    password: ''
})

const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const res = await loginAPI(ruleFrom)
            if (res.data.code === 200) {
                console.log('登录成功');
                ElMessage.success('登录成功');
                // 保存登录状态
                localStorage.setItem('isLogin', 'true');
                localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                // 等待1秒后跳转到首页，并在首页刷新页面
                setTimeout(() => {
                    router.push({ path: '/home/homepage' })
                    location.reload()
                }, 1000)
            } else {
                console.log('登录失败');
                ElMessage.error('登录失败，账号或密码错误');
            }

        } else {
            console.log('error submit!', fields)
        }
    })
}

// 检查登录状态
if (localStorage.getItem('isLogin') === 'true') {
    router.push({ path: '/home/homepage' })
}

</script>

<template>
    <div class="backgrounds">
        <div class="login-box">
            <el-form :model="ruleFrom" :rules="rules" ref="ruleFormRef" label-width="80px" class="form-class">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="ruleFrom.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleFrom.password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
                    <el-button type="success">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped>
.backgrounds {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* 图片背景充满整个屏幕并保持比例 */
    background: url('@/assets/登录背景.png') no-repeat center center;
    background-size: cover;
    z-index: -1;
}

.login-box {
    position: absolute;
    top: 40%;
    right: 10%;
    width: 500px;
    height: 250px;
    padding-right: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.form-class {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 50px;
}
</style>