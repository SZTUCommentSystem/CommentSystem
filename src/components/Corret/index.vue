<template>
    <div style="position: relative;">
        <!-- 左边学生列表组件 -->
        <SideBorder :taskNumber="taskNumber" :nowTask="nowTask" :statusData="statusData" :nowCorrect="route.query.id"
            @updateStudentNumber="updateStudentNumber">
        </SideBorder>
        <el-page-header @back="router.push('/home/task/taskcondition?title=Task+1')" content="批改作业" title="返回">
        </el-page-header>

        <div class="base">
            <div class="left">
                <div v-if="student">
                    <h4>您当前批改的学生信息</h4>
                    <p>学生姓名：{{ student.name }}</p>
                    <p>学生班级：{{ student.class }}</p>
                    <p>当前批改的题目为：第 {{ nowTask }} 题，共 {{ taskNumber }} 题</p>
                </div>
                <div>
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
                <div>
                    <p>批语：</p>
                    <el-input v-model="textarea" :autosize="{ minRows: 8 }" type="textarea"
                        style="width: 100%; font-size: 18px;" />
                    <p>得分：</p>
                    <input type="number" placeholder="请输入分数" />

                </div>
            </div>
            <div class="right">
                <div class="right-header">
                    <p>本题的批语库为：</p>
                    <div class="left">
                        <el-button class="new-create" @click="createCategory">新建分类</el-button>
                        <el-button type="primary" plain>添加批语</el-button>
                    </div>
                </div>
                <div class="right-body">
                    <CategoryList :categories="category" @onclick="onclick" />
                </div>
            </div>
        </div>
        <div class="left-button" @click="LastOne">&lt;</div>
        <div class="right-button" @click="NextOne">&gt;</div>
        <div class="bottom-button">
            <el-button type="primary" plain style="width: 100px;" @click="LastProblem">上一题</el-button>
            <el-button type="primary" plain style="width: 100px;" @click="NextProblem">下一题</el-button>
            <el-button type="success" style="width: 100px;"
                @click="updateCorretStatus(nowTask - 1, Number(route.query.id) - 1)">保存</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, watch } from "vue";
import CorrectWork from '@/hooks/CorretHooks/CorretWork';
import { ElMessage, ElMessageBox } from 'element-plus';

import CategoryList from '@/components/Generic/CategoryList.vue'
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
    const res = await studentInfoAPI(Number(route.query.id));
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
// const displayComments = ref([
//     '你在这个项目中展现了极高的专业水平。',
//     '你的思考方式为大家打开了新的视野。'
// ])
const textarea = ref('');

const onclick = (comment: string) => {
    textarea.value += comment;
}

// 批语分类
// interface Category {
//     id: number;
//     name: string;
//     comments: string[];
//     isEditing: boolean;
//     spreadIndex: boolean;
//     subcategories: Subcategory[];
// }

// interface Subcategory {
//     id: number;
//     name: string;
//     comments: string[];
//     isEditing: boolean;
//     spreadIndex: boolean;
//     subcategories: Subcategory[];
// }

const category = ref([
    {
        id: 1,
        name: '分类A',
        comments: [
            '你在这个项目中展现了极高的专业水平。',
            '你的思考方式为大家打开了新的视野。'
        ],
        isEditing: false,
        spreadIndex: false,
        subcategories: [
            {
                id: 4,
                name: '子分类A1',
                comments: [
                    '子分类A1的评论1。',
                    '子分类A1的评论2。'
                ],
                isEditing: false,
                spreadIndex: false,
                subcategories: []
            }
        ]
    },
    {
        id: 2,
        name: '分类B',
        comments: [
            '你在这个项目中展现了极高的专业水平。',
            '你的思考方式为大家打开了新的视野。'
        ],
        isEditing: false,
        spreadIndex: false,
        subcategories: []
    },
    {
        id: 3,
        name: '分类C',
        comments: [
            '你在这个项目中展现了极高的专业水平。',
            '你的思考方式为大家打开了新的视野。'
        ],
        isEditing: false,
        spreadIndex: false,
        subcategories: []
    }
]);

// 切换展开状态
const spreadIndex = ref(false);

// 新建分类
const createCategory = () => {
    ElMessageBox.prompt('请输入您要放入的目录(多级目录请用.分隔)', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
    })
        .then(({ value }) => {
            const parts = value.split('.');
            if (parts.length === 2) {
                // 子分类
                const parentCategory = category.value.find(cat => cat.name === parts[0]);
                if (parentCategory) {
                    parentCategory.subcategories.push({
                        id: parentCategory.subcategories.length + 1,
                        name: parts[1],
                        comments: [],
                        isEditing: false,
                        spreadIndex: false,
                        subcategories: []
                    });
                    ElMessage({
                        type: 'success',
                        message: `创建成功`,
                    });
                } else {
                    ElMessage({
                        type: 'error',
                        message: `未找到父分类 ${parts[0]}`,
                    });
                }
            } else if (parts.length === 1) {
                // 一级分类
                category.value.push({
                    id: category.value.length + 1,
                    name: parts[0],
                    comments: [],
                    isEditing: false,
                    spreadIndex: false,
                    subcategories: []
                });
                ElMessage({
                    type: 'success',
                    message: `创建成功`,
                });
            } else {
                ElMessage({
                    type: 'error',
                    message: '输入格式错误',
                });
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '创建取消',
            })
        })
}

// 切换学生
const LastOne = () => {
    const id = Number(route.query.id);
    if (id > 1)
        router.push(`/home/corret?id=${id - 1}`);
    else
        ElMessage.error('已经是第一个学生了');
}
const NextOne = () => {
    const id = Number(route.query.id);
    if (id < studentNumber.value)
        router.push(`/home/corret?id=${id + 1}`);
    else
        ElMessage.error('已经是最后一个学生了');
}

// 切换题目
const LastProblem = () => {
    if (nowTask.value > 1) {
        nowTask.value--;
    } else {
        ElMessage.error('已经是第一题了');
    }
}
const NextProblem = () => {
    if (nowTask.value < taskNumber.value) {
        nowTask.value++;
    } else {
        ElMessage.error('已经是最后一题了');
    }
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

<style scoped>
.header {
    font-size: 20px;
    background-color: white;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px
}

.base {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .left {
        width: 49%;
        height: auto;
        background-color: #fff;
        margin-bottom: 5px;
        padding: 10px 20px;
    }

    .right {
        position: fixed;
        top: 101px;
        right: 151px;
        /* 距离页面右侧的距离 */
        width: 40%;
        /* 确保宽度合适 */
        height: auto;
        /* 根据内容自动调整高度 */
        background-color: #fff;
        margin-bottom: 5px;
        padding: 10px 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        /* 添加阴影效果 */
        z-index: 1000;
    }

    .right-header {
        display: flex;
        justify-content: space-between;
        align-items: end;
        margin-bottom: 10px;
    }

    .right-body {
        height: 92%;
        overflow-y: auto;
        border: 1px solid #ccc;
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

.comments {
    position: relative;
    width: 100%;
    height: 94%;

    .new-create {
        position: absolute;
        right: 0;
        top: -32px;
    }

    ul {
        padding: 0;

        li {
            margin: 5px;

            .comments-main-body {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 10px;
                border: 1px solid #ccc;
            }

            .comments-daughter {
                padding: 5px 10px;
                border: 1px solid #ccc;
                padding-right: 0;
            }

            .comments-left {
                display: flex;
                align-items: center;
            }

            img {
                width: 15px;
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
}

.comment-tag {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin-bottom: 5px;
    font-size: 16px;
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
</style>