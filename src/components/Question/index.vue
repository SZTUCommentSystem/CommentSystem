<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // 引入useRouter钩子
import { ElTable, ElTableColumn, ElSelect, ElOption, ElInput } from 'element-plus';
import Edit from "@/components/icons/question/edit.vue";
import Delete from "@/components/icons/question/delete.vue";
import Comment from "@/components/icons/question/comment.vue";
import { Search } from '@element-plus/icons-vue';
import { zhCn } from "element-plus/es/locale/index.mjs";

const router = useRouter(); // 使用路由实例

// 分页相关的状态
const currentPage = ref(1); // 当前页码
const pageSize = ref(20); // 每页显示的题目数量

// 模拟题目数据
const questionList = ref([

  { id: 1, content: '编写一个函数，计算斐波那契数列的第 N 项', type: '编程题' },
  { id: 2, content: '请设计一个简单的在线购物车系统', type: '编程题' },
  { id: 3, content: '绘制一张直线图，显示2019年到2023年的销售数据', type: '工程制图' },
  { id: 4, content: '实现一个基本的图书管理系统', type: '编程题' },
  { id: 5, content: '请解释什么是链表，并实现一个简单的链表', type: '编程题' },
  { id: 6, content: '设计一个流程图，描述用户注册的流程', type: '工程制图' },
  { id: 7, content: '编写代码，实现一个简单的排序算法', type: '编程题' },
  { id: 8, content: '请设计一个图形界面，用于管理学生信息', type: '工程制图' },
  { id: 9, content: '创建一个数据库模型，存储员工信息', type: '工程设计' },
  { id: 10, content: '实现一个简单的 HTTP 请求库', type: '编程题' },
  { id: 11, content: '请解释深度优先搜索和广度优先搜索的区别', type: '编程题' },
  { id: 12, content: '绘制一个 UML 类图，表示图书借阅系统', type: '工程制图' },
  { id: 13, content: '编写一个程序，验证给定字符串是否是回文', type: '编程题' },
  { id: 14, content: '设计一个数据可视化仪表板，展示关键业务指标', type: '工程制图' },
  { id: 15, content: '请实现一个简单的聊天应用', type: '编程题' },
  { id: 16, content: '绘制一个流程图，描述在线支付的过程', type: '工程制图' },
  { id: 17, content: '编写代码，创建一个 RESTful API', type: '编程题' },
  { id: 18, content: '请设计一个房屋租赁管理系统', type: '工程设计' },
  { id: 19, content: '实现一个简单的文件上传功能', type: '编程题' },
  { id: 20, content: '请绘制一个网络拓扑图，展示网络结构', type: '工程制图' },
  { id: 21, content: '编写代码，统计文本文件中单词的出现频率', type: '编程题' },
  { id: 22, content: '请设计一个食品订单管理系统', type: '工程设计' },
  { id: 23, content: '实现一个简单的计时器应用', type: '编程题' },
  { id: 24, content: '绘制一个电路图，表示简单的电路连接', type: '工程制图' },
  { id: 25, content: '编写一个程序，实现 Caesar 加密算法', type: '编程题' },
  { id: 26, content: '设计一个社区论坛系统', type: '工程设计' },
  { id: 27, content: '实现一个基于用户的推荐系统', type: '编程题' },
  { id: 28, content: '绘制一个甘特图，展示项目进度', type: '工程制图' },
  { id: 29, content: '编写代码，生成随机密码', type: '编程题' },
  { id: 30, content: '请设计一个在线课程管理平台', type: '工程设计' },
  { id: 31, content: '请实现一个选择排序算法，说明其时间复杂度', type: '编程题' },
  { id: 32, content: '根据需求分析，设计一个简单的博客系统', type: '工程设计' },
  { id: 33, content: '判断以下代码片段的输出结果是什么', type: '判断题' },
  { id: 34, content: '请绘制一个流程图，描述图书借阅的流程', type: '工程制图' },
  { id: 35, content: '编写一个程序，计算给定数组的最大值', type: '编程题' },
  { id: 36, content: '实现一个简易的登录系统', type: '编程题' },
  { id: 37, content: '请解释什么是栈，举例说明其应用', type: '填空题' },
  { id: 38, content: '设计一个简单的天气预报系统', type: '工程设计' },
  { id: 39, content: '绘制一张显示不同区域气温变化的图表', type: '工程制图' },
  { id: 40, content: '判断以下陈述的真伪：所有人都需要食物', type: '判断题' },
  { id: 41, content: '请设计一个简单的计算器', type: '编程题' },
  { id: 42, content: '编写代码，模拟一个简单的银行账户', type: '编程题' },
  { id: 43, content: '判断以下代码的时间复杂度：O(n^2)', type: '判断题' },
  { id: 44, content: '绘制一个展示不同类别销售数据的柱状图', type: '工程制图' },
  { id: 45, content: '实现一个简单的字符串反转功能', type: '编程题' },
  { id: 46, content: '请解释什么是面向对象编程', type: '填空题' },
  { id: 47, content: '设计一个简易的任务管理系统', type: '工程设计' },
  { id: 48, content: '编写代码，计算给定字符串中的元音字母数量', type: '编程题' },
  { id: 49, content: '判断以下代码片段是否会抛出异常', type: '判断题' },
  { id: 50, content: '请绘制一个表示项目时间线的甘特图', type: '工程制图' }
]);

