<template>
  <div class="left">
        <div class="create-list">
          <div class="create-title">
            <div class="flex-between">
              <p>题目批语：<el-checkbox v-model="questionContent.isSvg" label="自动平均权重" size="large" /></p>
              <el-button type="primary" plain @click="showDialog = true" style="border-radius: 10px;margin-right: 0;">添加批语</el-button>
            </div>
          </div>
          <el-tag
            v-for="(comment, index) in questionContent.comments"
            :key="comment.commentId"
            type="primary"
            effect="plain"
            round
            size="large"
            closable 
            @click="handleTagClick(comment.commentName)"
            @close="handleCloseComment(comment)"
          >
            <div class="tag-div">
              <!-- 左侧：序号+批语内容 -->
              <span class="ov-fl-ell">
                <b style="color: #67c23a; margin-right: 8px;">{{ getDisplayIndex(comment) }}</b>
                {{ comment.commentName }}
              </span>
              <!-- 右侧：权重+删除 -->
              <span style="display: flex; align-items: center;">
                <!-- <el-input
                  v-model="comment.weightNum"
                  size="small"
                  style="width: 60px; margin-right: 8px;"
                /> -->
                <el-input
                  v-if="index < 10"
                  v-model="comment.weightNum"
                  size="small"
                  type="number"
                  :min="0"
                  :max="1"
                  step="0.01"
                  style="width: 60px; margin-right: 8px;"
                  @input="validateWeight(comment, index)"
                />
                <span v-else style="width: 60px; margin-right: 8px; text-align: center; color: #999;">
                  无权重
                </span>
              </span>
            </div>
          </el-tag>
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
import { onMounted, ref, nextTick } from 'vue'
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

// 维护选择顺序映射
const selectedOrderMap = ref<Record<number, number>>({})

// 计算显示序号 - 简化逻辑
const getDisplayIndex = (comment: any) => {
  return selectedOrderMap.value[comment.commentId] || 1
}

const handleTagClick = (comment: string) => {
  emit('clickEvent', comment)
}

// 验证单个权重
const validateWeight = (comment: any, index: number) => {
  const weightNum = parseFloat(comment.weightNum);
  if (isNaN(weightNum) || weightNum > 1) {
    ElMessage.warning('权重必须是小于等于1的数字');
    comment.weightNum = Math.min(1, Math.max(0, weightNum || 0));
  }
}

const showDialog = ref(false)
const handleCommentConfirm = (comments: any) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    ElMessage.warning('请选择至少一个批语')
    return
  }
  
  props.questionContent.comments = comments
  
  // 重新分配序号映射
  selectedOrderMap.value = {}
  props.questionContent.comments.forEach((comment: any, index: number) => {
    if (typeof comment.weightNum === 'undefined') {
      comment.weightNum = index < 10 ? 0 : undefined;
    }
    // 按照选择顺序分配序号
    selectedOrderMap.value[comment.commentId] = index + 1
  });
  showDialog.value = false
}

const handleCloseComment = (comment: any) => {
  const idx = props.questionContent.comments.indexOf(comment)
  if (idx > -1) {
    props.questionContent.comments.splice(idx, 1)
    // 删除序号映射
    delete selectedOrderMap.value[comment.commentId]
    
    // 重新调整后续序号
    props.questionContent.comments.forEach((c: any, index: number) => {
      selectedOrderMap.value[c.commentId] = index + 1
    })
  }
}

onMounted(() => {
  console.log(props.questionContent)
  // 确保初始化时有正确的序号
  nextTick(() => {
    props.questionContent.comments.forEach((comment: any, index: number) => {
      if (typeof comment.weightNum === 'undefined') {
        comment.weightNum = index < 10 ? 0 : undefined;
      }
      selectedOrderMap.value[comment.commentId] = index + 1
    });
  });
})
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

  .create-list ::v-deep(.el-tag) {
    width: 100%; 
    margin-right: 10px; 
    margin-bottom: 10px; 
    font-size: 16px; 
    padding: 0;

    .el-tag__content {
      width: 90%;
    }
  }
}

.tag-div {
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  width: 100%;
}
</style>