<template>
  <nav class="navbar navbar-expand-lg navbar-light shadow-sm">
    <div class="container-fluid">
      <div class="row w-100">
        <!-- 左侧留白 -->
        <div class="col-1 d-flex align-items-center justify-content-center">
          <!-- 空白区域 -->
        </div>

        <!-- 中间内容区域 -->
        <div class="col-10 d-flex align-items-center">
          <!-- Logo -->
          <nav-bar_-logo class="me-4"></nav-bar_-logo>

          <!-- 导航链接 -->
          <ul class="navbar-nav d-flex flex-row mb-0" v-if="Object.keys(selectClass).length > 0">
            <li v-for="item in navList2" :key="item.path" class="nav-item">
              <RouterLink class="nav-link" :to="item.path" active-class="active">{{ item.name }}</RouterLink>
            </li>
          </ul>
          <ul class="navbar-nav d-flex flex-row mb-0" v-else>
            <li v-for="item in navList1" :key="item.path" class="nav-item">
              <RouterLink class="nav-link" :to="item.path" active-class="active">{{ item.name }}</RouterLink>
            </li>
          </ul>


          <!-- 中间右侧内容区域 -->
          <div class="ms-auto">
            <div v-if="isLogin">
              <div class="d-flex align-items-center">
                <!-- 通知图标 -->
                <!-- <nav-bar_-notice class="d-done me-3" @click="showNotification"></nav-bar_-notice> -->

                <!-- 用户信息 -->
                <div class="d-none d-md-block text-start">
                  <el-dropdown>
                    <div class="d-flex align-items-center">
                      <div>
                        <div class="username">{{ userStore.userInfo.nickName }}</div>
                      </div>
                    </div>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>

                </div>
              </div>
            </div>
            <div v-else>
              <RouterLink to="/login" class="login-button">登录</RouterLink>
            </div>
          </div>
        </div>

        <!-- 右侧留白区域 -->
        <div class="col-1">
          <!-- 空白区域 -->
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { ElNotification } from 'element-plus';
import NavBar_Logo from "@/components/icons/navbar/NavBar_Logo.vue";
import { RouterLink } from 'vue-router';
import {useUserStore} from "../../store/user";

const userStore = useUserStore();

// 示例通知功能的函数
const showNotification = () => {
  ElNotification({
    title: '通知',
    message: '您有新的通知。',
    type: 'info',
  });
};

// 导航菜单项
// 未选择课程
const navList1 = [
  { path: "/home/homepage", name: "首页" },
  { path: "/home/course", name: "课程管理" },
]
// 已选择课程
const navList2 = [
  { path: "/home/homepage", name: "首页" },
  { path: "/home/class", name: "班级管理" },
  { path: "/home/question", name: "题库管理" },
  { path: "/home/task", name: "作业库管理" },
  { path: "/home/library", name: "批语库管理" },
  { path: "/home/label", name: "标签库管理" },
];

// 是否选择课程

// 退出登录
const logout = () => {
  userStore.clearUser();

  // 刷新
  location.reload();
};

const isLogin = ref();
const selectClass = ref({});
watchEffect(() => {
  // 获取本地存储的用户信息和token，检测是否登录，如果没有用户信息则为null
  selectClass.value = userStore.selectClass;
  isLogin.value = userStore.isLoggedIn;
})

</script>

<style scoped>
/* 样式部分 */
.navbar {
  background-color: #fff;
}

.shadow-sm {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.nav-link {
  margin: 0 10px;
  font-size: 1vw;
}

.login-button {
  padding: 5px 10px;
  border: 1px solid #007bff;
  border-radius: 5px;
  color: #007bff;

  &:hover {
    background-color: #007bff;
    color: #fff;
  }
}

.username {
  font-size: 17px;
  font-weight: bold;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.ms-auto {
  margin-left: auto;
}

.text-start {
  text-align: start;
}

.active {
  color: #000;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-link {
    margin: 0 5px;
    font-size: 3.5vw;
  }

  .login-button {
    padding: 8px 12px;
    font-size: 3.5vw;
  }

  .navbar {
    padding: 10px;
  }

  .d-flex {
    flex-direction: column;
    align-items: flex-start;
  }

  .ms-auto {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
