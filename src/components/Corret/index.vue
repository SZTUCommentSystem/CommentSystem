<template>
    <div style="position: relative;">
        <!-- 左边学生列表组件 -->
        <SideBorder 
            :students="students"
            @updateStudent="updateStudent">
        </SideBorder>
        <el-page-header @back="router.go(-1)" content="批改作业" title="返回">
        </el-page-header>

        <div class="base">
            <div class="left">
                <div>
                    <h4>您当前批改的学生信息</h4>
                    <p>学生姓名：{{ nowStudentOtherInfo?.studentName }}</p>
                    <p>学生班级：{{ studentList?.className }}</p>
                    <p>当前批改的题目为：第 {{ nowQuestionIdx+1 }} 题，共 {{ taskQuestList.length }} 题</p>
                </div>
                <div>
                    <h4>批改作业</h4>
                    <p>批改：</p>
                    <div class="correct-box">
                        <!-- 图片处理框 -->
                        <SignImage 
                          v-if="cropperObj.cVisible" 
                          :dialogVisible.sync="cropperObj.cVisible"
                          :title="cropperObj.ctitle" 
                          :imgUrl="cropperObj.previewsImgUrl"
                          @uploadAndShowImg="uploadAndShowImg"
                          @closeCropperDialog="cropperObj.closeCropperView"
                        >
                        </SignImage>
                        <!-- 点击弹出图片处理框 -->
                        <el-button type="primary" plain @click="cropperObj.openCropperView">批改作业</el-button>
                        <el-button @click="showDialog = true">查看原题</el-button>

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
                    <el-input v-model="submitStudentTask.infoCorrect" :autosize="{ minRows: 8 }" type="textarea"
                        style="width: 100%; font-size: 18px;" />
                    <p>得分：</p>
                    <input v-model="submitStudentTask.infoNum" type="number" placeholder="请输入分数" />
                </div>
            </div>
            <div class="right">
                <!-- <div class="right-header">
                    <p>本题的批语库为：</p>
                    <div class="left">
                        <el-button class="new-create" @click="createCategory">新建分类</el-button>
                        <el-button type="primary" plain>添加批语</el-button>
                    </div>
                </div>
                <div class="right-body">
                    <CategoryList :categories="category" @onclick="onclick" />
                </div> -->
                <Left 
                    v-model:questionContent="questionContent" 
                    @clickEvent="onclick"
                    :isCuor="true"
                ></Left>
            </div>
        </div>
        <div class="left-button" @click="LastOne">&lt;</div>
        <div class="right-button" @click="NextOne">&gt;</div>
        <div class="bottom-button">
            <el-button type="primary" plain style="width: 100px;" @click="LastProblem">上一题</el-button>
            <el-button type="primary" plain style="width: 100px;" @click="NextProblem">下一题</el-button>
            <el-button type="success" style="width: 100px;"
                @click="submitTask">保存并提交</el-button>
        </div>
        <el-dialog
            v-model="showDialog"
            title="查看原题"
            width="50%"
            align-center
        >
            <Right
              :isDialog="true"
              :nowTopicTypeId="nowTopicTypeId"
              v-model:questionContent="questionContent"
            ></Right>
      </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onMounted, computed, watch } from "vue";
import CorrectWork from '@/hooks/CorretHooks/CorretWork';
import { ElMessage } from 'element-plus';

import SignImage from '@/components/Generic/SignImage.vue'
import SideBorder from '@/components/Generic/SideBorder.vue'
import Left from '../Question/components/Left.vue';
import Right from '../Question/components/Right.vue';

import { questionDetailAPI, questionCommentListAPI } from '@/api/QuestionAPI'
import { labelInfoAPI } from '@/api/LabelAPI'
import { getCommentDetailAPI } from '@/api/CommentsAPI'
import { taskDetailAPI } from "@/api/TaskAPI";
import {
  classDetailAPI,
  studentListAPI,
  submitStudentTaskAPI,
  studentTaskInfoAPI,
  submitCorretTaskAPI
} from '@/api/ClassAPI';

const route = useRoute();
const router = useRouter();

// 展示原题
const showDialog = ref(false)
// const right = ref()

// 数据类型
interface Student {
  studentId: number;
  studentName: string;
  userId: number;
  classId: number;
  studentTel: string;
  studentEmail: string;
  studentNo: string;
}
interface ClassI {
  classId: number,
  className: string,
  student: Student[]
}
interface StudentTask {
  id: number
  homeworkStudentId: number
  studentId: number
  infoState: string
  answerInfo: string
  answerUrls: string
  infoCorrect: string
  infoNum: number
}
interface Label {
  chapterId: number
  courseId: number
  topicLabelId: number
  topicLabelName: string
}
interface Comment {
  commentId: number
  commentName: string
  commentTypeId: number
}

// 路由参数
const homeworkId = ref(Number(route.query.homeworkId))
const classId = ref(Number(route.query.classId))
const studentId = ref(Number(route.query.studentId))

// 学生列表和当前学生索引
const studentList = ref<ClassI>({
  classId: null,
  className: '',
  student: []
});
const nowStudentIdx = ref(0);

