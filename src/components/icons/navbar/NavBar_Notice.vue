<script setup lang="ts">
import Logo from '@/assets/img/notice.svg'
</script>

<template>
  <div class="logo-container">
    <img :src="Logo" alt="Logo Icon" class="logo-image" />
  </div>
</template>

<style scoped>
.logo-image {
  width: 30px;
  height: auto;
}

@media (max-width: 768px) {
  .logo-image {
    width: 20px;
  }
}
</style>
