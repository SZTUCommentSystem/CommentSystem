<template>
    <el-sub-menu :index="String(item.commentTypeId)">
        <template #title>
            <span class="span">{{ item.commentTypeName }}</span>
        </template>
        <template v-for="child in item.children" :key="child.id">
            <el-menu-item 
                v-if="child && child.isBase" 
                :index="`${item.commentTypeId}-base`"
            >基础内容</el-menu-item>
            <CategoryMenu 
                v-else-if="child && !child.isBase" 
                :item="child" 
                :key="child.commentTypeId" />
        </template>
    </el-sub-menu>
</template>

<script setup lang="ts">
defineProps<{ item: any }>();
</script>