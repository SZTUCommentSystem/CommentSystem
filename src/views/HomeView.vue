<script setup lang="ts">

import NavBar from "@/components/Home/NavBar.vue";
import { RouterView } from "vue-router";

</script>

<template>
  <div>
    <NavBar></NavBar>
    <div class="router-view-container">
      <router-view v-slot="{ Component }" style="width: 65%; margin: 0 auto;">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.router-view-container {
  padding: 20px 0;
  background-color: rgb(245, 246, 246);;
  /* 设置背景色 */
  min-height: calc(100vh - 60px);
  /* 高度减去导航栏的高度，导航栏高度为60px */
}
</style>
