<template>
  <div class="label-card">
    <div class="header">
      <span class="title">标签库管理</span>
      <span class="desc">可为章节添加个性化标签，便于内容归类与检索</span>
    </div>
    <el-divider />
    <div class="section">
      <span class="section-label">选择标签章节：</span>
      <el-cascader
        v-model="selectedChapter"
        :options="cascaderOptions"
        clearable
        placeholder="请选择章节"
      />
      <el-button type="primary" class="ml-2" @click="showAddChapterDialog">新增章节</el-button>
      <el-button type="warning" class="ml-2" :disabled="!selectedChapter.length" @click="showEditChapterDialog">修改章节</el-button>
      <el-button type="danger" class="ml-2" :disabled="!selectedChapter.length" @click="deleteChapter">删除章节</el-button>
    </div>
    <el-divider />
    <div class="section">
      <span class="section-label">标签列表：</span>
      <div class="tag-list">
        <el-tag
          v-for="(tag, index) in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          size="large"
          class="tag-item"
          effect="light"
          :type="items[index % 5]?.type"
          @dblclick="editTag(index, tag)"
        >
          <template v-if="editIndex === index">
            <el-input
              v-model="editTagValue"
              size="small"
              @blur="saveTagEdit(index)"
              @keyup.enter="saveTagEdit(index)"
              class="tag-edit-input"
            />
          </template>
          <template v-else>
            {{ tag }}
          </template>
        </el-tag>
        <el-input
          v-if="inputVisble"
          ref="InputRef"
          v-model="inputValue"
          class="tag-input"
          size="default"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button
          v-else
          class="button-new-tag"
          size="default"
          type="primary"
          plain
          @click="showInput"
        >
          + 新增标签
        </el-button>
      </div>
    </div>
    <!-- 新增章节弹窗 -->
    <el-dialog v-model="addChapterDialogVisible" title="新增章节" width="400">
      <el-input v-model="newChapterName" placeholder="请输入章节名称" />
      <template #footer>
        <el-button @click="addChapterDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addChapter">确定</el-button>
      </template>
    </el-dialog>
    <!-- 修改章节弹窗 -->
    <el-dialog v-model="editChapterDialogVisible" title="修改章节名称" width="400">
      <el-input v-model="editChapterName" placeholder="请输入新章节名称" />
      <template #footer>
        <el-button @click="editChapterDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editChapter">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { ElMessageBox, ElMessage } from 'element-plus';
import type { InputInstance, TagProps } from "element-plus";

import { getChapterListAPI, addChapterAPI, changeChapterAPI, deleteChapterAPI } from "@/api/ChapterAPI";
import { labelListAPI, addLabelAPI, changeLabelAPI, deleteLabelAPI} from "@/api/LabelAPI"

import { useUserStore } from "@/store/user";
const userStore = useUserStore();

// 章节相关
const root = ref([]); //存储章节的原始数据
const cascaderOptions = ref<any[]>([]); //存储章节的可视化数据
const selectedChapter = ref<any[]>([]); // 当前选中的章节路径

function convertToCascaderOptions(list: any[]): any[] {
  return list.map(item => ({
    value: item.chapterId,
    label: item.chapterName,
    children: item.children && item.children.length > 0 ? convertToCascaderOptions(item.children) : undefined
  }));
}
const getChapterList = async () => {
  root.value = [];
  try {
    const res = await getChapterListAPI();
    if (res.data.code === 200) {
      res.data.rows.forEach((item: any) => {
        item.children = []
        if (item.parentId === null) {
          root.value.push(item);
        } else {
          const parent = res.data.rows.find((parentItem: any) => parentItem.chapterId === item.parentId);
          if (parent) {
            parent?.children.push(item);
          }
        }
      })
      cascaderOptions.value = convertToCascaderOptions(root.value);
    }
  } catch (error) {
    console.error('请求错误:', error);
  }
};

// 新增章节
const addChapterDialogVisible = ref(false)
const newChapterName = ref('')
const showAddChapterDialog = () => {
  newChapterName.value = ''
  addChapterDialogVisible.value = true
}
const addChapter = async () => {
  if (!newChapterName.value.trim()) {
    ElMessage.warning('请输入章节名称')
    return
  }
  // parentId 取当前选中的最后一个章节，否则为null
  const parentId = selectedChapter.value.length ? selectedChapter.value[selectedChapter.value.length - 1] : null
  try {
    let data = {
      courseId: userStore.selectClass.courseId,
      parentId: parentId,
      chapterName: newChapterName.value.trim(),
    }
    const res = await addChapterAPI(data)
    if (res.data.code === 200) {
      ElMessage.success('新增成功')
      addChapterDialogVisible.value = false
      getChapterList()
    } else {
      ElMessage.error(res.data.message || '新增失败')
    }
  } catch (e) {
    ElMessage.error('请求失败')
  }
}

