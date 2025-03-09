<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import type { ElPageHeader, UploadProps, UploadUserFile } from 'element-plus'

// 导入编辑器
import EditorMarkdown from '@/components/Generic/Editor.vue'

// 导入提交接口
import { submitQuestionAPI } from '@/api/QuestionAPI/questionList'

const questionContent = reactive({
    title: '',
    type: '',
    tags: ['标签1', '标签2'],
    imgs: [],
    description: '',
    displayComments: [
        '你在这个项目中展现了极高的专业水平。',
        '你的思考方式为大家打开了新的视野。',
    ],
})

// 上传图片
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

const beforeUpload = (file) => {
    // 阻止自动上传
    return false
}


// 标签
const handleCloseTag = (tag: string) => {
    questionContent.tags.splice(questionContent.tags.indexOf(tag), 1)
}

// 批语
const handleCloseComment = (comment: string) => {
    questionContent.displayComments.splice(questionContent.displayComments.indexOf(comment), 1)
}

// 提交
const submitQuestion = async () => {
    try {
        const res = await submitQuestionAPI(questionContent)
        console.log(res)
    } catch (error) {
        console.error('提交题目失败:', error)
    }
}
</script>

<template>
    <div class="create-wrapper">
        <div class="header">
            <el-page-header @back="this.$router.push('/home/question')" content="创建题目" title="返回">
            </el-page-header>
        </div>
        <div class="create-title-top">
            <div class="left">
                <div class="create-list">
                    <p>题目批语：</p>
                    <el-tag v-for="comment in questionContent.displayComments" :key="comment" effect="plain" closable
                        @close="handleCloseComment" class="comment-tag">
                        {{ comment }}
                    </el-tag>
                    <el-button type="primary" plain style="border-radius: 20px; margin-top: 10px;">+ 添加</el-button>
                </div>
            </div>
            <div class="right">
                <div class="create-list">
                    <p>标题：</p>
                    <input type="text" v-model="questionContent.title" placeholder="请输入题目标题" />
                </div>
                <div class="create-list">
                    <p>题目类型：</p>
                    <input type="text" v-model="questionContent.type" placeholder="请输入题目类型" />
                </div>
                <div class="create-list">
                    <p>题目标签：</p>
                    <div class="tag">
                        <el-tag v-for="tag in questionContent.tags" :key="tag" type="primary" effect="plain" round
                            size="large" closable @close="handleCloseTag(tag)">{{ tag }}</el-tag>
                        <el-button type="primary" plain style="border-radius: 20px; ">+ 添加</el-button>
                    </div>
                </div>
                <div class="create-list">
                    <p>作业相关图片：</p>
                    <el-upload ref="upload" v-model:file-list="questionContent.imgs"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" list-type="picture-card"
                        :auto-upload="false" :before-upload="beforeUpload" :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>

                    <el-dialog v-model="dialogVisible">
                        <img w-full :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
                </div>
                <div class="create-list">
                    <p>题目描述（可选）：</p>
                    <editor-markdown v-model="questionContent.description"></editor-markdown>
                </div>
            </div>
        </div>

        <div class="button_submit">
            <el-button type="primary" @click="submitQuestion">提交</el-button>
            <router-link to="/home/question">
                <el-button>取消</el-button>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.create-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

}

.header {
    font-size: 20px;
    background-color: white;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px
}

.create-title-top {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;


    .left,
    .right {
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        background-color: #fff;
        width: 50%;
    }


    .right {
        width: 50%;
        margin-left: 10px;
    }

    p {
        margin: 0;
        font-size: 18px;
        margin-bottom: 10px;
    }

    input {
        display: inline-block;
        width: 100%;
        height: 45px;
        padding-left: 10px;
        border: 1px solid #ccc;
        border-radius: 10px;

        &:focus {
            outline: none;
        }
    }
}

.create-list {
    display: flex;
    /* 纵向排列 */
    flex-direction: column;
    /* 向左对齐 */
    align-items: flex-start;
    width: 100%;
    height: 98px;
    margin-bottom: 5px;
    padding: 10px 20px;
    background-color: #fff;

    p {
        margin: 0;
        font-size: 18px;
        margin-bottom: 10px;
    }

    input {
        display: inline-block;
        width: 100%;
        height: 45px;
        margin-top: 5px;
        padding-left: 10px;
        border: 1px solid #ccc;
        border-radius: 10px;

        &:focus {
            outline: none;
        }
    }
}

.create-list {
    height: auto;
}

.button_submit {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-right: 15px;

    button {
        margin-left: 10px;
        padding: 0 35px;
    }
}

.tag {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.comment-tag {
    font-size: 18px;
    margin: 10px 0;
    padding-bottom: 5px;
    color: #000;
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid #000;
}
</style>