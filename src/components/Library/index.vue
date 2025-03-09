<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import { ElMenu, ElMenuItem, ElMenuItemGroup, ElSubMenu } from 'element-plus';
import Edit from "@/components/icons/library/edit.vue";
import { json } from 'stream/consumers';


const props = defineProps();
const emit = defineEmits();

const tableData = ref([
  '你在工程制图的基础学习中展现了扎实的理解能力。',
  '你对国家制图标准的掌握令人印象深刻。',
  '你的图纸绘制展现了很高的专业水平和细致态度。',
  '很高兴看到你在几何作图中的精准表现。',
  '你的投影图绘制非常规范且有条理。',
  '你对工程制图中字体和比例的应用非常熟练。',
  '你的细心使得尺寸标注清晰易懂，值得表扬。',
  '你的创造性思维在辅助视图的表达中得到了体现。',
  '在几何作图中，你展现了极高的逻辑分析能力。',
  '你对剖视图和断面图的掌握展示了深刻的理解。',
  '你的作图技巧展示了对投影法基础的深度掌握。',
  '你的三视图绘制清晰明了，结构表达准确。',
  '你在图纸种类与幅面的运用上非常熟练，值得肯定。',
  '你对图线和字体的规范使用展现了很高的工程制图素养。',
  '你的轴测图绘制非常出色，表现了良好的空间想象能力。',
  '你在表达形体结构方面展现了很高的技术水平。',
]);


const isHovered = ref(false);

const handleMouseEnter = () => {
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
};

const handleOpen = (key: any, keyPath: any) => {
  console.log(key, keyPath);
};

const handleClose = (key: any, keyPath: any) => {
  console.log(key, keyPath);
};

const currentPage = ref(1);

//对话框状态
const dialogVisible = ref(false)

//临时选择数据
const options = [
  {
    value: 'basics',
    label: '工程制图基础',
    children: [
      { value: 'definition_usage', label: '工程制图的定义与用途' },
      { value: 'standards', label: '国家制图标准简介' },
      { value: 'paper_types', label: '图纸种类与幅面' },
      { value: 'lines_fonts', label: '图线、字体、比例及尺寸标注' },
    ],
  },
  {
    value: 'geometry',
    label: '几何作图',
    children: [
      { value: 'projection_views', label: '投影法与视图表达' },
      { value: 'relative_position', label: '平面与直线的相对位置' },
      { value: 'projection_relationships', label: '点、直线、平面的投影关系' },
    ],
  },
  {
    value: 'projection_theory',
    label: '投影理论',
    children: [
      { value: 'three_projection', label: '三面正投影法' },
      { value: 'main_views', label: '主视图、俯视图、侧视图的形成与应用' },
      { value: 'auxiliary_section_views', label: '辅助视图与剖视图' },
    ],
  },
  {
    value: 'composite_views',
    label: '组合体视图',
    children: [
      { value: 'drawing_composite', label: '组合体的三视图绘制' },
      { value: 'shape_analysis', label: '形体分析与结构表达' },
      { value: 'simple_parts', label: '简单零件的表达与标注' },
    ],
  },
  {
    value: 'section_views',
    label: '剖面图与断面图',
    children: [
      { value: 'definition_types', label: '剖面图的定义与分类' },
      { value: 'section_lines', label: '剖面线的表示方法' },
      { value: 'break_views', label: '断面图的定义与用途' },
    ],
  },
  {
    value: 'isometric_drawing',
    label: '轴测图',
    children: [
      { value: 'isometric_projection', label: '轴测投影法及其特点' },
      { value: 'types', label: '常见轴测图类型' },
      { value: 'techniques', label: '轴测图的绘制技巧' },
    ],
  },
  {
    value: 'standard_parts',
    label: '标准件与常用件',
    children: [
      { value: 'common_parts', label: '常用标准件' },
      { value: 'representation', label: '标准件的表示与画法' },
      { value: 'mechanical_parts', label: '常用机械零件图解' },
    ],
  },
  {
    value: 'part_drawing',
    label: '零件图',
    children: [
      { value: 'requirements', label: '零件图的基本要求' },
      { value: 'tolerances', label: '技术要求及公差标注' },
      { value: 'geometric_tolerance', label: '形位公差的表示' },
    ],
  },
  {
    value: 'assembly_drawing',
    label: '装配图',
    children: [
      { value: 'features', label: '装配图的特点与用途' },
      { value: 'relationships', label: '装配关系的表达与分析' },
      { value: 'conversion', label: '装配图与零件图的相互转换' },
    ],
  },
  {
    value: 'cad',
    label: '计算机辅助制图',
    children: [
      { value: 'basics', label: 'CAD基础知识' },
      { value: 'operations', label: 'CAD的基本操作与应用' },
      { value: 'simple_drawing', label: '使用CAD绘制简单工程图' },
    ],
  },
  {
    value: 'practice',
    label: '课程设计与实训',
    children: [
      { value: 'comprehensive_design', label: '综合设计任务' },
      { value: 'case_analysis', label: '工程图绘制案例分析' },
      { value: 'project_practice', label: '项目制实践与成果展示' },
    ],
  },
];
//输入框内容
const newComment = ref('');
//添加批语库列表内容
const addComment = () => {
  if (newComment.value.trim()) {
    tableData.value.push(newComment.value.trim());
    newComment.value = '';
  }
  dialogVisible.value = false;
};

