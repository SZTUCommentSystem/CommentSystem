<script setup lang="ts">
import { useRoute } from 'vue-router';
import SignImage from '@/components/Generic/SignImage.vue'
import { ref, reactive, watch } from "vue";
import testImage from "@/assets/测试1.png";
import testImage2 from "@/assets/测试2.png";

// 接受携带数据
const route = useRoute();

//////////////// 学生提交图片
const srcList = [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

//////////////// 批改

// 关闭弹窗
const emits = defineEmits(["closeDialog"]);
const closeDialog = () => {
    emits("closeDialog");
};


// 图片处理
const newImgs = reactive([]);
const cropperObj = reactive({
    cVisible: false, // 显示切图弹框
    ctitle: "", // 弹框标题
    previewsImgUrl: [testImage, testImage2], //图片地址
    // 开启剪切弹框
    openCropperView: () => {
        cropperObj.ctitle = "图片处理"
        cropperObj.cVisible = true
    },
    // 关闭弹框所触发的事件
    closeCropperView: (data) => {
        cropperObj.cVisible = false
    },
    // 获取处理完的图片
    getNewImg: (val) => {
        newImgs.push(window.serverUrl.IMG_SERVER + val)
    }
})


// 处理文件上传，这个函数还没用到
// const handleFileUpload = (event) => {
//     const files = event.target.files;
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const imageUrl = URL.createObjectURL(file);
//         images.value.push(imageUrl);
//     }
// };

/////////////// 批语
const displayComments = ref([
    '你在这个项目中展现了极高的专业水平。',
    '你的思考方式为大家打开了新的视野。'
])
const textarea = ref('');

const onclick = (comment: string) => {
    textarea.value += comment;
}



</script>

<template>
    <div style="position: relative;">
        <div class="box">
            <h4>您当前批改的学生信息</h4>
            <p>学生姓名：{{ route.query.name }}</p>
            <p>学生班级：工程2班</p>
        </div>
        <div class="box">
            <h4>题目描述</h4>
            <p>
                标题：
                <i style="font-size: 25px;">工程制图题目 1</i>
            </p>
            <div class="picture">
                <p>相关图片：</p>
                <ul class="demo-image__preview">
                    <li v-for="(src, index) in srcList" :key="index">
                        <el-image style="width: 300px;" :src="src" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                            :preview-src-list="srcList" :initial-index="index" fit="cover" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="box">
            <h4>学生答案</h4>
            <div class="picture">
                <p>相关图片：</p>
                <ul class="demo-image__preview">
                    <li v-for="(src, index) in srcList" :key="index">
                        <el-image style="width: 300px;" :src="src" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                            :preview-src-list="srcList" :initial-index="index" fit="cover" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="box">
            <h4>批改作业</h4>
            <p>批改：</p>
            <div class="correct-box">
                <!-- 处理完图片回显 -->
                <ul>
                    <li v-for="img in newImgs" :key="img">
                        <el-image :src="img" fit="cover" />
                    </li>
                </ul>
                <!-- 图片处理框 -->
                <SignImage v-if="cropperObj.cVisible" :dialogVisible.sync="cropperObj.cVisible"
                    :title="cropperObj.ctitle" :imgUrl="cropperObj.previewsImgUrl" @getNewImg="cropperObj.getNewImg"
                    @closeCropperDialog="cropperObj.closeCropperView"></SignImage>
                <!-- 点击弹出图片处理框 -->
                <el-button type="primary" plain @click="cropperObj.openCropperView">批改作业</el-button>
            </div>

            <p>本题的批语库为：</p>
            <el-check-tag checked @click="onclick(comment)" v-for="comment in displayComments" :key="comment"
                class="comment-tag">{{
                    comment }}</el-check-tag>
            <p>批语：</p>
            <el-input v-model="textarea" :autosize="{ minRows: 8 }" type="textarea"
                style="width: 1180px; font-size: 18px;" />
        </div>
        <div class="box">
            <h4>评分</h4>
            <p>
                <input type="number" placeholder="请输入分数" />
            </p>
        </div>
        <div class="left-button">&lt;</div>
        <div class="right-button">&gt;</div>
        <div class="bottom-button">
            <el-button type="primary" plain style="width: 100px;">上一份</el-button>
            <el-button type="primary" plain style="width: 100px;">下一份</el-button>
            <el-button type="success" style="width: 100px;">保存</el-button>
        </div>
    </div>
</template>

<style scoped>
.box {
    display: flex;
    /* 纵向排列 */
    flex-direction: column;
    /* 向左对齐 */
    align-items: flex-start;
    width: 100%;
    height: auto;
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

.left-button,
.right-button {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #fff;
    cursor: pointer;
    border-radius: 100%;
    font-size: 24px;
}

.left-button {
    left: 80px;
}

.right-button {
    right: 80px;
}

.bottom-button {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    button {
        padding: 18px 0;
    }
}

.picture {
    display: flex;
    flex-direction: column;

    .demo-image__preview {
        display: flex;
        flex-wrap: wrap;

        li {
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }

    .demo-image__error .image-slot {
        font-size: 30px;
    }

    .demo-image__error .image-slot .el-icon {
        font-size: 30px;
    }

    .demo-image__error .el-image {
        width: 100%;
        height: 200px;
    }
}

.correct-box {
    ul {
        display: flex;
        flex-wrap: wrap;

        li {
            width: 300px;
            margin-right: 10px;
            margin-bottom: 10px;

            image {
                width: 100%;
                height: 100%;
            }
        }
    }
}

.comment-tag {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin-bottom: 10px;
    font-size: 16px;
}
</style>