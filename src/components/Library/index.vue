<template>
  <el-row class="con" :style="rowStyle">
    <el-col :span="6">
      <div class="header-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <span class="h5"></span>
        <el-button @click="faDialogVisible = true">新增章节</el-button>
        <el-button @click="sonDialogVisible = true">新增子章节</el-button>
      </div>
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo mt-4" @select="handleMenuSelect"
        text-color="#333" active-text-color="#51a7ff">
        <template v-if="typeList.length">
          <CategoryMenu v-for="item in typeList" :key="item.commentTypeId" :item="item" @change="editChapter"
            @delete="deleteChapter" />
        </template>
        <template v-else>
          <el-menu-item disabled>暂无分类</el-menu-item>
        </template>
      </el-menu>
    </el-col>
    <el-col :span="18">
      <div class="header-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <span class="h5">批语列表</span>
        <el-button @click="dialogVisible = true">新增批语</el-button>
        <el-dialog v-model="dialogVisible" title="添加批语" width="600">
          <div>
            <span>目标章节：</span>
            <el-select v-model="chapterTypeId" placeholder="请选择章节" style="width: 80%;" filterable>
              <el-option
                v-for="item in flatChapterList"
                :key="item.commentTypeId"
                :label="item.fullName"
                :value="item.commentTypeId"
              />
            </el-select>
            <!-- <el-input v-model="chapterType" style="width: 80%" placeholder="请输入目标章节" /> -->
          </div>
          <div style="margin-top: 20px;">
            <span>批语内容：</span>
            <el-input v-model="newComment" style="width: 80%" placeholder="请输入批语内容" />
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="addComment">
                添加
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
      <div class="right-container">
        <el-table :data="selectedBaseComments" style="width: 100%" empty-text="暂无批语内容">
          <el-table-column label="批语内容">
            <template #default="{ row }">
              <div
                class="list_item"
                :class="{ 'comment-selected': props.selectMode && selectedIds.includes(row.commentId) }"
                @click="props.selectMode && handleSelectComment(row.commentId)"
                style="cursor: pointer;"
              >
                <span>{{ row.commentName }}</span>
                <div class="rig" v-if="!props.selectMode">
                  <img src="@/assets/img/编辑.png" class="edit-icon" @click.stop="getCurrentComment(row)" />
                  <img src="@/assets/img/删除2.png" class="edit-icon" @click.stop="deleteComment(row)" />
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 修改章节弹窗 -->
      <el-dialog v-model="editDialogVisible" title="修改章节名称" width="600">
        <div class="dialog-row" style="margin-top: 20px;">
          <span class="dialog-label">章节名称：</span>
          <el-input v-model="changeTitle" style="width: 80%" placeholder="请输入修改名称" />
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="changeChapter">
              修改
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 新增章节弹窗 -->
      <el-dialog v-model="faDialogVisible" title="新增章节" width="600">
        <div class="dialog-row" style="margin-top: 20px;">
          <span class="dialog-label">章节名称：</span>
          <el-input v-model="newChapter" style="width: 80%" placeholder="请输入章节名称" />
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="faDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addFaChapter">
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 新增子章节弹窗 -->
      <el-dialog v-model="sonDialogVisible" title="新增子章节" width="600">
        <div class="dialog-row" style="margin-top: 20px;">
          <span class="dialog-label">父章节：</span>
          <el-select v-model="faChapter" placeholder="请选择章节" style="width: 80%;" filterable>
            <el-option
              v-for="item in flatChapterList"
              :key="item.commentTypeId"
              :label="item.fullName"
              :value="item.commentTypeId"
            />
          </el-select>
        </div>
        <div class="dialog-row" style="margin-top: 20px;">
          <span class="dialog-label">章节名称：</span>
          <el-input v-model="newSonChapter" style="width: 80%" placeholder="请输入章节名称" />
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="sonDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addSonChapter">
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 修改批语弹窗 -->
      <el-dialog v-model="editCommentDialogVisible" title="修改批语" width="600">
        <div class="dialog-row" style="margin-top: 20px;">
          <span class="dialog-label">批语：</span>
          <el-input v-model="editComment" style="width: 80%" placeholder="请输入修改批语" />
        </div>
        <template #footer>
          <div>
            <el-button @click="editCommentDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="changeCommentContent">
              修改
            </el-button>
          </div>
        </template>
      </el-dialog>

      <div class="pagination" v-if="selectedBaseComments.length">
        <el-pagination background layout="prev, pager, next" :total="selectedBaseComments.length" />
      </div>
    </el-col>
    <!-- 选择模式下显示确认按钮 -->
    <div v-if="props.selectMode" style="display: flex; justify-content: flex-end; width: 100%; margin-top: 16px;">
      <el-button type="primary" @click="confirmSelect">确认</el-button>
    </div>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import CategoryMenu from './components/CategoryMenu.vue';
