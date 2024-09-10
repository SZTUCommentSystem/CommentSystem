<script setup lang="ts">
import { ElNotification } from 'element-plus';
import NavBar_Notice from "@/components/icons/NavBar_Notice.vue";
import NavBar_Logo from "@/components/icons/NavBar_Logo.vue";
import { RouterLink } from 'vue-router';

// 示例通知功能的函数
const showNotification = () => {
  ElNotification({
    title: '通知',
    message: '您有新的通知。',
    type: 'info',
  });
};

// 下拉菜单项
const sideDropList = [

  { path: "/home/chapter", name: "我的作业" },
  { path: "/teacher/assign", name: "布置作业" },
  { path: "/teacher/correct", name: "批改作业" },

];
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light shadow-sm">
    <div class="container-fluid">
      <div class="row w-100">
        <!-- 左侧留白 -->
        <div class="col-2 d-flex align-items-center justify-content-center">
          <!-- 空白区域 -->
        </div>

        <!-- 中间左边内容区域 -->
        <div class="col-8 d-flex align-items-center">
          <!-- Logo -->
          <nav-bar_-logo class="me-4"></nav-bar_-logo>

          <!-- 导航链接 -->
          <ul class="navbar-nav d-flex flex-row mb-0">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/home">首页</RouterLink>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                作业
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li v-for="item in sideDropList" :key="item.path">
                  <RouterLink class="dropdown-item" :to="item.path">{{ item.name }}</RouterLink>
                </li>
              </ul>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" to="/courses">课程</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/comments">批语库</RouterLink>
            </li>
          </ul>

          <!-- 中间右侧内容区域 -->
          <div class="ms-auto d-flex align-items-center">
            <!-- 通知图标 -->
            <nav-bar_-notice class="me-3" @click="showNotification"></nav-bar_-notice>

            <!-- 用户信息 -->
            <div class="d-none d-md-block text-start">
              <div class="d-flex align-items-center">
                <img src="https://via.placeholder.com/32" alt="User Avatar" class="rounded-circle me-2">
                <div>
                  <div class="username">用户名</div>
                  <div class="user-id">ID: 123456</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧留白区域 -->
        <div class="col-2">
          <!-- 空白区域 -->
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 样式部分 */
.navbar {
  background-color: #fff;
  /* 背景颜色 */
}

.shadow-sm {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.nav-link {
  margin: 0 10px;
}

.dropdown-menu {
  border-radius: 0.5rem;
  /* 圆角边框 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 阴影 */
  background-color: #fff;
  /* 背景颜色 */
  padding: 0.5rem;
  /* 内边距 */
  min-width: 120px;
  /* 最小宽度 */
}

.dropdown-item {
  padding: 0.25rem 0.5rem;
  /* 内边距 */
  font-size: 0.9rem;
  /* 字体大小 */
  color: #333;
  /* 文字颜色 */
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  /* 悬停背景颜色 */
  color: #007bff;
  /* 悬停字体颜色 */
}

.username {
  font-weight: bold;
}

.user-id {
  font-size: 1em;
  color: #6c757d;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.ms-auto {
  margin-left: auto;
  /* 将元素推到容器的最右边 */
}

.text-start {
  text-align: start;
  /* 确保文本左对齐 */
}
</style>