// 学生批改状态列表
const students = ref<{
  className: string,
  studentName: string,
  infoState: string,
}[]>([])

const getudentList = async () => {
  // 获取所有学生id
  const ids = studentList.value.student
    .filter((item: any) => item.studentId)
    .map((item: any) => item.studentId);

  // 并发请求每个学生的作业状态
  const results = await Promise.all(
    ids.map(async (id: number) => {
      // 查询学生作业信息
      const res = await studentTaskInfoAPI({
        homeworkId: homeworkId.value,
        studentId: id
      });
      if (res.data.code === 200 && res.data.rows.length > 0) {
        // 查询该学生该题目的批改状态
        const da = {
          studentId: id,
          homeworkStudentId: res.data.rows[0].id,
          topicId: taskQuestList.value[nowQuestionIdx.value]
        };
        const ret = await submitStudentTaskAPI(da);
        if (ret.data.code === 200 && ret.data.rows.length > 0) {
          const stu = ret.data.rows[0];
          return {
            className: studentList.value.className,
            studentName: studentList.value.student.find((st: any) => st.studentId == stu.studentId)?.studentName || '',
            infoState: stu.infoState
          };
        }
      }
      // 没有作业信息或批改信息时返回空对象
      return {
        className: studentList.value.className,
        studentName: studentList.value.student.find((st: any) => st.studentId == id)?.studentName || '',
        infoState: ''
      };
    })
  );

  students.value = results;
}

watch(
    () => studentList.value.student,
    (newVal) => {
        if (newVal && newVal.length > 0) {
            getudentList();
        }
    },
    { immediate: true }
);

// 题目列表和当前题目索引
const taskQuestList = ref<string[]>([])
const nowQuestionIdx = ref(0);

// 当前学生信息
const nowStudentOtherInfo = computed(() => {
  return studentList.value.student[nowStudentIdx.value] || null;
});

// 当前学生ID响应式同步
watch(nowStudentIdx, (idx) => {
  if (studentList.value.student[idx]) {
    studentId.value = studentList.value.student[idx].studentId;
    getSubmitStudentTask();
  }
});

// 获取学生列表
const getStudentList = async () => {
  const res = await studentListAPI(classId.value);
  if (res.data.code == 200) {
    studentList.value.student = res.data.rows;
    // 定位当前学生索引
    const idx = studentList.value.student.findIndex(s => s.studentId === studentId.value);
    nowStudentIdx.value = idx !== -1 ? idx : 0;
  }
  const ret = await classDetailAPI(classId.value);
  if (ret.data.code == 200) {
    studentList.value.className = ret.data.data.className;
    studentList.value.classId = ret.data.data.classId;
  }
}

// 学生作业信息
const submitStudentTask = ref<StudentTask>({
  id: null,
  homeworkStudentId: null,
  studentId: null,
  infoState: '',
  answerInfo: '',
  answerUrls: '',
  infoCorrect: '',
  infoNum: null,
})
const getSubmitStudentTask = async () => {
  let data = {
    homeworkId: homeworkId.value,
    studentId: studentId.value
  }
  const res = await studentTaskInfoAPI(data);
  if (res.data.code == 200 && res.data.rows.length > 0) {
    let da = {
      studentId: studentId.value,
      homeworkStudentId: res.data.rows[0].id,
      topicId: taskQuestList.value[nowQuestionIdx.value]
    }
    const ret = await submitStudentTaskAPI(da);
    if (ret.data.code == 200 && ret.data.rows.length > 0) {
      submitStudentTask.value = ret.data.rows[0];
    }
  }
}

// 题目内容
const questionContent = reactive<{
  topicId?: string | number
  topicTitle: string
  topicType: string
  labels: Label[]
  topicUrls: any[]
  topicInfo: string
  comments: Comment[]
}>({
  topicId: '',
  topicTitle: '',
  topicType: '',
  labels: [],
  topicUrls: [],
  topicInfo: '',
  comments: [],
})

// 获取题目列表
const getTaskDetail = async () => {
  const res = await taskDetailAPI(homeworkId.value);
  if (res.data.code == 200) {
    taskQuestList.value = res.data.data.topicIds.split(',')
  }
}

// 获取题目信息
const nowTopicTypeId = ref(null);
const getQuestionContent = async () => {
  const res = await questionDetailAPI(Number(taskQuestList.value[nowQuestionIdx.value]))
  if (res.data.code === 200) {
    const data = res.data.data
    questionContent.topicId = data.topicId
    questionContent.topicTitle = data.topicTitle
    // questionContent.topicType = getTypeName(data.topicTypeId)
    nowTopicTypeId.value = data.topicTypeId
    questionContent.topicInfo = data.topicInfo
    questionContent.topicUrls = data.topicUrls
      ? data.topicUrls.split(',').map(url => ({ url }))
      : []
    getLabelByIds(data.labelIds)
  } else {
    ElMessage.error('获取题目信息失败，请稍后再试')
  }
}

