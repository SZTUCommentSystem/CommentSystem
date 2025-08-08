<template>
  <div class="left" :style="isCuor ? 'width: 100%;' : 'width: 50%;'">
    <div class="create-list">
      <div class="create-title">
        <div class="flex-between">
          <p>题目批语：<el-checkbox v-if="!isCuor" v-model="questionContent.isSvg" label="自动平均权重" size="large" /></p>
          <el-button type="primary" plain @click="showDialog = true" style="border-radius: 10px;margin-right: 0;">添加批语</el-button>
        </div>
      </div>
      
      <!-- 使用 draggable 替换原来的 v-for -->
      <draggable 
        v-model="questionContent.comments" 
        group="comments"
        @change="handleDragChange"
        :disabled="isCuor"
        item-key="commentId"
        class="drag-container"
        handle=".drag-handle"
      >
        <template #item="{ element: comment, index }">
          <div class="drag-item">
            <el-tag
              :key="comment.commentId"
              type="primary"
              effect="plain"
              size="large"
              :closable="!isCuor"
              @click="handleTagClick(comment)"
              @close="handleCloseComment(comment)"
              class="draggable-tag"
              :class="{'selected-comment': isCommentSelected(comment.commentId)}"
              :style="!isCuor ? '':'cursor: pointer;'"
            >
              <div class="tag-div">
                <!-- 拖拽手柄 -->
                <span class="drag-handle" v-if="!isCuor">⋮⋮</span>
                
                <!-- 左侧：序号+批语内容 -->
                <div class="comment-content">
                  <b class="comment-index">{{ getDisplayIndex(comment) }}</b>
                  <span class="comment-text">{{ comment.commentName }}</span>
                </div>
                
                <!-- 右侧：权重 -->
                <span class="weight-section" @mousedown.stop @click.stop>
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
                    @mousedown.stop
                    @click.stop
                  />
                  <span v-else-if="index >= 10" style="width: 60px; margin-right: 8px; text-align: center; color: #999;">
                    无权重
                  </span>
                </span>
              </div>
            </el-tag>
          </div>
        </template>
      </draggable>
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
import draggable from 'vuedraggable'

const props = defineProps({
  questionContent: {
    type: Object,
    required: true
  },
  isCuor: {
    type: Boolean,
    default: false
  },
  selectedCommentIds: {
    type: Array as () => number[],
    default: () => []
  }
})

const emit = defineEmits(['clickEvent'])

// 维护选择顺序映射
const selectedOrderMap = ref<Record<number, number>>({})

// 计算显示序号 - 根据在数组中的实际位置
const getDisplayIndex = (comment: any) => {
  const index = props.questionContent.comments.findIndex(c => c.commentId === comment.commentId)
  return index + 1
}

// 处理拖拽变化
const handleDragChange = (evt: any) => {
  console.log('拖拽变化:', evt)
  // 重新分配序号映射
  updateOrderMapping()
}

// 更新序号映射
const updateOrderMapping = () => {
  selectedOrderMap.value = {}
  props.questionContent.comments.forEach((comment: any, index: number) => {
    selectedOrderMap.value[comment.commentId] = index + 1
  })
}

const handleTagClick = (comment: any) => {
  if (!props.isCuor) return // 编辑模式下禁用点击
  emit('clickEvent', comment)
}

// 判断批语是否被选中
const isCommentSelected = (commentId: number) => {
  return props.selectedCommentIds.includes(commentId)
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
  
  // 保存原有批语的权重信息
  const existingWeights: Record<number, any> = {}
  props.questionContent.comments.forEach((comment: any) => {
    if (comment.commentId && typeof comment.weightNum !== 'undefined') {
      existingWeights[comment.commentId] = comment.weightNum
    }
  })
  
  // 更新批语列表，保留原有权重
  props.questionContent.comments = comments.map((comment: any, index: number) => {
    const newComment = { ...comment }
    
    // 如果是原有批语，保留其权重；如果是新批语，设置默认权重
    if (existingWeights.hasOwnProperty(comment.commentId)) {
      newComment.weightNum = existingWeights[comment.commentId]
    } else {
      // 新增批语的权重设置
      newComment.weightNum = index < 10 ? 0 : undefined
    }
    
    return newComment
  })
  
  updateOrderMapping()
  showDialog.value = false
}

const handleCloseComment = (comment: any) => {
  const idx = props.questionContent.comments.indexOf(comment)
  if (idx > -1) {
    props.questionContent.comments.splice(idx, 1)
    // 删除后重新更新序号映射
    updateOrderMapping()
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
    });
    updateOrderMapping()
  });
})
</script>

<style scoped>
.left {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  background-color: #fff;

  p {
    margin: 0;
    font-size: 18px;
    margin-bottom: 10px;
  }

  .create-list {
    display: flex;
    flex-direction: column;
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
  }

  .create-list ::v-deep(.el-tag) {
    width: 100%; 
    margin-right: 10px; 
    margin-bottom: 10px; 
    font-size: 16px; 
    padding: 0;

    .el-tag__content {
      width: 100%;
    }
  }
}

/* 拖拽相关样式 */
.drag-container {
  width: 100%;
}

.drag-item {
  width: 100%;
  margin-bottom: 10px;
}

.draggable-tag {
  height: auto;
  width: 100%; 
  font-size: 16px; 
  padding: 8px 12px;
  transition: transform 0.2s ease;
}

.draggable-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tag-div {
  display: flex; 
  align-items: center; /* 改为居中对齐 */
  justify-content: space-between; 
  width: 100%;
  gap: 12px; /* 增加间距 */
  padding: 12px 8px; /* 增加内边距，让文本有更多空间 */
  min-height: auto; /* 移除固定高度，自适应内容 */
}

.drag-handle {
  cursor: grab;
  color: #999;
  font-weight: bold;
  padding: 4px;
  user-select: none;
  transform: rotate(90deg);
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1;
  align-self: center; /* 居中对齐 */
}

.drag-handle:hover {
  color: #409eff;
}

.drag-handle:active {
  cursor: grabbing;
}

.comment-content {
  flex: 1;
  display: flex;
  align-items: center; /* 改为居中对齐 */
  justify-content: flex-start; /* 靠左对齐 */
  gap: 8px; /* 序号和文本之间的间距 */

  .comment-index {
    color: #67c23a;
    flex-shrink: 0; /* 防止序号被压缩 */
    line-height: 1.5;
    font-weight: bold;
  }

  .comment-text {
    display: block; /* 改为块级元素 */
    height: auto;
    white-space: normal; /* 允许换行 */
    word-wrap: break-word; /* 长单词换行 */
    line-height: 1.5; /* 增加行高，提高可读性 */
    flex: 1;
  }
}

.draggable-tag :deep(.el-tag__close) {
  margin-right: 10px;
}

.weight-section {
  display: flex; 
  align-items: center; /* 居中对齐 */
  flex-shrink: 0; /* 防止权重输入框被压缩 */
  min-width: 80px;
  justify-content: flex-end;
}

/* 拖拽时的样式 */
.sortable-ghost {
  opacity: 0.5;
  background: #f0f0f0;
}

.sortable-chosen {
  opacity: 0.8;
}

.sortable-drag {
  opacity: 0.8;
  transform: rotate(2deg);
}

/* 文字截断 */
.ov-fl-ell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 增加选择样式 */
.selected-comment {
  border: 2px solid rgba(144, 238, 144, 0.7) !important;
}
</style>