import { ElMessageBox, ElMessage } from 'element-plus';

import {
  getCommentListAPI, deleteCommentAPI, addCommentAPI, changeCommentAPI,
  getTypeListAPI, deleteTypeAPI, addTypeAPI, changeTypeAPI
} from "@/api/CommentsAPI";
import { useUserStore } from '../../store/user'

// 判断组件模式
const props = defineProps({
  selectMode: {
    type: Boolean,
    default: false
  },
  selectedIds: {
    type: Array as () => number[],
    default: () => []
  }
});
const emit = defineEmits(['confirm']);

const selectedIds = ref<number[]>([]); // 选择模式下已选批语ID
watch(
  () => props.selectedIds,
  (val) => {
    selectedIds.value = [...val];
  },
  { immediate: true }
);

const handleSelectComment = (id: number) => {
  const idx = selectedIds.value.indexOf(id);
  if (idx > -1) {
    selectedIds.value.splice(idx, 1);
  } else {
    selectedIds.value.push(id);
  }
};
const confirmSelect = () => {
  // 只传递已选中的完整批语对象
  const allComments = commentList.value;
  const selectedComments = allComments.filter(c => selectedIds.value.includes(c.commentId));
  emit('confirm', selectedComments);
};

const rowStyle = computed(() => ({
  width: props.selectMode ? '90%' : '80%'
}));

// 获取用户信息
const userStore = useUserStore();

// 分类树和批语内容
const typeList = ref<any[]>([]);
const commentList = ref<any[]>([]);

const isHovered = ref(false);
const handleMouseEnter = () => { isHovered.value = true; };
const handleMouseLeave = () => { isHovered.value = false; };

const activeMenu = ref(''); // 当前选中的菜单index
const selectedBaseComments = ref<any[]>([]);

// 分类树格式化
const formatTypeList = (rawList: any[]) => {
  const typeMap: Record<string, any> = {};
  rawList.forEach(item => {
    typeMap[item.commentTypeId] = { ...item, children: [] };
  });
  const result: any[] = [];
  rawList.forEach(item => {
    if (item.parentId != null) {
      typeMap[item.parentId].children.push(typeMap[item.commentTypeId]);
    } else {
      result.push(typeMap[item.commentTypeId]);
    }
  });

  rawList.forEach(item => {
    typeMap[item.commentTypeId].children.push({
      id: `${item.commentTypeId}-base`,
      name: '基础内容',
      parentId: item.commentTypeId,
      isBase: true,
      comments: []
    });
  });
  return result;
};

// 批语内容分配到基础内容子层
const fillCommentsToBase = (typeList: any[], commentList: any[]) => {
  typeList.forEach(type => {
    const base = type.children.find((child: any) => child.isBase);
    if (base) {
      base.comments = commentList
        .filter(comment => comment.commentTypeId === type.commentTypeId)
    }
    type.children
      .filter((child: any) => !child.isBase)
      .forEach((child: any) => fillCommentsToBase([child], commentList));
  });
};

// 获取类型列表
const getTypeList = async () => {
  let data = {
    pageNum: 1,
    pageSize: 9999
  }
  const res = await getTypeListAPI(data);
  if (res.data.code == 200) {
    typeList.value = formatTypeList(res.data.rows);
    if (commentList.value.length) {
      fillCommentsToBase(typeList.value, commentList.value);
    }
  }
};

// 获取批语列表
const getList = async () => {
  let data = {
    pageNum: 1,
    pageSize: 9999
  }
  const res = await getCommentListAPI(data);
  if (res.data.code == 200) {
    commentList.value = res.data.rows;
    if (typeList.value.length) {
      fillCommentsToBase(typeList.value, commentList.value);
    }
  }
  console.log('批语列表:', commentList.value);
  console.log('分类树:', typeList.value);
};

const flattenChapters = (list: any[], parentName = '') => {
  let result: any[] = [];
  list.forEach(item => {
    if (!item.isBase) {
      const fullName = parentName ? `${parentName} / ${item.commentTypeName}` : item.commentTypeName;
      result.push({ ...item, fullName });
      if (item.children) {
        result = result.concat(flattenChapters(item.children.filter(c => !c.isBase), fullName));
      }
    }
  });
  return result;
}
const flatChapterList = computed(() => flattenChapters(typeList.value));

