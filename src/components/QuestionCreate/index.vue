<script lang="ts" setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps, UploadUserFile } from 'element-plus'

// 导入编辑器
import EditorMarkdown from '@/components/Generic/Editor.vue'
const markdownContent = ref()

const fileList = ref<UploadUserFile[]>([
    {
        name: 'food.jpg',
        url: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
    },
    {
        name: 'test.jpg',
        url: 'src/assets/img/便签.png',
    }
])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
</script>

<template>
    <div class="create-wrapper">
        <h2 style="margin-bottom: 10px;">新建题目</h2>
        <div class="create_title">
            <p>标题：</p>
            <input type="text" placeholder="请输入题目标题" />
        </div>
        <div class="create_list">
            <p>上传作业相关图片：</p>
            <el-upload v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </div>
        <editor-markdown v-model="markdownContent"></editor-markdown>
        <div class="button_submit">
            <el-button type="primary">提交</el-button>
            <router-link to="/home/task">
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
    padding: 20px;


}

.create_title,
.create_list {
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

.create_list {
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
</style>