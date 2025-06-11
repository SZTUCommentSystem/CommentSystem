<template>
    <div class="comments">
        <draggable :list="categories" tag="ul" animation="1000" @end="onEnd" ghost-class="ghost" chosen-class="chosen"
            drag-class="drag">
            <template #item="{ element, index }">
                <div class="list-class">
                    <li :key="element.id">
                        <div class="comments-main-body">
                            <div class="comments-left">
                                <div v-if="element.isEditing">
                                    <el-input v-model="element.name" @blur="toggleEdit(element)" />
                                </div>
                                <div v-else style="margin: 3px 0;">
                                    <span>{{ element.name }}</span>
                                </div>
                                <img src="@/assets/img/编辑.png" alt="" @click="toggleEdit(element)">
                            </div>
                            <div class="comments-right">
                                <img src="@/assets/img/向上的箭头.png" alt="" v-if="element.spreadIndex"
                                    @click="element.spreadIndex = !element.spreadIndex">
                                <img src="@/assets/img/向下的箭头.png" alt="" v-else
                                    @click="element.spreadIndex = !element.spreadIndex">
                            </div>
                        </div>
                        <div class="comments-daughter" v-if="element.spreadIndex">
                            <CategoryList :categories="element.subcategories"
                                @onclick="(...args) => emit('onclick', ...args)"
                                v-if="element.subcategories && element.subcategories.length !== 0" />
                            <el-check-tag checked @click="emit('onclick', comment)" v-for="comment in element.comments"
                                :key="comment" class="comment-tag">{{ comment }}</el-check-tag>
                        </div>
                    </li>
                </div>

            </template>
        </draggable>
    </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';

interface Category {
    id: number;
    name: string;
    comments: string[];
    isEditing: boolean;
    spreadIndex: boolean;
    subcategories?: Category[];
}

const props = defineProps<{
    categories: Category[];
}>();

const emit = defineEmits(['onclick']);

// 切换编辑状态
const toggleEdit = (category: Category) => {
    category.isEditing = !category.isEditing;
};

// 拖拽结束事件处理
const onEnd = (event: any) => {
    console.log('拖拽结束:', event);
    // emit('update:categories', props.categories);
};
</script>

<style scoped>
.comments {
    position: relative;
    width: 100%;
    height: 94%;

    ul {
        padding: 0;
        list-style: none;
    }

    .new-create {
        position: absolute;
        right: 0;
        top: -32px;
    }

    .list-class {
        padding: 0;

        li {
            margin: 5px;

            .comments-main-body {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 10px;
                border: 1px solid #ccc;
            }

            .comments-daughter {
                padding: 5px 10px;
                border: 1px solid #ccc;
                padding-right: 0;
            }

            .comments-left {
                display: flex;
                align-items: center;
            }

            img {
                width: 15px;
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
}

.comment-tag {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin-bottom: 5px;
    font-size: 16px;
}

/* 自定义拖动时的样式 */
.ghost {
    background-color: #e0e0e0;
    opacity: 0.8;
    border: 1px dashed #ccc;
}

.chosen {
    background-color: #d0d0d0;
    opacity: 0.8;
}

.drag {
    background-color: #c0c0c0;
    opacity: 0.8;
}
</style>