// 菜单选择
const handleMenuSelect = (index: string) => {
  if (index.endsWith('-base')) {
    const [typeId] = index.split('-');
    // 递归查找所有层级
    const findType = (list: any[], id: string): any | null => {
      for (const type of list) {
        if (String(type.commentTypeId) === id) return type;
        if (type.children && type.children.length) {
          // 只递归非基础内容
          const found = findType(type.children.filter((c: any) => !c.isBase), id);
          if (found) return found;
        }
      }
      return null;
    };
    const type = findType(typeList.value, typeId);
    if (type) {
      const base = type.children.find((child: any) => child.isBase);
      selectedBaseComments.value = base ? base.comments : [];
      console.log('选中基础内容:', selectedBaseComments.value);
    }
  } else {
    selectedBaseComments.value = [];
  }
};

// 初始化菜单
const init = async () => {
  await getTypeList();
  await getList();
  // 默认选中第一个基础内容
  if (typeList.value.length) {
    activeMenu.value = `${typeList.value[0].commentTypeId}-base`;
    const base = typeList.value[0].children.find((child: any) => child.isBase);
    selectedBaseComments.value = base ? base.comments : [];
  }
}

// 修改批语分类名称弹窗
const editDialogVisible = ref(false);
const changeTitle = ref('');
const curItem = ref({} as any); // 当前编辑的分类项
// 输入及确认函数
const editChapter = (item: any) => {
  changeTitle.value = item.commentTypeName;
  editDialogVisible.value = true;
  curItem.value = item;
  console.log('当前编辑的分类项:', curItem.value);
};

const changeChapter = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要修改该分类名称吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 用户点击了确定，执行修改逻辑
    let data = {
      courseId: userStore.selectClass.courseId,
      commentTypeId: curItem.value.commentTypeId,
      commentTypeName: changeTitle.value.trim(),
    };
    const res = await changeTypeAPI(data);
    try {
      if (res.data.code == 200) {
        ElMessage.success('修改成功');
        // 更新分类名称
        changeTitle.value = ''; // 清空输入框
        editDialogVisible.value = false;
        await getTypeList();
      } else {
        ElMessage.error('修改失败，请稍后再试');
      }
    } catch (error) {
      console.error('修改分类错误:', error);
      ElMessage.error('修改失败，请稍后再试');
    }

  } catch {
    // 用户点击了取消
    ElMessage.info('已取消修改');
  }
}

