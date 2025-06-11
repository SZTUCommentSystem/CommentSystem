<template>
  <div class="label-card">
    <div class="header" v-if="!props.selectMode">
      <span class="title">标签库管理</span>
      <span class="desc">可为章节添加个性化标签，便于内容归类与检索</span>
    </div>
    <el-divider v-if="!props.selectMode"/>
    <div class="section">
      <div class="top">
        <span class="section-label">选择标签章节：</span>
        <el-cascader
          v-model="selectedChapter"
          :options="cascaderOptions"
          clearable
          placeholder="请选择章节"
          @clear="selectedChapter = []"
        />
      </div>
      <div class="bottom">
        <el-button type="primary" class="ml-2" @click="showAddChapterDialog">新增章节</el-button>
        <el-button type="warning" class="ml-2" :disabled="!selectedChapter?.length" @click="showEditChapterDialog">修改章节</el-button>
        <el-button type="danger" class="ml-2" :disabled="!selectedChapter?.length" @click="deleteChapter">删除章节</el-button>
      </div>
    </div>
    <el-divider />
    <div class="section">
      <span class="section-label">标签列表：</span>
      <div class="tag-list">
        <el-tag
          v-for="(tag, index) in showTags"
          :key="tag.topicLabelId"
          closable
          :disable-transitions="false"
          @close="deleteTags(tag.topicLabelId)"
          size="large"
          class="tag-item"
          effect="light"
          :type="items[index % 5]?.type"
          @dblclick="editTag(index, tag)"
          :class="{ 'tag-selected': selectMode && selectedIds.includes(tag.topicLabelId) }"
          @click="selectMode && handleSelectTag(tag.topicLabelId)"
        >
          <template v-if="editIndex === index">
            <el-input
              v-model="editTagValue"
              size="small"
              @blur="saveTagEdit(index, tag)"
              @keyup.enter="saveTagEdit(index, tag)"
              class="tag-edit-input"
            />
          </template>
          <template v-else>
            {{ tag.topicLabelName }}
          </template>
        </el-tag>
        <el-input
          v-if="inputVisble"
          ref="InputRef"
          v-model="addTagsName"
          class="tag-input"
          size="default"
          @keyup.enter="addTags"
          @blur="addTags"
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
      <!-- 选择模式下显示确认按钮 -->
      <div v-if="props.selectMode" style="margin-top: 16px;">
        <el-button type="primary" @click="confirmSelect">确认</el-button>
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
import { nextTick, onMounted, ref, computed, watch } from "vue";
import { ElMessageBox, ElMessage } from 'element-plus';
import type { InputInstance, TagProps } from "element-plus";

import { getChapterListAPI, addChapterAPI, changeChapterAPI, deleteChapterAPI } from "@/api/ChapterAPI";
import { labelListAPI, addLabelAPI, changeLabelAPI, deleteLabelAPI} from "@/api/LabelAPI"

import { useUserStore } from "@/store/user";

const userStore = useUserStore();

// 选择模式控制（作为组件时可由父组件传入）
const props = defineProps({
  selectMode: {
    type: Boolean,
    default: false
  }
});
const selectedIds = ref<number[]>([]); // 选择模式下已选标签ID

// 选择标签
const handleSelectTag = (id: number) => {
  const idx = selectedIds.value.indexOf(id);
  if (idx > -1) {
    selectedIds.value.splice(idx, 1);
  } else {
    selectedIds.value.push(id);
  }
};
// 确认选择，传递给父组件
const emit = defineEmits(['confirm']);
const confirmSelect = () => {
  emit('confirm', [...selectedIds.value]);
};


// 章节相关
const root = ref([]); //存储章节的原始数据
const cascaderOptions = ref<any[]>([]); //存储章节的可视化数据
const selectedChapter = ref<any[]>([]); // 当前选中的章节路径

