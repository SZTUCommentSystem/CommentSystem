<template>
  <div class="create-wrapper">
    <div class="header">
      <el-page-header @back="$router.push('/home/question')" content="创建题目" title="返回" />
    </div>
    <div class="create-title-top">
      <!-- 左盒子 -->
      <Left v-model:questionContent="questionContent"></Left>

      <!-- 右盒子 -->
      <Right ref="right" v-model:questionContent="questionContent"></Right>

    </div>
    <div class="button_submit">
      <el-button type="primary" @click="submitQuestion">提交</el-button>
      <router-link to="/home/question">
        <el-button>取消</el-button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Left from '../Question/components/Left.vue'
import Right from '../Question/components/Right.vue'

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage, ElMessageBox } from 'element-plus'

import { addQuestionAPI } from '@/api/QuestionAPI'

const userStore = useUserStore()
const router = useRouter()

interface Label {
  topicLabelId: string | number
  [key: string]: any
}

interface Comment {
  commentId: string | number
  weightNum: string
  [key: string]: any
}

const questionContent = reactive<{
  topicTitle: string
  topicType: string
  labels: Label[]
  topicUrls: any[]
  topicInfo: string
  topicAnswerInfo: string
  topicAnswerUrls: any[]
  isSvg: boolean
  comments: Comment[]
}>({
  topicTitle: '',
  topicType: '',
  labels: [],
  topicUrls: [],
  topicInfo: '',
  topicAnswerInfo: '',
  topicAnswerUrls: [],
  isSvg: false,
  comments: [],
})

// 检查总权重
const checkTotalWeight = async () => {
  const validComments = questionContent.comments.slice(0, 10); // 只取前10条
  if (validComments.length === 0) return true;

  // 如果用户已经勾选了自动平均权重，直接返回 true，不需要检查
  if (questionContent.isSvg) {
    return true;
  }

  const totalWeight = validComments.reduce((sum, comment) => {
    return sum + (parseFloat(comment.weightNum) || 0);
  }, 0);

  if (Math.abs(totalWeight - 1) > 0.01) { // 允许0.01的误差
    try {
      await ElMessageBox.confirm(
        `当前权重和为${totalWeight.toFixed(2)}，不等于1。是否要自动平均分配权重？`,
        '权重提示',
        {
          confirmButtonText: '自动平均',
          cancelButtonText: '手动调整',
          type: 'warning',
        }
      );
      
      // 用户选择自动平均
      // const averageWeight = 1 / validComments.length;
      // validComments.forEach(comment => {
      //   comment.weight = averageWeight.toFixed(3);
      // });
      // questionContent.isSvg = true;
      // ElMessage.success('已自动平均分配权重');
      questionContent.isSvg = true;
      return true;
      
    } catch {
      // 用户选择手动调整
      ElMessage.info('请手动调整权重，确保总和为1');
      return false;
    }
  }
  return true;
}

const right = ref()
// 返回类型Id函数
const typeId = ref('')
const returnTypeId = () => {
  typeId.value = (right.value.getTypeListValue()
    ?.find((item:any) => item.topicTypeName === questionContent.topicType)
    ?.topicTypeId ?? '').toString();
}

// 提交
const submitQuestion = async () => {
  // 先检查权重
  const weightValid = await checkTotalWeight();
  if (!weightValid) {
    return; // 用户选择手动调整，不继续提交
  }
  returnTypeId()
  // 直接取已上传图片的 url
  const topicUrls = questionContent.topicUrls
    .map((file: any) => file.raw.url)
    .filter(Boolean)
    .join(',');
  const topicAnswerUrls = questionContent.topicAnswerUrls
    .map((file: any) => file.raw.url)
    .filter(Boolean)
    .join(',');

  let data = {
    courseId: userStore.selectClass.courseId,
    topicTitle: questionContent.topicTitle.trim(),
    topicTypeId: typeId.value,
    labelIds: questionContent.labels.map(label => label.topicLabelId).join(','),
    topicUrls: topicUrls,
    topicInfo: questionContent.topicInfo,
    topicAnswerInfo: questionContent.topicAnswerInfo,
    topicAnswerUrls: topicAnswerUrls,
    // 下面是批语权重
    isSvg: questionContent.isSvg ? '是':'否', //看是否需要平均权重
    // commentIds: questionContent.comments.map(comment => comment.commentId).join(','),
    topicComments: questionContent.comments.map( //每条批语的权重和id
      comment => ({
        commentId: comment.commentId,
        weightNum: comment.weightNum
      })
    )
  }
  try {
    const res = await addQuestionAPI(data)
    if(res.data.code === 200) {
      ElMessage.success('提交题目成功')
      router.push({
        name: 'question',
        query: { forceRefresh: Date.now() },
      })
    } else {
      ElMessage.error('提交题目失败，请稍后再试')
    }
  } catch (error) {
    console.error('提交题目失败:', error)
  }
}
</script>

<style scoped>
.create-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  font-size: 20px;
  background-color: white;
  padding: 10px;
  width: 100%;
  margin-bottom: 10px
}

.create-title-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

.button_submit {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-right: 15px;

  button {
    margin-left: 10px;
    padding: 0 35px;
  }
}
</style>