// 获取标签
const getLabelByIds = async (labelIds: string) => {
  if (!labelIds) {
    questionContent.labels = []
    return
  }
  const ids = labelIds.split(',').map(Number).filter(id => !isNaN(id));
  try {
    const results = await Promise.all(
      ids.map(id => labelInfoAPI(id))
    );
    const labels = results
      .filter(res => res.data.code === 200)
      .map(res => res.data.data)
      .map((label: any) => ({
        chapterId: label.chapterId,
        courseId: label.courseId,
        topicLabelId: label.topicLabelId,
        topicLabelName: label.topicLabelName,
      }));
    questionContent.labels = labels;
  } catch (error) {
    ElMessage.error('获取题目标签失败，请稍后再试');
  }
}

// 获取题目评论
const getQuestionComments = async () => {
  const res = await questionCommentListAPI(Number(taskQuestList.value[nowQuestionIdx.value]))
  if (res.data.code === 200) {
    const commentDetails = await Promise.all(
      res.data.rows.map(async (comment: any) => {
        const retRes = await getCommentDetailAPI(comment.commentId)
        const ret = retRes.data.data
        return {
          commentId: ret.commentId,
          commentName: ret.commentName,
          commentTypeId: ret.commentTypeId,
        }
      })
    )
    questionContent.comments = commentDetails
  } else {
    ElMessage.error('获取题目评论失败，请稍后再试')
  }
}

// 点击批语添加
const onclick = (comment: string) => {
  submitStudentTask.value.infoCorrect += comment;
}

// 切换学生
const LastOne = () => {
  if (nowStudentIdx.value > 0) {
    nowStudentIdx.value--;
  } else {
    ElMessage.error('已经是第一个学生了');
  }
}
const NextOne = () => {
  if (nowStudentIdx.value < studentList.value.student.length - 1) {
    nowStudentIdx.value++;
  } else {
    ElMessage.error('已经是最后一个学生了');
  }
}
const updateStudent = (id: number) => {
    nowStudentIdx.value = id;
}

// 切换题目
const LastProblem = () => {
  if (nowQuestionIdx.value > 0) {
    nowQuestionIdx.value--;
    getQuestionContent();
    getQuestionComments();
  } else {
    ElMessage.error('已经是第一题了');
  }
}
const NextProblem = () => {
  if (nowQuestionIdx.value < taskQuestList.value.length - 1) {
    nowQuestionIdx.value++;
    getQuestionContent();
    getQuestionComments();
  } else {
    ElMessage.error('已经是最后一题了');
  }
}

// 批改
const {
  deleteImgShow,
  deleteImg,
  newImgs,
  cropperObj,
  uploadAndShowImg
} = CorrectWork(submitStudentTask)

// 提交批改完成后的学生作业
const submitTask = async () => {
  try {
    let data = {
      id: submitStudentTask.value.id,
      homeworkStudentId: submitStudentTask.value.homeworkStudentId,
      studentId: submitStudentTask.value.studentId,
      infoState: '已批改',
      topicId: questionContent.topicId,
      infoCorrect: submitStudentTask.value.infoCorrect,
      infoNum: submitStudentTask.value.infoNum
    }
    const res = await submitCorretTaskAPI(data);
    if (res.data.code == 200) {
      ElMessage.success('提交成功');

      // 1. 更新当前学生的批改状态
      students.value[nowStudentIdx.value].infoState = '已批改';

      // 2. 查找下一个 infoState === '已提交' 的学生
      let found = false;
      let nextIdx = nowStudentIdx.value + 1;
      while (nextIdx < students.value.length) {
        if (students.value[nextIdx].infoState === '已提交') {
          nowStudentIdx.value = nextIdx;
          found = true;
          break;
        }
        nextIdx++;
      }

      // 3. 如果没找到，检查前面是否还有 infoState === '已提交' 的
      if (!found) {
        let prevIdx = 0;
        while (prevIdx < nowStudentIdx.value) {
          if (students.value[prevIdx].infoState === '已提交') {
            nowStudentIdx.value = prevIdx;
            found = true;
            break;
          }
          prevIdx++;
        }
      }

      // 4. 如果全部学生都不是“已提交”，说明本题已全部批改，跳到下一个题目的第一个学生
      const allCorrected = students.value.every(s => s.infoState !== '已提交');
      if (allCorrected) {
        if (nowQuestionIdx.value < taskQuestList.value.length - 1) {
          nowQuestionIdx.value++;
          nowStudentIdx.value = 0;
          ElMessage.success('本题全部学生批改完成，自动跳到下一题');
          await getQuestionContent();
          await getQuestionComments();
          await getudentList(); // 更新新题目的学生批改状态
        } else {
          ElMessage.success('全部题目全部学生批改完成！');
        }
        return;
      }

      // 5. 如果当前是最后一名学生且还有“已提交”的学生未批改
      if (!found && nowStudentIdx.value === students.value.length - 1) {
        ElMessage.warning('现在是最后一名学生，但还有学生未批改');
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

// 初始化
onMounted(async () => {
  await getTaskDetail();
  await getStudentList();
  await getQuestionContent();
  await getQuestionComments();
  await getSubmitStudentTask();
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