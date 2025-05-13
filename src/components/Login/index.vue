<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { loginAPI, registerAPI,getUserInfoAPI } from '@/api/login';
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'

const router = useRouter()
const userStore = useUserStore()

// 登录或注册
const loginOrRegister = ref(true);

// 登录
interface RuleForm {
    username: string
    password: string
    confirmPassword?: string
}

const ruleFormRef = ref<FormInstance>()
const ruleFrom = reactive<RuleForm>({
    username: '',
    password: '',
    confirmPassword: ''
})

const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: !loginOrRegister.value, message: '请确认密码', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            if (value !== ruleFrom.password) {
                callback(new Error('两次输入的密码不一致'))
            } else {
                callback()
            }
        }, trigger: ['blur', 'change'] }
    ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            // 登录
            if (loginOrRegister.value) {
                const loginSuccess = await handleLogin()
                if (loginSuccess) {
                    await fetchUserInfo()
                    setTimeout(() => {
                        router.push({ path: '/home/homepage' })
                    }, 1000)
                }
            }
            // 注册
            else {
                const registerSuccess = await handleRegister()
                if (registerSuccess) {
                    await fetchUserInfo()
                    setTimeout(() => {
                        router.push({ path: '/home/homepage' })
                    }, 1000)
                }
            }

        } else {
            console.log('error submit!', fields)
        }
    })
}

// 登录
const handleLogin = async () => {
    const res = await loginAPI(ruleFrom);
    if (res.data.code === 200) {
        console.log('登录成功');
        ElMessage.success('登录成功');
        userStore.setToken(res.data.token); // 保存 token
        return true; // 登录成功
    } else {
        console.log('登录失败');
        ElMessage.error('登录失败，账号或密码错误');
        return false; // 登录失败
    }
};
// 注册
const handleRegister = async () => {
    const res = await registerAPI(ruleFrom);
    if (res.data.code === 200) {
        console.log('注册成功');
        ElMessage.success('注册成功');
        userStore.setToken(res.data.token); // 保存 token
        return true; // 注册成功
    } else {
        console.log('注册失败');
        ElMessage.error('注册失败，账号已存在');
        return false; // 注册失败
    }
};

// 获取用户信息
const fetchUserInfo = async () => {
    const ret = await getUserInfoAPI();
    if (ret.data.code === 200) {
        userStore.setUserInfo(ret.data.user); // 保存用户信息
        console.log('获取用户信息成功:', userStore.userInfo);
    } else {
        console.log('获取用户信息失败');
        ElMessage.error('获取用户信息失败');
    }
};

</script>

<template>
    <div class="backgrounds">
        <div class="login-box">
            <h3>{{ loginOrRegister ? '登录' : '注册' }}</h3>
            <el-form :model="ruleFrom" :rules="rules" ref="ruleFormRef" label-width="80px" class="form-class">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="ruleFrom.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleFrom.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword" v-if="!loginOrRegister">
                    <el-input v-model="ruleFrom.confirmPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">{{ loginOrRegister ? '登录' : '注册'
                        }}</el-button>
                    <el-button type="success" @click="loginOrRegister = !loginOrRegister">{{ loginOrRegister ? '去注册' :
                        '去登录' }}</el-button>
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
    height: auto;
    padding-right: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;

    h3 {
        text-align: center;
        margin-top: 20px;
        font-size: 30px;
        color: #333;
    }
}

.form-class {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>