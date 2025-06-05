<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import CategoryMenu from './components/CategoryMenu.vue';
import { getCommentList, getTypeListAPI } from "@/api/CommentsAPI";
import { ElMessageBox, ElMessage } from 'element-plus';


// 分类树和批语内容
const typeList = ref<any[]>([]);
const commentList = ref<any[]>([]);

// 新增批语弹窗
const dialogVisible = ref(false);
// 修改批语分类名称弹窗
const editDialogVisible = ref(false);
const changeComment = async () => {
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




    // ...你的修改代码...
    ElMessage.success('修改成功');
    editDialogVisible.value = false;
  } catch {
    // 用户点击了取消
    ElMessage.info('已取消修改');
  }
}
// 删除分类弹窗
const deleteDialogVisible = ref(false);
const deleteComment = async () => {
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

    
    // ...你的删除代码...
    ElMessage.success('删除成功');
    deleteDialogVisible.value = false;
  } catch {
    // 用户点击了取消
    ElMessage.info('已取消删除');
  }
};

const newComment = ref('');

const isHovered = ref(false);
const handleMouseEnter = () => { isHovered.value = true; };
const handleMouseLeave = () => { isHovered.value = false; };

const activeMenu = ref(''); // 当前选中的菜单index
const selectedBaseComments = ref<string[]>([]);

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
        .map(comment => comment.commentName);
    }
    type.children
      .filter((child: any) => !child.isBase)
      .forEach((child: any) => fillCommentsToBase([child], commentList));
  });
};

// 获取类型列表
const getTypeList = async () => {
  const res = await getTypeListAPI();
  if (res.data.code == 200) {
    typeList.value = formatTypeList(res.data.rows);
    if (commentList.value.length) {
      fillCommentsToBase(typeList.value, commentList.value);
    }
  }
};

// 获取批语列表
const getList = async () => {
  const res = await getCommentList();
  if (res.data.code == 200) {
    commentList.value = res.data.rows;
    if (typeList.value.length) {
      fillCommentsToBase(typeList.value, commentList.value);
    }
  }
  console.log('批语列表:', commentList.value);
  console.log('分类树:', typeList.value);
};

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

// 添加批语到当前基础内容
const addComment = () => {
  if (!newComment.value.trim()) return;
  if (activeMenu.value.endsWith('-base')) {
    const [typeId] = activeMenu.value.split('-');
    const type = typeList.value.find(t => String(t.commentTypeId) === typeId);
    if (type) {
      const base = type.children.find((child: any) => child.isBase);
      if (base) {
        base.comments.push(newComment.value.trim());
        selectedBaseComments.value = base.comments;
      }
    }
  }
  newComment.value = '';
  dialogVisible.value = false;
};

onMounted(async () => {
  await getTypeList();
  await getList();
  // 默认选中第一个基础内容
  if (typeList.value.length) {
    activeMenu.value = `${typeList.value[0].commentTypeId}-base`;
    const base = typeList.value[0].children.find((child: any) => child.isBase);
    selectedBaseComments.value = base ? base.comments : [];
  }
});
</script>

<template>
  <el-row class="con">
    <el-col :span="6">
      <div class="header-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <span class="h5">批语库分类</span>
        <el-button @click="editDialogVisible = true">修改分类名称</el-button>
        <el-button @click="deleteDialogVisible = true">删除分类</el-button>
      </div>
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo mt-4" @select="handleMenuSelect"
        text-color="#333" active-text-color="#51a7ff">
        <template v-if="typeList.length">
          <CategoryMenu v-for="item in typeList" :key="item.commentTypeId" :item="item" />
        </template>
        <template v-else>
          <el-menu-item disabled>暂无分类</el-menu-item>
        </template>
      </el-menu>
    </el-col>
    <el-col :span="18">
      <div class="header-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <span class="h5">批语库列表</span>
        <el-button @click="dialogVisible = true">新增批语</el-button>
        <el-dialog v-model="dialogVisible" title="添加批语" width="600">
          <div>
            <span>目标章节：</span>
            <el-input v-model="newComment" style="width: 80%" placeholder="请输入目标章节（如：第一章/第一节），若无该章节，则新建该章节" />
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
              <div class="list_item">{{ row }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog v-model="editDialogVisible" title="修改分类名称" width="600">
        <div class="dialog-row">
          <span class="dialog-label">原章节名称：</span>
          <el-input v-model="newComment" style="width: 80%" placeholder="请输入章节原名称（如：第一章/第一节）" />
        </div>
        <div class="dialog-row" style="margin-top: 20px;">
          <span class="dialog-label">目标章节名称：</span>
          <el-input v-model="newComment" style="width: 80%" placeholder="请输入修改名称" />
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="changeComment">
              修改
            </el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog v-model="deleteDialogVisible" title="删除分类" width="600">
        <div class="dialog-row" style="margin-top: 20px;">
          <span class="dialog-label">目标章节名称：</span>
          <el-input v-model="newComment" style="width: 80%" placeholder="请输入章节名称（如：第一章/第一节）" />
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="deleteComment">
              删除
            </el-button>
          </div>
        </template>
      </el-dialog>
      
      <div class="pagination" v-if="selectedBaseComments.length">
        <el-pagination background layout="prev, pager, next" :total="selectedBaseComments.length" />
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.con {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 80%;
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
  font-size: 18px;
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
  text-align: left;
  margin-right: 10px;
  color: #333;
}
</style>
