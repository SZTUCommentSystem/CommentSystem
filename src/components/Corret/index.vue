<script setup lang="ts">
import { useRoute, watchEffecte, useRouter } from 'vue-router';
import { ref, onMounted, watch } from "vue";
import CorrectWork from '@/hooks/CorretHooks/CorretWork';
import { ElMessage } from 'element-plus';

import SignImage from '@/components/Generic/SignImage.vue'
import SideBorder from '@/components/Generic/SideBorder.vue'

import { studentInfoAPI } from '@/api/TaskAPI/studentList'

// 接受携带数据
const route = useRoute();
const router = useRouter();

// 题目情况
interface Student {
    id: number;
    name: string;
    class: string;
    studentId: string;
    status: string;
    score: number;
}
const student = ref<Student | null>(null)

// 根据路由参数获取学生信息
const getStudentInfo = async () => {
    const res = await studentInfoAPI(route.query.id);
    student.value = res.data.data;
}

// 从子组件获取学生数量
const studentNumber = ref(0);
const updateStudentNumber = (num: number) => {
    studentNumber.value = num;
}


const nowTask = ref(1);
const taskNumber = ref(3);
const statusData = ref(new Array(taskNumber.value).fill(0).map(() => new Array(4).fill(0)));

// 批改
const { deleteImgShow, deleteImg, newImgs, cropperObj } = CorrectWork()

// 更新学生批改状态
const updateCorretStatus = (taskIndex: number, studentIndex: number) => {
    statusData.value[taskIndex][studentIndex] = 1;
}

// 批语
const displayComments = ref([
    '你在这个项目中展现了极高的专业水平。',
    '你的思考方式为大家打开了新的视野。'
])
const textarea = ref('');

const onclick = (comment: string) => {
    textarea.value += comment;
}

const LastOne = () => {
    if (route.query.id > 1)
        router.push(`/home/corret?id=${student.value.id - 1}`);
    else
        ElMessage.error('已经是第一个学生了');
}
const NextOne = () => {
    if (route.query.id < studentNumber.value)
        router.push(`/home/corret?id=${student.value.id + 1}`);
    else
        ElMessage.error('已经是最后一个学生了');
}

onMounted(() => {
    getStudentInfo();
})

watch(() => route.query.id, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        getStudentInfo();
    }
})
</script>

<template>
    <div style="position: relative;">
        <!-- 左边学生列表组件 -->
        <SideBorder :taskNumber="taskNumber" :nowTask="nowTask" :statusData="statusData"
            @updateCorretStatus="updateCorretStatus" @updateStudentNumber="updateStudentNumber">
        </SideBorder>
        <el-page-header @back="router.push('/home/task/taskcondition?title=Task+1')" content="批改作业" title="返回">
        </el-page-header>

        <div class="base">
            <div class="left">
                <div class="student-message" v-if="student">
                    <h4>您当前批改的学生信息</h4>
                    <p>学生姓名：{{ student.name }}</p>
                    <p>学生班级：{{ student.class }}</p>
                    <p>当前批改的题目为：第 {{ nowTask }} 题，共 {{ taskNumber }} 题</p>
                </div>
                <div class="student-corret">
                    <h4>批改作业</h4>
                    <p>批改：</p>
                    <div class="correct-box">
                        <!-- 图片处理框 -->
                        <SignImage v-if="cropperObj.cVisible" :dialogVisible.sync="cropperObj.cVisible"
                            :title="cropperObj.ctitle" :imgUrl="cropperObj.previewsImgUrl"
                            @getNewImg="cropperObj.getNewImg" @closeCropperDialog="cropperObj.closeCropperView">
                        </SignImage>
                        <!-- 点击弹出图片处理框 -->
                        <el-button type="primary" plain @click="cropperObj.openCropperView">批改作业</el-button>
                        <el-button>查看原题</el-button>

                        <!-- 处理完图片回显 -->
                        <ul>
                            <li v-for="(img, index) in newImgs" :key="index">
                                <el-image :src="img" fit="cover" @mouseenter="deleteImgShow[index] = true" />
                                <div class="img-del" v-show="deleteImgShow[index]"
                                    @mouseleave="deleteImgShow[index] = false">
                                    <img src="@/assets/img/删除.png" alt="" @click="deleteImg(index)">
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="student-comments">
                    <p>批语：</p>
                    <el-input v-model="textarea" :autosize="{ minRows: 8 }" type="textarea"
                        style="width: 100%; font-size: 18px;" />
                    <p>得分：</p>
                    <input type="number" placeholder="请输入分数" />

                </div>
            </div>
            <div class="right">
                <p>本题的批语库为：</p>
                <el-check-tag checked @click="onclick(comment)" v-for="comment in displayComments" :key="comment"
                    class="comment-tag">{{
                        comment }}</el-check-tag>
            </div>
        </div>
        <div class="left-button" @click="LastOne">&lt;</div>
        <div class="right-button" @click="NextOne">&gt;</div>
        <div class="bottom-button">
            <el-button type="primary" plain style="width: 100px;">上一份</el-button>
            <el-button type="primary" plain style="width: 100px;">下一份</el-button>
            <el-button type="success" style="width: 100px;" @click="updateCorretStatus(nowTask - 1, 0)">保存</el-button>
        </div>
    </div>
</template>

<style scoped>
.base {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .left,
    .right {
        width: 49%;
        height: auto;
        background-color: #fff;
        margin-bottom: 5px;
        padding: 10px 20px;
    }
}

.header {
    font-size: 20px;
    background-color: white;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px
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