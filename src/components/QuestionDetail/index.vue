<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

import type { UploadProps, UploadUserFile } from 'element-plus'

import { questionDetailAPI } from '@/api/QuestionAPI/questionList';

const route = useRoute()
const questionDetail = reactive({})

const getDetail = async () => {
  try {
    const res = await questionDetailAPI(route.query.itemId)
    Object.assign(questionDetail, res.data.data) // 更新对象的属性
  } catch (error) {
    console.error('获取题目详情失败:', error)
  }
}

// 导入编辑器
import EditorMarkdown from '@/components/Generic/Editor.vue'

// 上传图片
const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpg',
    url: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  },
  {
    name: 'test.jpg',
    url: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
  }
])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 批语
const handleCloseComment = (comment: string) => {
  questionDetail.displayComments.splice(questionDetail.displayComments.indexOf(comment), 1)
}

onMounted(() => {
  getDetail()
})

// 监听路由参数变化
watch(
  () => route.query.itemId,
  (newItemId, oldItemId) => {
    if (newItemId !== oldItemId) {
      getDetail()
    }
  }
)
</script>

<template>
  <div class="create-wrapper">
    <h2 style="margin-bottom: 10px;">题目详情</h2>
    <div class="create_title">
      <p>标题：</p>
      <input type="text" v-model="questionDetail.title" placeholder="请输入题目标题" />
    </div>
    <div class="create_list">
      <p>题目标签：</p>
      <div class="tag">
        <el-tag v-for="tag in questionDetail.tags" :key="tag" type="primary" effect="plain" round size="large" closable
          @close="handleCloseTag(tag)">{{ tag }}</el-tag>
        <el-button type="primary" plain style="border-radius: 20px; ">+ 添加</el-button>
      </div>
    </div>
    <div class="create_list">
      <p>作业相关图片：</p>
      <el-upload v-model:file-list="fileList" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </div>
    <div class="create_list">
      <p>题目描述（可选）：</p>
      <editor-markdown v-model="questionDetail.description"></editor-markdown>
    </div>
    <div class="create_list">
      <p>题目批语：</p>
      <el-tag v-for="comment in questionDetail.displayComments" :key="comment" effect="plain" closable
        @close="handleCloseComment" class="comment-tag">
        {{ comment }}
      </el-tag>
      <el-button type="primary" plain style="border-radius: 20px; margin-top: 10px;">+ 添加</el-button>
    </div>
    <div class="button_submit">
      <el-button type="primary">提交</el-button>
      <router-link to="/home/task">
        <el-button>取消</el-button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.create-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.create_title,
.create_list {
  display: flex;
  /* 纵向排列 */
  flex-direction: column;
  /* 向左对齐 */
  align-items: flex-start;
  width: 100%;
  height: 98px;
  margin-bottom: 5px;
  padding: 10px 20px;
  background-color: #fff;

  p {
    margin: 0;
    font-size: 18px;
    margin-bottom: 10px;
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
}

.create_list {
  height: auto;
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

.tag {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.comment-tag {
  font-size: 18px;
  margin: 10px 0;
  padding-bottom: 5px;
  color: #000;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #000;
}
</style>