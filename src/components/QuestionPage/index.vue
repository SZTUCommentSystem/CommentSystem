<script setup lang="ts">

import type {ElPageHeader} from "element-plus";
import router from "@/router";
import {ref} from "vue";


const question = {
  title: '编程题1',
  type: '编程题',
  tags: ['tag1', 'tag2'],
  images: ['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',],
  description: '这是一道编程题.',
  comments: {
    分类A: ['你在这个项目中展现了极高的专业水平。', '继续保持！'],
    分类B: ['需要改进的地方有很多。', '请注意代码风格。']
  }
};
const commentsVisible = ref(true);

const categoryAVisible = ref(true);
const categoryBVisible = ref(true);

const categoryVisible = ref({
  categoryA: true,
  categoryB: true,
});

function toggleCategory(category: keyof typeof categoryVisible.value) {
  categoryVisible.value[category] = !categoryVisible.value[category];
}
</script>

<template>
  <div class="flex-container">
    <div class="header">
      <el-page-header @back="router.push('/home/question')" content="题目详情" title="返回" >
      </el-page-header>
    </div>

      <div class="question-detail" style="font-size: 18px">
        <h2>{{ question.title }}</h2>
        <el-descriptions>
          <el-descriptions-item label="题目类型：">编程题</el-descriptions-item>
          <el-descriptions-item label="难度：">3.5</el-descriptions-item>
          <el-descriptions-item label="章节：">第一章第二节：工程制图基础</el-descriptions-item>
          <el-descriptions-item label="标签：">
            <el-tag >Tag1</el-tag>
            <el-tag style="margin-left: 10px">Tag2</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <h3 class="question-description">题目描述：{{ question.description }}</h3>
        <div class="question-images">
          <el-image
              v-for="image in question.images"
              :src="image"
              :key="image"
              :alt="`Image for ${question.title}`"
              class="question-image-small"
              :preview-src-list="question.images" />
        </div>
        <div class="comment-header">
          <h3 class="question-description">设置批语:</h3>
          <el-button type="primary" @click="router.push('/home/question/questiondetail?itemId=1')">修改批语</el-button>
        </div>
        <div class="question-comments">
          <div v-for="(comments, category) in question.comments" :key="category" class="comment-category">
            <h6 style="color: gray;">{{ category }}</h6>
            <div>
              <p v-for="comment in comments" :key="comment">{{ comment }}</p>
            </div>
          </div>
        </div>
      </div>

  </div>
</template>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.header {
  font-size: 20px;
  background-color: white;
  padding: 10px;
}
.question-detail {
  background-color: #fff;
  padding: 20px;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
}

.question-description {
  font-size: 20px;
  line-height: 1.5;
  margin: 10px 0;
}
.question-image-small {
  width: 275px;
  height: 225px;
  object-fit: cover;
}

.comment-category{
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  padding:15px;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>