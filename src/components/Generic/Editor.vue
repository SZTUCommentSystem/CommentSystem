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
    try {
        const formData = new FormData();
        formData.append('avatarfile', files[0]);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.url) {
            const imageUrl = data.url;
            insertImage({
                url: imageUrl,
                desc: '博客图片',
                // width: 'auto',
                // height: 'auto',
            });
        } else {
            throw new Error('图片上传失败');
        }
    } catch (error) {
        console.error(error);
    }
};
</script>
<style></style>