<template>
  <div class="create-wrapper">
    <div class="header">
      <el-page-header @back="$router.push('/home/question')" content="创建题目" title="返回" />
    </div>
    <div class="create-title-top">
      <div class="left">
        <div class="create-list">
          <div class="create-title">
            <div class="flex-between">
              <p>题目批语：</p>
              <el-button type="primary" plain style="border-radius: 10px;margin-right: 0;">添加批语</el-button>
            </div>
          </div>
          <CategoryList :categories="category" />
        </div>
      </div>
      <div class="right">
        <div class="create-list">
          <p>标题：</p>
          <input type="text" v-model="questionContent.title" placeholder="请输入题目标题" />
        </div>
        <div class="create-list">
          <p>题目类型：</p>
          <el-select
            v-model="questionContent.type"
            placeholder="请选择题目类型"
            style="width: 100%;"
            popper-class="type-select-dropdown"
            :teleported="false"
            filterable
            @visible-change="editTypeId = -1"
          >
            <el-option
              v-for="item in typeList"
              :key="item.topicTypeId"
              :label="item.topicTypeName"
              :value="item.topicTypeName"
            >
              <template #default>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span v-if="editTypeId !== item.topicTypeId">{{ item.topicTypeName }}</span>
                  <el-input
                    v-else
                    v-model="editTypeValue"
                    size="small"
                    style="width: 120px;"
                    @keyup.enter="confirmEditType(item.topicTypeId)"
                    @blur="confirmEditType(item.topicTypeId)"
                    autofocus
                  />
                  <span style="margin-left: 10px;">
                    <img
                      src="@/assets/img/编辑.png"
                      class="icon-btn"
                      style="margin-left: 8px;"
                      @click.stop="startEditType(item.topicTypeId, item.topicTypeName)"
                    />
                    <img
                      src="@/assets/img/删除2.png"
                      class="icon-btn"
                      style="margin-left: 8px;"
                      @click.stop="removeType(item.topicTypeId)"
                    />
                  </span>
                </div>
              </template>
            </el-option>
            <el-input
              v-if="inputVisble"
              ref="InputRef"
              v-model="newType"
              placeholder="请输入新类型"
              class="type-input"
              size="default"
              @keyup.enter="addType"
              @blur="addType"
            />
            <el-button
              v-else
              key="primary"
              type="primary"
              text
              style="margin-left: 6px;"
              @click="showInput"
            >
              添加
            </el-button>
          </el-select>
        </div>
        <div class="create-list">
          <p>题目标签：</p>
          <div class="tag">
            <el-tag v-for="tag in questionContent.tags" :key="tag" type="primary" effect="plain" round size="large"
              closable @close="handleCloseTag(tag)">{{ tag.topicLabelName }}</el-tag>
            <el-button type="primary" plain style="border-radius: 20px;" @click="drawerTag = true">+ 添加</el-button>
            <el-drawer v-model="drawerTag" title="选择标签">
              <Label
                :selectMode="true"
                :selectedIds="questionContent.tags.map(t=>t.topicLabelId)"
                @confirm="handleTagConfirm"
              />
            </el-drawer>
          </div>
        </div>
        <div class="create-list">
          <p>作业相关图片：</p>
          <el-upload ref="upload" v-model:file-list="questionContent.imgs"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" list-type="picture-card"
            :auto-upload="false" :before-upload="beforeUpload" :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </div>
        <div class="create-list">
          <p>题目描述（可选）：</p>
          <editor-markdown v-model="questionContent.description"></editor-markdown>
        </div>
      </div>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessageBox, ElMessage, type UploadProps } from 'element-plus'

import EditorMarkdown from '@/components/Generic/Editor.vue'
import CategoryList from '@/components/Generic/CategoryList.vue'
import Label from '@/components/Label/index.vue'

import { addQuestionAPI } from '@/api/QuestionAPI'
import { questionTypeAPI, addQuestionTypeAPI, changeQuestionTypeAPI, deleteQuestionTypeAPI } from '../../api/QuestionAPI';

const userStore = useUserStore()
const router = useRouter()

const questionContent = reactive({
  title: '',
  type: '',
  tags: [],
  imgs: [],
  description: '',
  displayComments: [],
})

