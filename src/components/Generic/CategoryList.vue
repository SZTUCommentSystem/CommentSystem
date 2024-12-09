<script setup lang="ts">

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

const emit = defineEmits(['toggleEdit', 'onclick']);
</script>

<template>
    <div class="comments">
        <ul>
            <li v-for="(comment, id) in categories" :key="id">
                <div class="comments-main-body">
                    <div class="comments-left">
                        <div v-if="comment.isEditing">
                            <el-input v-model="comment.name" @blur="emit('toggleEdit', id)" />
                        </div>
                        <div v-else style="margin: 3px 0;">
                            <span>{{ comment.name }}</span>
                        </div>
                        <img src="@/assets/img/编辑.png" alt="" @click="emit('toggleEdit', id)">
                    </div>
                    <div class="comments-right">
                        <img src="@/assets/img/向上的箭头.png" alt="" v-if="comment.spreadIndex"
                            @click="comment.spreadIndex = !comment.spreadIndex">
                        <img src="@/assets/img/向下的箭头.png" alt="" v-else
                            @click="comment.spreadIndex = !comment.spreadIndex">
                    </div>
                </div>
                <div class="comments-daughter" v-if="comment.spreadIndex">
                    <CategoryList :categories="comment.subcategories" @toggleEdit="emit" @onclick="emit"
                        v-if="comment.subcategories && comment.subcategories.length !== 0" />
                    <el-check-tag checked @click="emit('onclick', commentTag)" v-for="commentTag in comment.comments"
                        :key="commentTag" class="comment-tag">{{ commentTag }}</el-check-tag>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.comments {
    position: relative;
    width: 100%;
    height: 94%;

    .new-create {
        position: absolute;
        right: 0;
        top: -32px;
    }

    ul {
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
</style>