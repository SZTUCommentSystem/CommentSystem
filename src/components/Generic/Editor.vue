<template>
    <VueMarkdownEditor v-model="(modelValue)" :disabled-menus="[]" :include-level="[1, 2, 3, 4, 5, 6]"
        @upload-image="handleUploadImage" @change="change" :height="height + 'px'"></VueMarkdownEditor>
</template>

<script setup>
import VueMarkdownEditor from "@kangc/v-md-editor";

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

        const response = await fetch('http://localhost:3000/upload', {
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