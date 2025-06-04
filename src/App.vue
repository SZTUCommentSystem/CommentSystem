<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <router-view v-slot="{ Component }" :key="$route.fullPath">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style scoped>

</style>
