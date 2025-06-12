<template>
  <div class="create-wrapper">
    <div class="header">
      <el-page-header @back="$router.push('/home/question')" content="题目详情" title="返回" />
    </div>
    <div class="create-title-top">
      <!-- 左盒子 -->
      <Left v-model:questionContent="questionContent"></Left>

      <!-- 右盒子 -->
      <Right ref="right" v-model:questionContent="questionContent"></Right>

    </div>
    <div class="button_submit">
      <el-button type="primary" @click="submitQuestion">保存并提交</el-button>
      <router-link to="/home/question">
        <el-button>取消</el-button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Left from '../Question/components/Left.vue'
import Right from '../Question/components/Right.vue'

import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

import { getCommentDetailAPI } from '@/api/CommentsAPI'
import { labelInfoAPI } from '@/api/LabelAPI'
import { questionDetailAPI, changeQuestionAPI, questionCommentListAPI } from '@/api/QuestionAPI'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

interface Label {
  chapterId: number
  courseId: number
  topicLabelId: number
  topicLabelName: string
}

interface Comment {
  commentId: number
  commentName: string
  commentTypeId: number
}

const questionContent = reactive<{
  topicId?: string | number
  topicTitle: string
  topicType: string
  labels: Label[]
  topicUrls: string[]
  topicInfo: string
  comments: Comment[]
}>({
  topicId: '',
  topicTitle: '',
  topicType: '',
  labels: [],
  topicUrls: [],
  topicInfo: '',
  comments: [],
})

// 获取基础信息
const getQuestionContent = async () => {
  const itemId = Number(route.query.itemId)
  const res = await questionDetailAPI(itemId)
  if (res.data.code === 200) {
    const data = res.data.data
    console.log('获取到的题目信息:', data);
    questionContent.topicId = data.topicId
    questionContent.topicTitle = data.topicTitle
    questionContent.topicType = getTypeName(data.topicTypeId)
    questionContent.topicInfo = data.topicInfo
    questionContent.topicUrls = data.topicUrls
    ? data.topicUrls.split(',').map(url => ({ url }))
    : []
    getLabelByIds(data.labelIds)
  } else {
    ElMessage.error('获取题目信息失败，请稍后再试')
  }
  console.log('获取到的题目信息:', questionContent);
}
// 获取题目id对应的类型
const getTypeName = (typeId: number) => {
  const typeList = right.value.getTypeListValue()
  console.log('获取到的题目类型列表:', typeList);
  const type = typeList.find((item: any) => item.topicTypeId === typeId)
  console.log('获取到的题目类型:', type);
  return type ? type.topicTypeName : ''
}

// 获取题目对应的标签
const getLabelByIds = async (labelIds: string) => {
  if(!labelIds) {
    questionContent.labels = []
    return
  }
  const ids = labelIds.split(',').map(Number).filter(id => !isNaN(id));
  try {
    const results = await Promise.all(
      ids.map(id => labelInfoAPI(id))
    );
    const labels = results
      .filter(res => res.data.code === 200)
      .map(res => res.data.data)
      .map((label: any) => ({
        chapterId: label.chapterId,
        courseId: label.courseId,
        topicLabelId: label.topicLabelId,
        topicLabelName: label.topicLabelName,
      }));
    questionContent.labels = labels;
  } catch (error) {
    ElMessage.error('获取题目标签失败，请稍后再试');
    console.error('获取题目标签失败:', error);
  }
}

// 获取题目对应的评论
const getQuestionComments = async () => {
  const itemId = Number(route.query.itemId)
  const res = await questionCommentListAPI(itemId)
  if (res.data.code === 200) {
    // 并发获取每个评论的详情
    const commentDetails = await Promise.all(
      res.data.rows.map(async (comment: any) => {
        const retRes = await getCommentDetailAPI(comment.commentId)
        const ret = retRes.data.data
        return {
          commentId: ret.commentId,
          commentName: ret.commentName,
          commentTypeId: ret.commentTypeId,
        }
      })
    )
    questionContent.comments = commentDetails
  } else {
    ElMessage.error('获取题目评论失败，请稍后再试')
  }
}

const right = ref()
// 返回类型Id函数
const typeId = ref('')
const returnTypeId = () => {
  typeId.value = (right.value.getTypeListValue()
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
    topicId: questionContent.topicId,
    courseId: userStore.selectClass.courseId,
    topicTitle: questionContent.topicTitle.trim(),
    topicTypeId: typeId.value,
    labelIds: questionContent.labels.map(label => label.topicLabelId).join(','),
    topicUrls: uploadUrls.value,
    topicInfo: questionContent.topicInfo,
    commentIds: questionContent.comments.map(comment => comment.commentId).join(','),
  }
  try {
    const res = await changeQuestionAPI(data)
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

onMounted(async () => {
  await right.value.getTypeList()
  await getQuestionContent()
  getQuestionComments()
})
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