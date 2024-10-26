<script setup lang="ts">

import NavBar from "@/components/Home/NavBar.vue";
import { RouterView } from "vue-router";
import Floor from "@/components/Home/Floor.vue";

</script>

<template>
  <div>
    <NavBar></NavBar>
    <div class="router-view-container">
      <router-view v-slot="{ Component }" class="router-view-div">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <Floor></Floor>
  </div>
</template>

<style scoped>
.router-view-container {
  padding: 10px 0;
  background-color: rgb(245, 246, 246);
  ;
  /* 设置背景色 */
  min-height: calc(100vh - 60px);
  /* 高度减去导航栏的高度，导航栏高度为60px */
}

.router-view-div {
  width: 81%;
  margin: 0 auto;
  /* 设置宽度和居中 */
}

/* 定义 fade 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
