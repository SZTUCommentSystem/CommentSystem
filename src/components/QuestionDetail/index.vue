<script setup lang="ts">
import { ref } from 'vue';

const assignment = {
  title: '工程制图题目 1',
  dueDate: '2024-09-30',
  submissionFormat: 'PDF或CAD文件',
  description: `
    本次作业要求同学们绘制一个复杂的机械零件图。这项任务旨在测试你们的综合制图能力，包括对投影视图的掌握、
    对几何形状的理解以及标注的精确性。该机械零件包含多个小部件，需要同学们熟练运用AutoCAD等工具，并注意保持整体的结构比例。
    绘图过程中，要确保各视图之间的对应关系准确，尤其是正视图与俯视图的对齐问题。此外，还需要对零件的关键部位进行标注，
    包括但不限于孔径、圆角半径及螺纹细节。
  `,
  drawingRequirements: [
    '使用AutoCAD进行制图',
    '图纸尺寸为A3',
    '所有标注清晰可读'
  ],
  viewDirection: '正视图、俯视图、侧视图',
  drawingStandards: '符合国家标准 GB/T 14689-2008',
  technicalRequirements: [
    '图形比例为1:2',
    '允许误差不超过0.05mm'
  ],
  toolsAndMaterials: [
    'AutoCAD软件',
    '数字化绘图板',
    'A3打印纸'
  ],
  criteria: [
    '准确性（30%）',
    '完整性（30%）',
    '美观性（20%）',
    '使用的技术（20%）'
  ],
  notes: [
    '注意尺寸标注的正确性',
    '确保每个视图的完整性',
    '在图纸上标明使用的工具和材料'
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
    <h1 class="title">{{ assignment.title }}</h1>
    <div class="assignment-info">
      <p class="me-4 due-date">截止日期: {{ assignment.dueDate }}</p>
      <p class="submission-format">提交格式: {{ assignment.submissionFormat }}</p>
    </div>

    <h2 class="section-title">作业描述</h2>
    <p class="assignment-description">{{ assignment.description }}</p>

    <h2 class="section-title">作业要求</h2>
    <ul class="important-list">
      <li v-for="requirement in assignment.drawingRequirements" :key="requirement">{{ requirement }}</li>
    </ul>

    <h2 class="section-title">视图方向</h2>
    <p class="sub-info">{{ assignment.viewDirection }}</p>

    <h2 class="section-title">制图标准</h2>
    <p class="sub-info">{{ assignment.drawingStandards }}</p>

    <h2 class="section-title">技术要求</h2>
    <ul class="important-list">
      <li v-for="requirement in assignment.technicalRequirements" :key="requirement">{{ requirement }}</li>
    </ul>

    <h2 class="section-title">绘图工具和材料</h2>
    <ul class="sub-info">
      <li v-for="tool in assignment.toolsAndMaterials" :key="tool">{{ tool }}</li>
    </ul>

    <h2 class="section-title">评分标准</h2>
    <ul class="important-list">
      <li v-for="criteria in assignment.criteria" :key="criteria">{{ criteria }}</li>
    </ul>

    <h2 class="section-title">注意事项</h2>
    <ul class="sub-info">
      <li v-for="note in assignment.notes" :key="note">{{ note }}</li>
    </ul>

    <h2 class="section-title">参考资料</h2>
    <p class="sub-info">{{ assignment.references }}</p>

    <h2 class="section-title">上传作业</h2>
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
      <h2 class="feedback-title">提交反馈</h2>
      <p>{{ submissionResult }}</p>
    </div>
  </div>
</template>

<style scoped>
.assignment-detail {
  padding: 20px;
  background-color: #fff;
}

h1.title {
  font-size: 36px;
  margin-bottom: 20px;
  font-weight: bold;
}

.assignment-info {
  display: flex;
  margin-bottom: 20px;
}

p.due-date, p.submission-format {
  font-size: 16px;
  font-weight: bold;
}

h2.section-title {
  font-size: 24px;
  margin: 20px 0;
  font-weight: bold;
  color: #333;
}

p.assignment-description {
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 20px;
}

.important-list {
  font-size: 18px;
  margin-bottom: 20px;
}

p.sub-info {
  font-size: 14px;
  color: #666;
}

ul.sub-info {
  font-size: 14px;
  margin-bottom: 20px;
  color: #666;
}

.feedback-title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 30px;
}
</style>