</script>

<template>


  <el-row class="con">
    <el-col :span="6">
      <div class="header-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <span class="h5">批语库分类</span>

      </div>
      <el-menu default-active="1" class="el-menu-vertical-demo mt-4" @open="handleOpen" @close="handleClose"
        text-color="#333" active-text-color="#51a7ff">

        <ElMenu default-active="1-1" class="el-menu-vertical-demo">
          <!-- 工程制图基础 -->
          <ElSubMenu index="1">
            <template #title>
              <span class="span">工程制图基础</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">工程制图的定义与用途</el-menu-item>
              <el-menu-item index="1-2">国家制图标准简介</el-menu-item>
              <el-menu-item index="1-3">图纸种类与幅面</el-menu-item>
              <el-menu-item index="1-4">图线、字体、比例及尺寸标注</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 几何作图 -->
          <ElSubMenu index="2">
            <template #title>
              <span class="span">几何作图</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">投影法与视图表达</el-menu-item>
              <el-menu-item index="2-2">平面与直线的相对位置</el-menu-item>
              <el-menu-item index="2-3">点、直线、平面的投影关系</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 投影理论 -->
          <ElSubMenu index="3">
            <template #title>
              <span class="span">投影理论</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">三面正投影法</el-menu-item>
              <el-menu-item index="3-2">主、俯、侧视图的形成与应用</el-menu-item>
              <el-menu-item index="3-3">辅助视图与剖视图</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 组合体视图 -->
          <ElSubMenu index="4">
            <template #title>
              <span class="span">组合体视图</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">组合体的三视图绘制</el-menu-item>
              <el-menu-item index="4-2">形体分析与结构表达</el-menu-item>
              <el-menu-item index="4-3">简单零件的表达与标注</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 剖面图与断面图 -->
          <ElSubMenu index="5">
            <template #title>
              <span class="span">剖面图与断面图</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">剖面图的定义与分类</el-menu-item>
              <el-menu-item index="5-2">剖面线的表示方法</el-menu-item>
              <el-menu-item index="5-3">断面图的定义与用途</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 轴测图 -->
          <ElSubMenu index="6">
            <template #title>
              <span class="span">轴测图</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="6-1">轴测投影法及其特点</el-menu-item>
              <el-menu-item index="6-2">常见轴测图类型</el-menu-item>
              <el-menu-item index="6-3">轴测图的绘制技巧</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 标准件与常用件 -->
          <ElSubMenu index="7">
            <template #title>
              <span class="span">标准件与常用件</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="7-1">常用标准件</el-menu-item>
              <el-menu-item index="7-2">标准件的表示与画法</el-menu-item>
              <el-menu-item index="7-3">常用机械零件图解</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 零件图 -->
          <ElSubMenu index="8">
            <template #title>
              <span class="span">零件图</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="8-1">零件图的基本要求</el-menu-item>
              <el-menu-item index="8-2">技术要求及公差标注</el-menu-item>
              <el-menu-item index="8-3">形位公差的表示</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 装配图 -->
          <ElSubMenu index="9">
            <template #title>
              <span class="span">装配图</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="9-1">装配图的特点与用途</el-menu-item>
              <el-menu-item index="9-2">装配关系的表达与分析</el-menu-item>
              <el-menu-item index="9-3">装配图与零件图的相互转换</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 计算机辅助制图 -->
          <ElSubMenu index="10">
            <template #title>
              <span class="span">计算机辅助制图</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="10-1">CAD基础知识</el-menu-item>
              <el-menu-item index="10-2">CAD的基本操作与应用</el-menu-item>
              <el-menu-item index="10-3">使用CAD绘制简单工程图</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>

          <!-- 课程设计与实训 -->
          <ElSubMenu index="11">
            <template #title>
              <span class="span">课程设计与实训</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="11-1">综合设计任务</el-menu-item>
              <el-menu-item index="11-2">工程图绘制案例分析</el-menu-item>
              <el-menu-item index="11-3">项目制实践与成果展示</el-menu-item>
            </el-menu-item-group>
          </ElSubMenu>
        </ElMenu>


      </el-menu>
    </el-col>
    <el-col :span="18">
      <div class="header-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <span class="h5">批语库列表</span>
        <edit class="pb-2 me-5 edit-icon" :style="{ opacity: isHovered ? 1 : 0.3, transition: 'opacity 0.3s ease' }"
          @click="dialogVisible = true">
        </edit>
        <el-dialog v-model="dialogVisible" title="添加批语列表" width="1000">
          <div class="mb-4">
            <span>选择批语章节：</span>
            <el-cascader :options="options" clearable placeholder="选择" />
          </div>
          <div>
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
        <el-table :data="tableData" style="width: 100%">
          <el-table-column>
            <template #default="{ row }">
              <div class="list_item">{{ row }}</div>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="100" />
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
</style>
