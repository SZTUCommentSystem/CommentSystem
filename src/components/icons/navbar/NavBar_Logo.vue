<script setup lang="ts">
import Logo from '@/assets/img/logo.png'
</script>

<template>
  <div class="logo-container">
    <img :src="Logo" alt="Logo Icon" class="logo-image" />
  </div>
</template>

<style scoped>
.logo-image {
  width: 250px;
  height: auto;
}

@media (max-width: 768px) {
  .logo-image {
    width: 200px;
    /* 移动端宽度 */
  }
}
</style>
