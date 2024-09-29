<script lang="ts" setup>
import {defineProps, defineEmits, ref} from 'vue';
import { ElMenu, ElMenuItem, ElMenuItemGroup,ElSubMenu } from 'element-plus';
import Edit from "@/components/icons/library/edit.vue";


const props = defineProps();
const emit = defineEmits();

const tableData = ref([
  '你在这个项目中展现了极高的专业水平。',
  '你的创造力和想象力让人刮目相看。',
  '这次的工作展示了你出色的团队合作能力。',
  '很高兴看到你对这项工作的热情和投入。',
  '你的成果是对自己努力最好的证明。',
  '你的观点启发了同学们的思考，值得鼓励。',
  '你在作业中展现的细致程度非常令人印象深刻。',
  '你的积极态度对班级的气氛产生了良好的影响。',
  '在这一项目中，你的组织能力得到了充分体现。',
  '感谢你在讨论中提供的深刻见解，真的很有帮助。',
  '你在课题中展示了优秀的解决问题能力。',
  '你的努力为团队带来了积极的影响。',
  '你的工作质量超出了我们的预期。',
  '你的表现使得整个团队受益匪浅。',
  '你的思考方式为大家打开了新的视野。',
  '你在活动中的投入让人感到非常欣慰。',
]);

const isHovered = ref(false);

const handleMouseEnter = () => {
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
};

const handleOpen = (key:any, keyPath:any) => {
  console.log(key, keyPath);
};

const handleClose = (key:any, keyPath:any) => {
  console.log(key, keyPath);
};

const currentPage = ref(1);

</script>

<template >


  <el-row class="con">
    <el-col :span="3">
      <div class="header-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <span class="h5 ms-5">批语库分类</span>
        <edit class="pb-2 me-3 edit-icon " :style="{ opacity: isHovered ? 1 : 0.3,transition: 'opacity 0.3s ease' }"></edit>
      </div>
      <el-menu
          default-active="1"
          class="el-menu-vertical-demo mt-4"
          @open="handleOpen"
          @close="handleClose"
          text-color="#333"
          active-text-color="#51a7ff">

        <ElSubMenu index="1">
          <template #title>

            <span class="span">正面评价</span>
          </template>
          <el-menu-item-group>

            <el-menu-item index="1-1">表现优秀</el-menu-item>
            <el-menu-item index="1-2">思路清晰</el-menu-item>
            <el-menu-item index="1-3">积极参与</el-menu-item>
            <el-menu-item index="1-4">团队合作</el-menu-item>
            <el-menu-item index="1-5">创造性思维</el-menu-item>
            <el-menu-item index="1-6">独立思考</el-menu-item>
          </el-menu-item-group>
        </ElSubMenu>

        <ElSubMenu index="2">
          <template #title>

            <span class="span">改进建议</span>
          </template>
          <el-menu-item-group>

            <el-menu-item index="2-1">技术改进</el-menu-item>
            <el-menu-item index="2-2">表达改进</el-menu-item>
            <el-menu-item index="2-3">格式改进</el-menu-item>
            <el-menu-item index="2-4">内容深度</el-menu-item>
            <el-menu-item index="2-5">时间管理</el-menu-item>
            <el-menu-item index="2-6">数据支持</el-menu-item>
          </el-menu-item-group>
        </ElSubMenu>

        <ElSubMenu index="3">
          <template #title>

            <span class="span">错误纠正</span>
          </template>
          <el-menu-item-group>

            <el-menu-item index="3-1">概念错误</el-menu-item>
            <el-menu-item index="3-2">计算错误</el-menu-item>
            <el-menu-item index="3-3">语法错误</el-menu-item>
            <el-menu-item index="3-4">逻辑错误</el-menu-item>
            <el-menu-item index="3-5">引用错误</el-menu-item>
            <el-menu-item index="3-6">细节遗漏</el-menu-item>
          </el-menu-item-group>
        </ElSubMenu>

        <ElSubMenu index="4">
          <template #title>

            <span class="span">鼓励性反馈</span>
          </template>
          <el-menu-item-group>

            <el-menu-item index="4-1">努力学习</el-menu-item>
            <el-menu-item index="4-2">勇于尝试</el-menu-item>
            <el-menu-item index="4-3">持续进步</el-menu-item>
            <el-menu-item index="4-4">自我激励</el-menu-item>
            <el-menu-item index="4-5">积极心态</el-menu-item>
          </el-menu-item-group>
        </ElSubMenu>

        <ElSubMenu index="5">
          <template #title>

            <span class="span">内容建议</span>
          </template>
          <el-menu-item-group>

            <el-menu-item index="5-1">资料丰富性</el-menu-item>
            <el-menu-item index="5-2">逻辑结构</el-menu-item>
            <el-menu-item index="5-3">信息准确性</el-menu-item>
            <el-menu-item index="5-4">论据支持</el-menu-item>
            <el-menu-item index="5-5">案例引用</el-menu-item>
          </el-menu-item-group>
        </ElSubMenu>

        <ElSubMenu index="6">
          <template #title>

            <span class="span">情感支持</span>
          </template>
          <el-menu-item-group>

            <el-menu-item index="6-1">信心增强</el-menu-item>
            <el-menu-item index="6-2">减轻压力</el-menu-item>
            <el-menu-item index="6-3">情绪管理</el-menu-item>
            <el-menu-item index="6-4">正向引导</el-menu-item>
            <el-menu-item index="6-5">鼓励分享</el-menu-item>
          </el-menu-item-group>
        </ElSubMenu>

        <ElSubMenu index="7">
          <template #title>

            <span class="span">沟通技巧</span>
          </template>
          <el-menu-item-group>

            <el-menu-item index="7-1">听取反馈</el-menu-item>
            <el-menu-item index="7-2">表达清晰</el-menu-item>
            <el-menu-item index="7-3">互动积极</el-menu-item>
            <el-menu-item index="7-4">提问技巧</el-menu-item>
            <el-menu-item index="7-5">倾听能力</el-menu-item>
          </el-menu-item-group>
        </ElSubMenu>

      </el-menu>
    </el-col>
    <el-col :span="21">
      <div class="header-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <span class="h5">批语库列表</span>
        <edit class="pb-2 me-5 edit-icon" :style="{ opacity: isHovered ? 1 : 0.3,transition: 'opacity 0.3s ease' }"></edit>
      </div>
      <div class="right-container">
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column >
            <template #default="{ row }">
              <div class="list_item">{{ row }}</div>
            </template>
          </el-table-column>
        </el-table>

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
  width: 80%; /* 设置宽度为80% */
  margin: 0 auto;
  text-align: center;
}

.header-container {
  display: flex; /* 使用 Flexbox */
  justify-content: space-between; /* 元素两端对齐 */
  align-items: center; /* 垂直居中 */

}

.h5 {
  flex: 1; /* 使文字占满可用空间 */
  text-align: center; /* 使文字居中 */
}

.right-container {
  display: flex;
  justify-content: center; /* 使列表居中 */
}



.right-container {
  padding: 0 20px; /* 内边距 */
  margin: 10px;
}

.el-menu .el-submenu  {
  .span {
    font-size: 24px;
  }
  font-size: 16px; /* 调整标题字体大小 */
}


.el-menu  {
  .el-menu-item{
    font-size: 18px; /* 调整菜单项字体大小 */
  }

}
.span {
  font-size: 20px;
}
.list_item {
  font-size: 18px;
}

.edit-icon {
  cursor: pointer; /* 设置鼠标样式为指针 */
}

</style>
