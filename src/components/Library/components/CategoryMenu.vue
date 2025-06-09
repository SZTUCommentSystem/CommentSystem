<template>
    <el-sub-menu :index="String(item.commentTypeId)">
        <template #title>
            <span class="span">{{ item.commentTypeName }}</span>
            <img
                src="@/assets/img/编辑.png"
                class="icon-btn"
                style="margin-left: 8px;"
                @click.stop="onEdit(item)"
            />
            <img
                src="@/assets/img/删除2.png"
                class="icon-btn"
                style="margin-left: 8px;"
                @click.stop="onDelete(item)"
            />
        </template>
        <template v-for="child in item.children" :key="child.id">
            <el-menu-item 
                v-if="child && child.isBase" 
                :index="`${item.commentTypeId}-base`"
            >基础内容</el-menu-item>
            <CategoryMenu 
                v-else-if="child && !child.isBase" 
                :item="child" 
                :key="child.commentTypeId" 
                @change="(...args) => emit('change', ...args)"
                @delete="(...args) => emit('delete', ...args)"
            />
        </template>
    </el-sub-menu>
</template>

<script setup lang="ts">

const props = defineProps<{ item: any }>();
const emit = defineEmits(['change', 'delete']);

const onEdit = (item: any) => {
    emit('change', item);
}

const onDelete = (item: any) => {
    emit('delete', item);
}
</script>

<style scoped>
.icon-btn {
  cursor: pointer;
  width: 15px;
  height: 15px;
  vertical-align: middle;
  color: #999;
  transition: color 0.2s;
}
.icon-btn:hover {
  color: #409EFF;
}
</style>