// 删除分类弹窗
const deleteChapter = async (item: any) => {
  console.log(item)
  try {
    await ElMessageBox.confirm(
      '确定要删除该分类吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 用户点击了确定，执行删除逻辑
    const res = await deleteTypeAPI(item.commentTypeId);
    if (res.data.code == 200) {
      ElMessage.success('删除成功');
      init();
    } else {
      console.log('errrrrrr')
    }
  } catch {
    // 用户点击了取消
    ElMessage.info('已取消删除');
  }
};

// 新增章节弹窗
const faDialogVisible = ref(false);
const newChapter = ref('')
const addFaChapter = async () => {
  let data = {
    commentTypeName: newChapter.value.trim(),
    parentId: null,
    courseId: userStore.selectClass.courseId,
  };

  const res = await addTypeAPI(data);
  try {
    if (res.data.code == 200) {
      ElMessage.success('新增章节成功');
      newChapter.value = ''; // 清空输入框
      faDialogVisible.value = false;
      newChapter.value = '';
      init();
    } else {
      ElMessage.error('新增章节失败，请稍后再试');
    }
  } catch (error) {
    console.error('新增章节错误:', error);
    ElMessage.error('新增章节失败，请稍后再试');
  }
}


// 新增子章节弹窗
const sonDialogVisible = ref(false);
const faChapter = ref('');
const newSonChapter = ref('');

const addSonChapter = async () => {
  let data = {
    commentTypeName: newSonChapter.value.trim(),
    parentId: faChapter.value,
    courseId: userStore.selectClass.courseId,
  }

  const res = await addTypeAPI(data);
  try {
    if (res.data.code == 200) {
      ElMessage.success('新增子章节成功');
      newSonChapter.value = ''; // 清空输入框
      sonDialogVisible.value = false;
      faChapter.value = '';
      init();
    } else {
      ElMessage.error('新增章节失败，请稍后再试');
    }
  } catch (error) {
    console.error('新增章节错误:', error);
    ElMessage.error('新增章节失败，请稍后再试');
  }
}


// 新增批语弹窗
const dialogVisible = ref(false); //弹窗控制
const chapterTypeId = ref(null); //章节名称
const newComment = ref(''); //新增批语内容
// 添加批语到当前基础内容
// 递归查找章节名称对应的节点

const addComment = async () => {
  // 发送添加批语请求
  let data = {
    commentId: null, // 新增时ID为null
    pageNum: 1,
    pageSize: 9999,
    commentTypeId: chapterTypeId.value,
    commentName: newComment.value.trim(),
    courseId: userStore.selectClass.courseId, // 课程ID
  };
  const res = await addCommentAPI(data);
  try {
    if (res.data.code == 200) {
      ElMessage.success('添加成功');
      // 清空输入框
      newComment.value = '';
      chapterTypeId.value = '';
      dialogVisible.value = false;
      // 刷新批语列表
      init();
    } else {
      ElMessage.error('添加失败，请稍后再试');
    }
  } catch (error) {
    console.error('添加批语错误:', error);
    ElMessage.error('添加失败，请稍后再试');
  }
};

// 修改批语弹窗
const editCommentDialogVisible = ref(false);
const editComment = ref('');
const curComment = ref({} as any); 
const getCurrentComment = (item: any) => {
  editComment.value = item.commentName;
  curComment.value = item; 
  editCommentDialogVisible.value = true;
  console.log('当前编辑的批语项:', curComment.value);
};

const changeCommentContent = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要修改该批语吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 用户点击了确定，执行修改逻辑
    let data = {
      commentId: curComment.value.commentId,
      commentTypeId: curComment.value.commentTypeId,
      commentName: editComment.value.trim(),
    };
    const res = await changeCommentAPI(data);
    try {
      if (res.data.code == 200) {
        ElMessage.success('修改成功');
        // 更新批语内容
        editComment.value = ''; // 清空输入框
        curComment.value = {}; // 清空当前编辑项
        editCommentDialogVisible.value = false;
        init(); // 刷新批语列表
      } else {
        ElMessage.error('修改失败，请稍后再试');
      }
    } catch (error) {
      console.error('修改批语错误:', error);
      ElMessage.error('修改失败，请稍后再试');
    }

  } catch {
    // 用户点击了取消
    ElMessage.info('已取消修改');
  }
};

// 删除批语弹窗
const deleteComment = async (item: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要修改该批语吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    const res = await deleteCommentAPI(item.commentId);
    if (res.data.code == 200) {
      ElMessage.success('删除成功');
      init();
    } else {
      console.log('errrrr')
    }
  } catch {}
}

onMounted(() => {
  init();
});
</script>

<style scoped>
.con {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  text-align: center;
}

.header-container {
  display: flex;
  /* 使用 Flexbox */
  justify-content: space-between;
  /* 元素两端对齐 */
  align-items: center;
  /* 垂直居中 */

  h5 {
    margin-bottom: 0;
  }

  button {
    font-size: 12px;
  }
}

.h5 {
  flex: 1;
  /* 使文字占满可用空间 */
  text-align: center;
  /* 使文字居中 */
}

.right-container {
  display: flex;
  justify-content: center;
  /* 使列表居中 */
}



.right-container {
  padding: 0 20px;
  /* 内边距 */
  margin: 10px;
}

.el-menu .el-submenu {
  .span {
    font-size: 24px;
  }

  font-size: 16px;
  /* 调整标题字体大小 */
}


.el-menu {
  .el-menu-item {
    font-size: 18px;
    /* 调整菜单项字体大小 */
  }

}

.span {
  font-size: 20px;
}

.list_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;

  span {
    display: inline-block;
    max-width: 80%;
    height: auto;
  }

  .rig {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;

    img {
      width: 20px;
      height: 20px;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
  }
}

.edit-icon {
  cursor: pointer;
  /* 设置鼠标样式为指针 */
}

.pagination {
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 50px;
  bottom: 0;
}

@media (max-width:768px) {

  span {
    font-size: 16px;
  }

  .span {
    font-size: 13px;
  }

  .list_item {
    font-size: 13px;
  }

  .con {
    padding: 0;
    padding-top: 10px;
  }

  ::v-deep .con el-sub-menu__title {
    padding: 0;
  }

  ::v-deep .con .el-menu .el-menu-item {
    font-size: 12px !important;
  }
}

.dialog-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.dialog-label {
  min-width: 110px;
  text-align: right;
  margin-right: 10px;
  color: #333;
}

.comment-selected {
  border: 2px solid #67c23a !important;
  background: #f0f9eb !important;
}
</style>
