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
import { ElMessage, ElMessageBox } from 'element-plus'

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
  weightNum: string
}

const questionContent = reactive<{
  topicId?: string | number
  topicTitle: string
  topicType: string
  labels: Label[]
  topicUrls: any[] // 必须是 any[]，不能是 string[]
  topicInfo: string
  isSvg: boolean
  comments: Comment[]
}>({
  topicId: '',
  topicTitle: '',
  topicType: '',
  labels: [],
  topicUrls: [],
  topicInfo: '',
  isSvg: false,
  comments: [],
})

const right = ref()
// 返回类型Id函数
const typeId = ref('')
const returnTypeId = () => {
  typeId.value = (right.value.getTypeListValue()
    ?.find((item:any) => item.topicTypeName === questionContent.topicType)
    ?.topicTypeId ?? '').toString();
}

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

// 提交
const submitQuestion = async () => {
  // 先检查权重
  const weightValid = await checkTotalWeight();
  if (!weightValid) {
    return; // 用户选择手动调整，不继续提交
  }
  returnTypeId()
  // 直接取已上传图片的 url
  debugger
  const urls = questionContent.topicUrls
    .map((item: any) => {
      // 如果是从详情页加载的数据，使用 item.url
      if (item.url) {
        return item.url;
      }
      // 如果是新上传的文件，使用 item.raw.url
      if (item.raw && item.raw.url) {
        return item.raw.url;
      }
      return null;
    })
    .filter(Boolean)
    .join(',');

  let data = {
    topicId: questionContent.topicId,
    courseId: userStore.selectClass.courseId,
    topicTitle: questionContent.topicTitle.trim(),
    topicTypeId: typeId.value,
    labelIds: questionContent.labels.map(label => label.topicLabelId).join(','),
    topicUrls: urls,
    topicInfo: questionContent.topicInfo,
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

// 获取基础信息
const getQuestionContent = async () => {
  const itemId = Number(route.query.itemId)
  const res = await questionDetailAPI(itemId)
  if (res.data.code === 200) {
    const data = res.data.data
    questionContent.topicId = data.topicId
    questionContent.topicTitle = data.topicTitle
    questionContent.topicType = getTypeName(data.topicTypeId)
    questionContent.topicInfo = data.topicInfo
    questionContent.topicUrls = data.topicUrls
      ? data.topicUrls.split(',').map((url: string) => ({ url }))
      : []
    getLabelByIds(data.labelIds)
    questionContent.isSvg = data.isSvg === '是'
  } else {
    ElMessage.error('获取题目信息失败，请稍后再试')
  }
}

// 获取题目id对应的类型
const getTypeName = (typeId: number) => {
  const typeList = right.value.getTypeListValue()
  const type = typeList.find((item: any) => item.topicTypeId === typeId)
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

// 获取题目对应的批语
const getQuestionComments = async () => {
  const itemId = Number(route.query.itemId)
  const res = await questionCommentListAPI(itemId)
  if (res.data.code === 200) {
    // 并发获取每个批语的详情
    const commentDetails = await Promise.all(
      res.data.rows.map(async (comment: any) => {
        const retRes = await getCommentDetailAPI(comment.commentId)
        const ret = retRes.data.data
        return {
          commentId: ret.commentId,
          commentName: ret.commentName,
          commentTypeId: ret.commentTypeId,
          weightNum: comment.weightNum || '0', // 确保 weightNum 有默认值
        }
      })
    )
    questionContent.comments = commentDetails
  } else {
    ElMessage.error('获取题目评论失败，请稍后再试')
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