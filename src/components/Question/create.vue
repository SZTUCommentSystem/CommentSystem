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
import { ElMessage } from 'element-plus'

import { addQuestionAPI } from '@/api/QuestionAPI'

const userStore = useUserStore()
const router = useRouter()

interface Label {
  topicLabelId: string | number
  [key: string]: any
}

interface Comment {
  commentId: string | number
  [key: string]: any
}

const questionContent = reactive<{
  topicTitle: string
  topicType: string
  labels: Label[]
  topicUrls: string[]
  topicInfo: string
  comments: Comment[]
}>({
  topicTitle: '',
  topicType: '',
  labels: [],
  topicUrls: [],
  topicInfo: '',
  comments: [],
})

const right = ref()
// 返回类型Id函数
const typeId = ref('')
const returnTypeId = () => {
  typeId.value = (right.value.getTypeList()
    .find((item:any) => item.topicTypeName === questionContent.topicType)
    ?.topicTypeId ?? '').toString();
}
// 返回图片地址函数
const uploadUrls = ref('')
const returnUploadUrls = async () => {
  await right.value.uploadImages();
  const urls = right.value.getUploadUrls();
  console.log('获取到的图片地址:', urls);
  uploadUrls.value = urls.join(',');
}

// 提交
const submitQuestion = async () => {
  returnTypeId()
  await returnUploadUrls()
  
  let data = {
    courseId: userStore.selectClass.courseId,
    topicTitle: questionContent.topicTitle.trim(),
    topicTypeId: typeId.value,
    labelIds: questionContent.labels.map(label => label.topicLabelId).join(','),
    topicUrls: uploadUrls.value,
    topicInfo: questionContent.topicInfo,
    commentIds: questionContent.comments.map(comment => comment.commentId).join(','),
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