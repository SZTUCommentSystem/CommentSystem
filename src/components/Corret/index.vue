<script setup lang="ts">
import { useRoute } from 'vue-router';
import SignImage from '@/components/Generic/SignImage.vue'
import { ref } from "vue";

import CorrectWork from '@/hooks/CorretHooks/CorretWork';

// 接受携带数据
const route = useRoute();

// 学生提交图片
const srcList = [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

// 批改
const { deleteImgShow, deleteImg, newImgs, cropperObj } = CorrectWork()


// 批语
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
                        <el-image style="width: 380px;" :src="src" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
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
                        <el-image style="width: 380px;" :src="src" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                            :preview-src-list="srcList" :initial-index="index" fit="cover" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="box">
            <h4>批改作业</h4>
            <p>批改：</p>
            <div class="correct-box">
                <!-- 图片处理框 -->
                <SignImage v-if="cropperObj.cVisible" :dialogVisible.sync="cropperObj.cVisible"
                    :title="cropperObj.ctitle" :imgUrl="cropperObj.previewsImgUrl" @getNewImg="cropperObj.getNewImg"
                    @closeCropperDialog="cropperObj.closeCropperView"></SignImage>
                <!-- 点击弹出图片处理框 -->
                <el-button type="primary" plain @click="cropperObj.openCropperView">批改作业</el-button>
                <!-- 处理完图片回显 -->
                <ul>
                    <li v-for="(img, index) in newImgs" :key="index">
                        <el-image :src="img" fit="cover" @mouseenter="deleteImgShow[index] = true" />
                        <div class="img-del" v-show="deleteImgShow[index]" @mouseleave="deleteImgShow[index] = false">
                            <img src="@/assets/img/删除.png" alt="" @click="deleteImg(index)">
                        </div>
                    </li>
                </ul>
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

    ul {
        padding-left: 0;
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
        margin-top: 10px;

        li {
            position: relative;
            width: 380px;
            margin-right: 10px;
            margin-bottom: 10px;

            image {
                width: 100%;
                height: 100%;
            }

            .img-del {
                position: absolute;
                top: 0;
                right: 0;
                width: 100%;
                height: 97%;
                background-color: #000;
                opacity: 0;
                transition: opacity 0.5s;
                cursor: pointer;

                img {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px;
                    height: 40px;
                }

                &:hover {
                    opacity: 0.5;
                }
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