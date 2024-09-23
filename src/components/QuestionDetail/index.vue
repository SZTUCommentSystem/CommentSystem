<script setup lang="ts">
import { ref } from 'vue';

const assignment = {
  title: '工程制图作业 1',
  dueDate: '2024-09-30',
  submissionFormat: 'PDF或CAD文件',
  description: '请绘制给定的机械零件图，并提供详细的标注。',
  requirements: [
    '使用AutoCAD进行制图',
    '图纸尺寸为A3',
    '所有标注清晰可读'
  ],
  criteria: [
    '准确性（30%）',
    '完整性（30%）',
    '美观性（20%）',
    '使用的技术（20%）'
  ],
  references: '《工程制图基础》, 在线课程链接',
};

const uploadUrl = '/api/upload'; // 伪代码，替换为实际上传URL
const submissionResult = ref('');

const handleSuccess = (response:any) => {
  submissionResult.value = '作业提交成功！';
};

const handleError = (error:any) => {
  submissionResult.value = '提交失败，请重试。';
};
</script>

<template>
  <div class="assignment-detail">
    <h1>{{ assignment.title }}</h1>
    <div class="assignment-info">
      <p class="me-4">截止日期: {{ assignment.dueDate }}</p>
      <p>提交格式: {{ assignment.submissionFormat }}</p>
    </div>

    <h2>作业描述</h2>
    <p>{{ assignment.description }}</p>

    <h2>作业要求</h2>
    <ul>
      <li v-for="requirement in assignment.requirements" :key="requirement" class="line-item">{{ requirement }}</li>
    </ul>

    <h2>评分标准</h2>
    <ul>
      <li v-for="criteria in assignment.criteria" :key="criteria" class="line-item">{{ criteria }}</li>
    </ul>

    <h2>参考资料</h2>
    <p>{{ assignment.references }}</p>

    <h2>上传作业</h2>
    <el-upload
        class="upload-demo"
        drag
        multiple
        :action="uploadUrl"
        :on-success="handleSuccess"
        :on-error="handleError"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<span class="el-upload__link">点击上传</span></div>
    </el-upload>

    <div class="submission-feedback" v-if="submissionResult">
      <h2>提交反馈</h2>
      <p>{{ submissionResult }}</p>
    </div>
  </div>
</template>

<style scoped>
.assignment-detail {
  padding: 20px;
  background-color: #fff;
}

h1 {
  font-size: 40px;
  margin-bottom: 10px;
  font-weight: bold;
}

.assignment-info {
  display: flex;
  margin-bottom: 20px;
}

.line-item {
  position: relative;
  padding-left: 10px; /* 给文本留出一些空间 */
  margin-bottom: 10px; /* 行间距 */
}

.line-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px; /* 细线宽度 */
  height: 100%; /* 细线高度 */
  background-color: #ccc; /* 细线颜色 */
  border-radius: 10px;
}
</style>

