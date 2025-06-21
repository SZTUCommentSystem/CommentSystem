<template>
  <div class="left">
        <div class="create-list">
          <div class="create-title">
            <div class="flex-between">
              <p>题目批语：</p>
              <el-button type="primary" plain @click="showDialog = true" style="border-radius: 10px;margin-right: 0;">添加批语</el-button>
            </div>
          </div>
          <el-tag 
            v-for="comment in questionContent.comments" 
            :key="comment" 
            type="primary" 
            effect="plain" 
            round 
            size="large"
            closable 
            @click="handleTagClick(comment.commentName)"
            @close="handleCloseComment(comment)"
            style="margin-right: 10px; margin-bottom: 10px; font-size: 16px;"
            :style="isCuor ? { cursor: 'pointer' } : {}"
          >{{ comment.commentName }}</el-tag>
        </div>
      </div>
      <el-dialog
        v-model="showDialog"
        title="选择批语"
        width="80%"
        align-center
      >
        <Library 
          :selectMode="true"
          :selectedIds="questionContent.comments.map((t: any)=>t.commentId)"
          @confirm="handleCommentConfirm"
        ></Library>
      </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Library from '@/components/Library/index.vue'

const props = defineProps({
  questionContent: {
    type: Object,
    required: true
  },
  isCuor: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['clickEvent'])

const handleTagClick = (comment: string) => {
  console.log('111')
  emit('clickEvent', comment)
}

const showDialog = ref(false)
const handleCommentConfirm = (comments: any) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    ElMessage.warning('请选择至少一个批语')
    return
  }
  props.questionContent.comments = comments
  showDialog.value = false
}
const handleCloseComment = (comment: string) => {
  const idx = props.questionContent.comments.indexOf(comment)
  if (idx > -1) props.questionContent.comments.splice(idx, 1)
}
</script>

<style scoped>
.left {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  background-color: #fff;
  width: 50%;

  p {
    margin: 0;
    font-size: 18px;
    margin-bottom: 10px;
  }

  input {
    display: inline-block;
    width: 100%;
    height: 45px;
    padding-left: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;

    &:focus {
        outline: none;
    }
  }

  .create-list {
    display: flex;
    /* 纵向排列 */
    flex-direction: column;
    /* 向左对齐 */
    align-items: flex-start;
    width: 100%;
    height: auto;
    margin-bottom: 5px;
    padding: 10px 20px;
    background-color: #fff;

    .create-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 10px;
      
      p {
        margin: 0;
        font-size: 18px;
        margin-bottom: 10px;
      }

      .flex-between {
        display: flex;
        justify-content: space-between; 
        align-items: center;
        width: 100%
      }
    }

    input {
      display: inline-block;
      width: 100%;
      height: 45px;
      margin-top: 5px;
      padding-left: 10px;
      border: 1px solid #ccc;
      border-radius: 10px;

      &:focus {
        outline: none;
      }
    }

    .icon-btn {
      width: 15px;
      height: 15px;
      cursor: pointer;
      margin-left: 10px;
    }

    .type-input {
      width: 20%;
      margin-top: 5px;
      margin-left: 20px;
    }
  }
}
</style>