// 计算当前选中标签的章节ID
const currentChapterId = computed(() => {
  if (!Array.isArray(selectedChapter.value) || selectedChapter.value.length === 0) return null;
  const lastSelected = selectedChapter.value[selectedChapter.value.length - 1];
  const chapter = findChapterById(root.value, lastSelected);
  return chapter ? chapter.chapterId : null;
});

// 当前选中的章节变化时请求一次标签列表
watch(selectedChapter, () => {
   getShowTags();
});

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
const showTags = ref<any[]>([])

// 获取当前所选章节标签列表
const getShowTags = async () => {
  console.log(userStore.selectClass.courseId, currentChapterId.value);
  let data = {
    courseId: userStore.selectClass.courseId,
    chapterId: currentChapterId.value
  }
  const res = await labelListAPI(data);
  if (res.data.code == 200) {
    showTags.value = res.data.rows;
    console.log('当前章节标签列表:', showTags.value);
  }
}

// 新增标签
const addTagsName = ref('')
const inputVisble = ref(false)
const InputRef = ref<InputInstance>()
const showInput = () => {
  if(currentChapterId.value === null) {
    ElMessage.warning('请先选择章节');
    return;
  } 
  inputVisble.value = true
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}
const addTags = async () => {
  if (!addTagsName.value.trim()) {
    inputVisble.value = false
    return
  }
  let data = {
    topicLabelId: null,
    courseId: userStore.selectClass.courseId,
    chapterId: currentChapterId.value,
    topicLabelName: addTagsName.value
  }
  const res = await addLabelAPI(data);
  if(res.data.code == 200) {
    ElMessage.success('标签添加成功');
    addTagsName.value = '';
    getShowTags();
  } else {
    ElMessage.error(res.data.message || '标签添加失败');
  }
  inputVisble.value = false
  addTagsName.value = ''
}

// 修改标签
const editIndex = ref(-1)
const editTagValue = ref('')
const editTag = (index: number, tag: any) => {
  editIndex.value = index
  editTagValue.value = tag.topicLabelName
  nextTick(() => {
    (document.querySelector('.tag-edit-input input') as HTMLInputElement | null)?.focus()
  })
}
const saveTagEdit = async (index: number, tag: any) => {
  if (editTagValue.value.trim() && tag.topicLabelId) {
    await changeTags(tag.topicLabelId, editTagValue.value.trim())
    editIndex.value = -1
    editTagValue.value = ''
  } else {
    editIndex.value = -1
    editTagValue.value = ''
  }
}
const changeTags = async (tagId: number, tagName: string) => {
  let data = {
    topicLabelId: tagId,
    courseId: userStore.selectClass.courseId,
    chapterId: currentChapterId.value,
    topicLabelName: tagName
  }
  const res = await changeLabelAPI(data);
  if(res.data.code == 200) {
    ElMessage.success('标签修改成功');
    getShowTags();
  } else {
    ElMessage.error(res.data.message || '标签修改失败');
  }
}

// 删除标签
const deleteTags = async (tagId: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该标签吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    const res = await deleteLabelAPI(tagId);
    if (res.data.code == 200) {
      ElMessage.success('标签删除成功');
      getShowTags();
    } else {
      ElMessage.error(res.data.message || '标签删除失败');
    }
  } catch (e) { }
};

type Item = { type: TagProps['type']; label: string }
const items = ref<Array<Item>>([
  { type: 'primary', label: 'Tag 1' },
])

onMounted(() => {
  getChapterList();
  getShowTags();
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
  flex-direction: column;
  align-items: flex-start;
  margin: 18px 0;
  flex-wrap: wrap;

  .bottom {
    margin-top: 10px;
  }
}

.section :deep(.el-cascader) {
  width: 400px;
}

.section-label {
  font-size: 16px;
  font-weight: 500;
  margin-right: 16px;
  margin-bottom: 5px;
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
.tag-selected {
  border: 2px solid #67c23a !important;
  background: #f0f9eb !important;
}
</style>