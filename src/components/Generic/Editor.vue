<template>
    <VueMarkdownEditor v-model="(modelValue)" :disabled-menus="[]" :include-level="[1, 2, 3, 4, 5, 6]"
        @upload-image="handleUploadImage" @change="change" :height="height + 'px'"></VueMarkdownEditor>
</template>

<script setup>
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import Prism from "prismjs";
import { getCurrentInstance } from "vue";
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/npm'
import 'katex/dist/katex.min.css';

const { proxy } = getCurrentInstance()
VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});
VueMarkdownEditor.use(createKatexPlugin());
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    height: {
        type: Number,
        default: 500,
    },
});
const emit = defineEmits()
const change = (markdownContent, htmlContent) => {
    emit('update:modelValue', markdownContent)
    emit('htmlContent', htmlContent)
}
const handleUploadImage = async (event, insertImage, files) => {
    console.log(files);
    // 这里做自定义图片上传
    let result = await proxy.Request({
        url: '/file/uploadImage',
        dataType: 'file',
        params: {
            file: files[0],
            type: 1,
        }
    })
    if (!result) {
        return
    }
    const url = proxy.globaInfo.imageUrl + result.data.fileName
    insertImage({
        url: url,
        desc: '博客图片',
        // width: 'auto',
        // height: 'auto',
    });
};
</script>
<style></style>