const selectedType = ref('');
const searchQuery = ref('');

// 过滤后的题目列表
const filteredQuestions = computed(() => {
  return questionList.value.filter(question => {
    const matchesType = selectedType.value ? question.type === selectedType.value : true;
    const matchesSearch = question.content.includes(searchQuery.value);
    return matchesType && matchesSearch;
  });
});

// 计算当前页显示的题目（基于过滤后的题目）
const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredQuestions.value.slice(start, end);
});

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
};

// 处理行点击事件，跳转到对应题目详情页
const handleRowClick = (row: any) => {
  router.push(`/home/question/${row.id}`); // 跳转到对应的题目详情页，基于题目ID
};
</script>

<template>
  <div class="question-bank">
    <div class="filter-container">
      <el-select v-model="selectedType" placeholder="选择题目类型" style="margin-right: 10px; width: 200px;">
        <el-option label="全部" value=""></el-option>
        <el-option label="选择题" value="选择题"></el-option>
        <el-option label="填空题" value="填空题"></el-option>
        <el-option label="判断题" value="判断题"></el-option>
        <el-option label="编程题" value="编程题"></el-option>
        <el-option label="工程制图" value="工程制图"></el-option>
        <el-option label="工程设计" value="工程设计"></el-option>
      </el-select>

      <el-input v-model="searchQuery" placeholder="搜索题目" style="width: 200px; font-size: 15px" :prefix-icon="Search"/>
    </div>

    <!-- 题目列表展示 -->
    <ElTable :data="paginatedQuestions" stripe @row-click="handleRowClick" style="cursor: pointer;">
      <ElTableColumn label="序号" type="index" width="100" />
      <ElTableColumn prop="type" label="题目类型" width="150" />
      <ElTableColumn prop="content" label="题目" />
      <ElTableColumn label="操作" width="200">
        <template #default="scope">
          <div class="icon-container" style="display: flex; align-items: center;">
            <RouterLink :to="`/edit-question/${scope.row.id}`" @click.stop>
              <Edit class="icon" style="margin-right: 20px;" />
            </RouterLink>
            <RouterLink :to="`/comment-library/${scope.row.id}`" @click.stop>
              <Comment class="icon" style="margin-right: 23px;" />
            </RouterLink>
            <div style="margin-right: 20px">
              <Delete class="icon" @click.stop />
            </div>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>

    <!-- 分页器 -->
    <div class="paging mt-4" style="display: flex;justify-content: flex-end;">
      <el-config-provider :locale="zhCn">
        <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="filteredQuestions.length"
            background
            layout="total, prev, pager, next, sizes, jumper"
            :page-sizes="[5, 10, 20, 30]"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
        />
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
  opacity: 0.3; /* 默认透明度 */
  transition: opacity 0.3s; /* 添加过渡效果 */
}
.icon-container:hover .icon {
  opacity: 1; /* 鼠标悬停时变为不透明 */
}
</style>
