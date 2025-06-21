<template>
  <div class="right" :style="isDialog ? {width:'90%'}:{width:'50%'}">
    <div class="create-list">
      <p>标题：</p>
      <input type="text" v-model="props.questionContent.topicTitle" placeholder="请输入题目标题" />
    </div>
    <div class="create-list">
      <p>题目类型：</p>
      <el-select
        v-model="props.questionContent.topicType"
        placeholder="请选择题目类型"
        style="width: 100%;"
        popper-class="type-select-dropdown"
        :teleported="false"
        filterable
        
      >
        <el-option
          v-for="item in typeList"
          :key="item.topicTypeId"
          :label="item.topicTypeName"
          :value="item.topicTypeName"
        >
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>{{ item.topicTypeName }}</span>
            <span style="margin-left: 10px;">
              <img
                src="@/assets/img/编辑.png"
                class="icon-btn"
                style="margin-left: 8px;"
                @click.stop="openEditDialog(item)"
              />
              <img
                src="@/assets/img/删除2.png"
                class="icon-btn"
                style="margin-left: 8px;"
                @click.stop="removeType(item.topicTypeId)"
              />
            </span>
          </div>
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
        <el-tag v-for="tag in props.questionContent.labels" :key="tag" type="primary" effect="plain" round size="large"
          closable @close="handleCloseTag(tag)">{{ tag.topicLabelName }}</el-tag>
        <el-button type="primary" plain style="border-radius: 20px;" @click="drawerTag = true">+ 添加</el-button>
        <el-drawer v-model="drawerTag" title="选择标签">
          <Label
            :selectMode="true"
            :selectedIds="props.questionContent.labels.map((t:any)=>t.topicLabelId)"
            @confirm="handleTagConfirm"
          />
        </el-drawer>
      </div>
    </div>
    <div class="create-list">
      <p>作业相关图片：</p>
      <el-upload 
        ref="upload" 
        v-model:file-list="props.questionContent.topicUrls"
        list-type="picture-card"
        :auto-upload="false" 
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
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
      <editor-markdown v-model="props.questionContent.topicInfo"></editor-markdown>
    </div>
  </div>

  <!-- 编辑类型弹窗 -->
  <el-dialog v-model="editDialogVisible" title="编辑题目类型" width="400px">
    <el-input v-model="editTypeValue" placeholder="请输入类型名称" />
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmEditType()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, type UploadProps } from 'element-plus'
import EditorMarkdown from '@/components/Generic/Editor.vue'
import Label from '@/components/Label/index.vue'
import { questionTypeAPI, addQuestionTypeAPI, changeQuestionTypeAPI, deleteQuestionTypeAPI } from '@/api/QuestionAPI';
import { uploadFileAPI } from '@/api/login'

import { useUserStore } from '@/store/user'
const userStore = useUserStore()

const props = defineProps({
  questionContent: {
    type: Object,
    required: true
  },
  isDialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['returnTypeId', 'returnUploadUrls'])

// 题目类型相关
// 获取类型列表
interface TopicType {
  topicTypeId: number
  topicTypeName: string
  chapterId?: number
}
const typeList = ref<TopicType[]>([])
// 获取题目类型列表
const getTypeList = async () => {
  let data = {
    courseId: userStore.selectClass.courseId,
    pageSize: 1000,
    pageNum: 1,
  }
  try {
    const res = await questionTypeAPI(data);
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
const editTypeId = ref<number | null>(null)
const editTypeValue = ref('')
const editDialogVisible = ref(false)

function openEditDialog(item: TopicType) {
  console.log(item)
  editTypeId.value = item.topicTypeId
  console.log(editTypeId.value)
  editTypeValue.value = item.topicTypeName
  editDialogVisible.value = true
}

const confirmEditType = async () => {
  console.log(editTypeId.value)
  let item = typeList.value.find(item => item.topicTypeId === editTypeId.value);
  let data = {
    courseId: userStore.selectClass.courseId,
    chapterId: item?.chapterId,
    topicTypeId: item?.topicTypeId,
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
  editDialogVisible.value = false
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

const handleCloseTag = (tag: string) => {
  const idx = props.questionContent.labels.indexOf(tag)
  if (idx > -1) props.questionContent.labels.splice(idx, 1)
}
const handleTagConfirm = (tags: any) => {
  if (!Array.isArray(tags) || tags.length === 0) {
    ElMessage.warning('请选择至少一个标签')
    return
  }
  console.log('Selected tags:', tags)
  props.questionContent.labels = tags
  drawerTag.value = false
}

// 图片上传相关
const uploadUrls = ref<string[]>([])
// 根据图片转换二进制数据给后端，获取返回数据
const handleUploadImage = async () => {
  uploadUrls.value = []
  await Promise.all(
    props.questionContent.topicUrls.map(async (fileObj: { raw: File }) => {
      try {
        const formData = new FormData()
        // fileObj.raw 才是真正的 File 类型
        formData.append('file', fileObj.raw)

        const res = await uploadFileAPI(formData)
        if (res.data.code === 200) {
          const url = res.data.url
          uploadUrls.value.push(url)
          ElMessage.success('图片上传成功')
        } else {
          ElMessage.error('图片上传失败，请稍后再试')
        }
      } catch (e) {
        ElMessage.error('图片上传异常，请稍后再试')
      }
    })
  )
}


defineExpose({
  getTypeListValue: () => typeList.value,
  getUploadUrls: () => uploadUrls.value,
  uploadImages: handleUploadImage,
  getTypeList
})

onMounted(() => {
  getTypeList()
})
</script>

<style scoped>
.right {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  background-color: #fff;
  /* width: 50%; */
  margin-left: 10px;

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

  .tag {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>