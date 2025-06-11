<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElTable, ElTableColumn, ElSelect, ElOption, ElInput } from 'element-plus';
import Edit from "@/components/icons/question/edit.vue";
import Delete from "@/components/icons/question/delete.vue";
import { Search } from '@element-plus/icons-vue';
import { zhCn } from "element-plus/es/locale/index.mjs";
import QuestionListDisplay from "@/hooks/QuestionHooks/QuestionListDisplay";

const router = useRouter();
const route = useRoute();

const {
  state,
  questionTypeList,
  getList,
  getTypeList,
  handleDel,
  getLabelById,
  filteredQuestions,
  paginatedQuestions,
  handlePageChange,
  handlePageSizeChange,
} = QuestionListDisplay();

const getTypeName = (typeId: number) => {
  return questionTypeList.value.find(item => item.topicTypeId == typeId)?.topicTypeName;
};

onMounted(() => {
  getList();
  getTypeList();
});

watch(
  () => route.query.forceRefresh,
  () => {
    getList();
  }
)
</script>

<template>
  <div class="question-bank">
    <div class="filter-container">
      <el-select v-model="state.selectedType" placeholder="选择题目类型" style="margin-right: 10px; width: 200px;">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="(item, index) in questionTypeList" :key="index" :label="item.topicTypeName"
          :value="item.topicTypeId"></el-option>
      </el-select>

      <el-input v-model="state.searchQuery" placeholder="搜索题目" style="width: 200px; font-size: 15px"
        :prefix-icon="Search" />
      <el-input v-model="state.searchTag" placeholder="搜索标签" style="width: 200px; font-size: 15px; margin-left: 10px;"
        :prefix-icon="Search" />
      <el-button type="primary" style="margin-left: 10px;"
        @click="router.push('/home/question/questioncreate')">创建题目</el-button>
    </div>

    <!-- 题目列表展示 -->
    <ElTable :data="paginatedQuestions" stripe>
      <ElTableColumn label="序号" type="index" width="100" />
      <ElTableColumn prop="topicTypeId" label="题目类型" width="150">
        <template #default="{ row }">
          <div style="display: flex; gap: 10px;">
            {{ getTypeName(row.topicTypeId) }}
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="topicTitle" label="题目" width="450" />
      <ElTableColumn prop="labelIds" label="标签">
        <template #default="{ row }">
          <div style="display: flex; gap: 10px;">
            <el-tag
              v-for="tag in (row.labelIds ? row.labelIds.split(',').map(Number) : [])"
              :key="tag"
              round
              effect="plain"
            >
              {{ getLabelById(tag) }}
            </el-tag>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="200">
        <template #default="scope">
          <div class="icon-container" style="display: flex; align-items: center;">
            <RouterLink :to="{ name: 'questiondetail', query: { itemId: scope.row.topicId } }" @click.stop>
              <Edit class="icon" style="margin-right: 20px;" />
            </RouterLink>
            <div style="margin-right: 20px; cursor: pointer;">
              <Delete class="icon" @click="handleDel($event, scope.row.topicId)" />
            </div>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>

    <!-- 分页器 -->
    <div class="paging mt-4" style="display: flex;justify-content: flex-end;">
      <el-config-provider :locale="zhCn">
        <el-pagination :total="filteredQuestions.length" background layout="total, prev, pager, next, sizes, jumper"
          :page-sizes="[5, 10, 20, 30]" @size-change="handlePageSizeChange" @current-change="handlePageChange" />
      </el-config-provider>
    </div>
  </div>
</template>

<style scoped>
* {
  font-size: 18px;
}

.question-bank {
  background-color: #fff;
  padding: 20px;
}

.filter-container {
  display: flex;
  margin-bottom: 10px;
}

.icon {
  opacity: 0.3;
  /* 默认透明度 */
  transition: opacity 0.3s;
  /* 添加过渡效果 */
}

.icon-container:hover .icon {
  opacity: 1;
  /* 鼠标悬停时变为不透明 */
}
</style>