// 修改章节
const editChapterDialogVisible = ref(false)
const editChapterName = ref('')
const showEditChapterDialog = () => {
  if (!selectedChapter.value.length) return
  // 获取当前选中章节的名称
  const chapter = findChapterById(root.value, selectedChapter.value[selectedChapter.value.length - 1])
  editChapterName.value = chapter ? chapter.chapterName : ''
  editChapterDialogVisible.value = true
}
const editChapter = async () => {
  if (!editChapterName.value.trim()) {
    ElMessage.warning('请输入新章节名称')
    return
  }
  const chapterId = selectedChapter.value[selectedChapter.value.length - 1]
  const parentId = selectedChapter.value.length ? selectedChapter.value[selectedChapter.value.length - 1] : null
  try {
    let data = {
      courseId: userStore.selectClass.courseId,
      chapterId,
      parentId,
      chapterName: editChapterName.value.trim(),
    }
    const res = await changeChapterAPI(data)
    if (res.data.code === 200) {
      ElMessage.success('修改成功')
      editChapterDialogVisible.value = false
      getChapterList()
    } else {
      ElMessage.error(res.data.message || '修改失败')
    }
  } catch (e) {
    ElMessage.error('请求失败')
  }
}

// 删除章节
const deleteChapter = async () => {
  if (!selectedChapter.value.length) return
  const chapterId = selectedChapter.value[selectedChapter.value.length - 1]
  try {
    await ElMessageBox.confirm(
      '确定要删除该章节吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    const res = await deleteChapterAPI(chapterId)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      getChapterList()
      selectedChapter.value = []
    } else {
      ElMessage.error(res.data.message || '删除失败')
    }
  } catch (e) {}
}

// 递归查找章节
function findChapterById(list: any[], id: number): any | null {
  for (const item of list) {
    if (item.chapterId === id) return item
    if (item.children && item.children.length) {
      const found = findChapterById(item.children, id)
      if (found) return found
    }
  }
  return null
}

// 标签相关
const inputValue = ref('')
const dynamicTags = ref(['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5', 'Tag6', 'Tag7'])
const inputVisble = ref(false)
const InputRef = ref<InputInstance>()
const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}
const showInput = () => {
  inputVisble.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
const handleInputConfirm = () => {
  if (InputRef.value && inputValue.value.trim()) {
    dynamicTags.value.push(inputValue.value.trim())
  }
  inputVisble.value = false
  inputValue.value = ''
}

// 修改标签内容
const editIndex = ref(-1)
const editTagValue = ref('')
const editTag = (index: number, tag: string) => {
  editIndex.value = index
  editTagValue.value = tag
  nextTick(() => {
    (document.querySelector('.tag-edit-input input') as HTMLInputElement | null)?.focus()
  })
}
const saveTagEdit = (index: number) => {
  if (editTagValue.value.trim()) {
    dynamicTags.value[index] = editTagValue.value.trim()
  }
  editIndex.value = -1
  editTagValue.value = ''
}

type Item = { type: TagProps['type']; label: string }
const items = ref<Array<Item>>([
  { type: 'primary', label: 'Tag 1' },
])

onMounted(() => {
  getChapterList();
});
</script>

<style scoped>
.label-card {
  max-width: 1000px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.07);
  padding: 32px 36px 28px 36px;
  min-height: 350px;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
}
.title {
  font-size: 22px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
}
.desc {
  font-size: 14px;
  color: #888;
}
.section {
  display: flex;
  align-items: center;
  margin: 18px 0;
  flex-wrap: wrap;
}

.section :deep(.el-cascader) {
  width: 400px;
}

.section-label {
  font-size: 16px;
  font-weight: 500;
  margin-right: 16px;
  color: #444;
  min-width: 110px;
}

.tag-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 48px;
  overflow-x: auto;
  padding: 4px 0;
}
.tag-item {
  margin-bottom: 4px;
  cursor: pointer;
}
.button-new-tag {
  margin-left: 8px;
  height: 32px;
  line-height: 30px;
  border-radius: 16px;
  font-size: 14px;
  padding: 0 18px;
  border: 1px dashed #409eff;
  color: #409eff;
  background: #f7fafd;
  transition: all 0.2s;
}
.button-new-tag:hover {
  background: #e6f7ff;
  border-color: #66b1ff;
  color: #0077ff;
}
.tag-input, .tag-edit-input {
  width: 110px;
  margin-left: 8px;
}
.ml-2 {
  margin-left: 12px;
}
</style>