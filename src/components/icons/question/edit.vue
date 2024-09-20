<script setup lang="ts">
import Logo from '@/assets/img/edit.svg'
</script>

<template>
  <div class="logo-container">
    <img :src="Logo" alt="Logo Icon" class="logo-image" />
  </div>
</template>

<style scoped>



/* 控制 logo 图片大小 */
.logo-image {
  width: 18px; /* 自定义宽度 */
  height: auto; /* 确保图片不变形 */
}
</style>