// 题目类型相关
// 获取类型列表
const typeList = ref([])
// 获取题目类型列表
const getTypeList = async () => {
  try {
    const res = await questionTypeAPI();
    if (res.data.code == 200) {
      typeList.value = res.data.rows;
      console.log('获取题目类型列表成功:', typeList.value);
    }
  }
  catch (error) {
    console.error('获取题目类型列表失败:', error);
  }
}

// 修改类型
const editTypeId = ref(null)
const editTypeValue = ref('')
const startEditType = (id: number, val: string) => {
  editTypeId.value = id
  editTypeValue.value = val
}

const confirmEditType = async (id: number) => {
  let item = typeList.value.find(item => item.topicTypeId === id);
  let data = {
    courseId: userStore.selectClass.courseId,
    chapterId: item.chapterId,
    topicTypeId: item.topicTypeId,
    topicTypeName: editTypeValue.value.trim(),
  }
  const res = await changeQuestionTypeAPI(data)
  if (res.data.code === 200) {
    ElMessage.success('修改成功')
    // 同步更新题目类型列表
    getTypeList()
    editTypeId.value = null
    editTypeValue.value = ''
  } else {
    ElMessage.error('修改失败，请稍后再试')
  }
}

// 移除类型
const removeType = async (idx: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该类型吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await deleteQuestionTypeAPI(idx)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      // 同步更新题目类型列表
      getTypeList()
    } else {
      ElMessage.error('删除失败，请稍后再试')
    }
  } catch (error) {
    console.error('删除题目类型失败:', error)
    ElMessage.error('删除失败，请稍后再试')
  }
}

// 添加新类型
const inputVisble = ref(false)
const newType = ref('')
const showInput = () => {
  inputVisble.value = true
  nextTick(() => {
    const inputRef = ref<HTMLInputElement | null>(null)
    inputRef.value = document.querySelector('.tag-input') as HTMLInputElement
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

const addType = async () => {
  if (!newType.value.trim()) {
    ElMessage.warning('类型名称不能为空')
    inputVisble.value = false
    return
  }

  let data = {
    courseId: userStore.selectClass.courseId,
    chapterId: typeList.value[0]?.chapterId,
    topicTypeName: newType.value.trim(),
  }

  const res = await addQuestionTypeAPI(data)
  if(res.data.code === 200) {
    ElMessage.success('添加成功')
    newType.value = ''
    // 同步更新题目类型列表
    getTypeList()
  } else {
    ElMessage.error('添加失败，请稍后再试')
  }
  inputVisble.value = false
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const drawerTag = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
const beforeUpload = () => false

const handleCloseTag = (tag: string) => {
  const idx = questionContent.tags.indexOf(tag)
  if (idx > -1) questionContent.tags.splice(idx, 1)
}
const handleTagConfirm = (tags: any) => {
  debugger
  if (!Array.isArray(tags) || tags.length === 0) {
    ElMessage.warning('请选择至少一个标签')
    return
  }
  console.log('Selected tags:', tags)
  questionContent.tags = tags
  drawerTag.value = false
}

const category = ref([
  {
    id: 1,
    name: '分类A',
    comments: [
      '你在这个项目中展现了极高的专业水平。',
      '你的思考方式为大家打开了新的视野。'
    ],
    isEditing: false,
    spreadIndex: false,
    subcategories: [
      {
        id: 4,
        name: '子分类A1',
        comments: [
          '子分类A1的评论1。',
          '子分类A1的评论2。'
        ],
        isEditing: false,
        spreadIndex: false,
        subcategories: []
      }
    ]
  },
  {
    id: 2,
    name: '分类B',
    comments: [
      '你在这个项目中展现了极高的专业水平。',
      '你的思考方式为大家打开了新的视野。'
    ],
    isEditing: false,
    spreadIndex: false,
    subcategories: []
  },
  {
    id: 3,
    name: '分类C',
    comments: [
      '你在这个项目中展现了极高的专业水平。',
      '你的思考方式为大家打开了新的视野。'
    ],
    isEditing: false,
    spreadIndex: false,
    subcategories: []
  }
])

const submitQuestion = async () => {
  try {
    await addQuestionAPI(questionContent)
    router.push({
      path: '/home/question',
      query: { forceRefresh: Date.now() },
    })
  } catch (error) {
    console.error('提交题目失败:', error)
  }
}

onMounted(() => {
  getTypeList()
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


    .left,
    .right {
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        background-color: #fff;
        width: 50%;
    }


    .right {
        width: 50%;
        margin-left: 10px;
    }

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
}

.create-list {
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

.create-list {
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