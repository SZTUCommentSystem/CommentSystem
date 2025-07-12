<template>
  <div class="all_class">
    <div class="base">
      <div class="title">
        <div class="title-left">
          <h2>作业列表</h2>
        </div>
        <router-link to="/home/task/taskcreate" class="title_button">
          <el-button type="primary">去创建作业</el-button>
        </router-link>
      </div>
      <div class="task-body">
        <ul>
          <li v-for="cate in homeWorkComment" :key="cate.homeworkContentId">
            <div class="task-main-body">
              <div class="task-left">
                <div style="margin: 3px 0;">
                  <span>{{ cate.homeworkContentName }}</span>
                </div>
              </div>
              <div class="task-right">
                <img src="@/assets/img/向上的箭头.png" alt="" v-if="cate.spreadIndex"
                  @click="cate.spreadIndex = !cate.spreadIndex">
                <img src="@/assets/img/向下的箭头.png" alt="" v-else
                  @click="cate.spreadIndex = !cate.spreadIndex">
              </div>
            </div>
            <div v-if="cate.spreadIndex">
              <transition name="fade">
                <div class="list">
                  <ul>
                    <li
                      v-if="IsTask && FilterStatus.length > 0"
                      v-for="item in FilterStatus.filter(task => task.homeworkContentId === cate.homeworkContentId)"
                      :key="item.homeworkId"
                      class="list_li"
                    >
                      <div class="pane">
                        <div class="pane-top">
                          <div class="pane-rep">
                            <div class="status">
                              <h5>标题：{{ item.homeworkTitle }}</h5>
                            </div>
                            <div class="task-tag">
                              标签：
                              <el-tag v-for="tag in item.tags" :key="tag">
                                {{ tag }}
                              </el-tag>
                            </div>
                          </div>
                          <div class="pane-skip">
                            <el-dropdown placement="bottom">
                              <el-button> 更多 </el-button>
                              <template #dropdown>
                                <el-dropdown-menu>
                                  <el-dropdown-item @click="confirmPubTask(item.homeworkId)">
                                    立即发布
                                  </el-dropdown-item>
                                  <el-dropdown-item @click="confirmDelTask(item.homeworkId)">
                                    立即删除
                                  </el-dropdown-item>
                                  <el-dropdown-item @click="toTaskDetail(item.homeworkId)">
                                    编辑作业
                                  </el-dropdown-item>
                                  <el-dropdown-item
                                    @click="toTaskCondition(item.homeworkId, item.classIds)">
                                    查看作业
                                  </el-dropdown-item>
                                </el-dropdown-menu>
                              </template>
                            </el-dropdown>
                          </div>
                        </div>
                        <div class="p-4">
                          <div class="task-info-header">
                            <span class="teacher">布置老师：胡某</span>
                            <span class="deadline">截止时间：{{ item.limitTime || '--' }}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li v-if="!IsTask || FilterStatus.length === 0" class="list-not-li">
                      <h1>尚未发布作业</h1>
                    </li>
                  </ul>
                </div>
              </transition>
            </div>
          </li>
        </ul>
      </div>
      <!-- <div class="paging">
        <el-config-provider :locale="zhCn">
          <el-pagination :current-page="state.pageNum" background :page-size="state.pageSize"
            :page-sizes="[10]" v-if="FilterStatus.length > 0" layout="total, prev, pager, next, jumper"
            :total="FilterStatus.length" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </el-config-provider>
      </div> -->
    </div>

    <!-- 发布作业 -->
    <el-dialog v-model="pubDialogVisible" title="发布作业" width="30%" center>
      <div>请选择要发布的班级</div>
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
        全选
      </el-checkbox>
      <el-checkbox-group v-model="checkedClass" @change="handleCheckedTagsChange">
        <el-checkbox v-for="tag in classList" :key="tag" :label="tag" :value="tag">
          {{ tag.className }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="publishTask">
            确定
          </el-button>
          <el-button @click="pubDialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 删除作业 -->
    <el-dialog v-model="delDialogVisible" title="删除作业" width="30%" center>
      <div>确定删除该作业吗？</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="deleteTask">
            确定
          </el-button>
          <el-button @click="delDialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";

import { classListAPI } from '@/api/ClassAPI/index';
import { deleteTaskAPI, pubTaskAPI } from "@/api/TaskAPI";

// 导入列表展示逻辑和标签工具
import ListDisplay, { getTagsByQuestionIds } from "@/hooks/TaskHooks/TaskListDisplay";
import { PubList, DelList } from "@/hooks/TaskHooks/OperateList";
import { ElMessage } from "element-plus";

// 获取作业分类、作业列表等
const {
  homeWorkComment,
  state,
  getHomeworkComment,
  getTaskList,
  FilterStatus
} = ListDisplay();

// 发布作业相关
const {
  pubDialogVisible,
  pubTaskId,
  confirmPubTask,
} = PubList();

// 发布班级相关
// 获取班级列表
interface ClassItem {
  classId: string //班级id（唯一）“非空”
  courseId: string //课程id
	className: string   //班级名称
	classState: string  //班级状态（1 未开课，2 授课中，3已结课）
  lastTime: string  //最近作业截止时间
  svgNum: number  //平均分
}
const checkedClass = ref<ClassItem[]>([])
const classList = ref<ClassItem[]>([])
const getClassList = async () => {
  try {
    let data = {
      pageNum: 1,
      pageSize: 9999
    }
    const res = await classListAPI(data);
    classList.value = res.data.rows;
    console.log(classList.value)
  } catch (error) {
    console.log(error.message)
  }
}

const checkAll = ref(false);
const isIndeterminate = ref(true);

const handleCheckAllChange = (val: boolean) => {
  checkedClass.value = val ? classList.value : [];
  isIndeterminate.value = false;
};
const handleCheckedTagsChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === classList.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < classList.value.length;
};

const publishTask = async () => {
  let pubTa = state.TaskList.find(item => item.homeworkId = pubTaskId.value)
  let data = {
    homeworkId: pubTaskId.value,
    classIds: checkedClass.value.map(item => item.classId).join(','),
    topicIds: pubTa.topicIds
  }
  try {
    const res = await pubTaskAPI(data);
    if(res.data.code == 200) {
      ElMessage.success('发布成功')
    } else {
      ElMessage.error('发布失败')
    }
  } catch (error) {
    console.log(error.message)    
  } finally {
    pubDialogVisible.value = false
  }
}

// 删除作业相关
const { delDialogVisible, delTaskId, confirmDelTask } = DelList();
const deleteTask = async () => {
  try {
    const res = await deleteTaskAPI(delTaskId.value)
    if (res.data.code == 200) {
      ElMessage.success('删除成功')
      init()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    console.log(error.message)
  } finally {
    delDialogVisible.value = false
  }
}

// 是否有作业
const IsTask = ref(true);
watchEffect(() => {
  IsTask.value = state.TaskList.length > 0;
});

// 跳转到作业情况页面
const router = useRouter();
const toTaskCondition = (id: number, classIds: string) => {
  router.push({ path: "/home/task/taskcondition", query: { id, classIds } });
};

// 跳转到编辑作业页面
const toTaskDetail = (id: number) => {
  router.push({ path: "/home/task/taskdetail", query: { id } });
};

const init = async () => {
  getClassList();
  getHomeworkComment();
  await getTaskList();
  // 并发请求所有作业的标签
  await Promise.all(
    state.TaskList.map(async (task) => {
      const ids = (task.topicIds || "")
        .split(",")
        .map(id => Number(id))
        .filter(id => !isNaN(id));
      if (ids.length > 0) {
        task.tags = await getTagsByQuestionIds(ids);
      } else {
        task.tags = [];
      }
    })
  );
}

// 页面加载时获取作业列表，并为每个作业动态获取标签
onMounted(() => init());
</script>

<style scoped>
.all_class {
  min-height: 100vh;
  padding: 0;
}
.base {
  position: relative;
  width: 100%;
  min-height: 350px;
  padding: 36px 0 90px 0;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 32px 0 rgba(64, 158, 255, 0.10);
  margin: 0 auto;
  max-width: 1200px;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 48px;
  border-bottom: 2px solid #e3eaf5;
  margin-bottom: 22px;
}
.title-left {
  display: flex;
  align-items: center;
}
h2 {
  margin: 0 36px 0 0;
  font-size: 28px;
  font-weight: 800;
  color: #000;
  letter-spacing: 2px;
}
.title_button {
  margin: 20px 0;
}
.title_button button {
  margin-right: 12px;
  height: 44px;
  width: 140px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 700;
  background: #fff;
  color: rgb(64, 158, 255);
  border: 2px solid rgb(64, 158, 255);
  box-shadow: none;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.title_button button:hover {
  background: rgb(64, 158, 255);
  color: #fff;
  border: 2px solid rgb(64, 158, 255);
}
.task-body {
  width: 100%;
  min-height: 240px;
}
.task-body ul {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0;
  margin: 0;
}
.task-body li {
  width: 97%;
  margin: 8px 0;
  background: #fafdff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(64,158,255,0.08);
  border: 1.5px solid #e3eaf5;
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
  position: relative;
  overflow: hidden;
}
/* .task-body li:hover {
  box-shadow: 0 6px 24px rgba(64,158,255,0.18);
  background: #e6f4fe;
  border-color: rgb(64, 158, 255);
} */
.task-main-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  border-bottom: 1.5px solid #e3eaf5;
  background: #f4faff;
  border-radius: 16px 16px 0 0;
}
.task-left {
  display: flex;
  align-items: center;
}
.task-left img,
.task-right img {
  width: 24px;
  margin-left: 14px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.task-left img:hover {
  opacity: 1;
}
.list {
  width: 100%;
  background: #fff;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 1px 10px rgba(64,158,255,0.04);
  padding: 0;
}
.list ul {
  margin: 0;
  padding: 0 20px 20px 20px;
}
.list_li {
  margin: 10px 0;
  border-radius: 12px;
  background: #fafdff;
  box-shadow: 0 2px 8px rgba(64,158,255,0.08);
  border: 2px solid #e3eaf5;
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.list_li:hover {
  background: #e6f4fe;
  box-shadow: 0 4px 24px rgba(64,158,255,0.15);
  border-color: rgb(64, 158, 255);
}
.pane {
  width: 100%;
}
.pane-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px 0 28px;
  width: 100%;
}
.pane-rep {
  width: 74%;
}
.status {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.status h5 {
  font-size: 20px;
  margin: 0;
  font-weight: 700;
  color: #000;
  letter-spacing: 1px;
}
.task-tag {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}
.el-tag {
  font-size: 14px;
  padding: 0 12px;
  border-radius: 8px;
  background: #e3f1fd;
  color: rgb(64, 158, 255);
  border: none;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
}
.el-tag:hover {
  background: rgb(64, 158, 255);
  color: #fff;
}
.pane-skip {
  margin-right: 18px;
}
.pane-skip button {
  border-radius: 22px;
  font-weight: 600;
  font-size: 15px;
}
.pane-skip .icon {
  margin-top: 17px;
  margin-left: 20px;
  cursor: pointer;
}
.pane-skip img {
  width: 22px;
  height: 17px;
}
.p-4 {
  padding: 0 28px 20px 28px;
}
.list-not-li {
  text-align: center;
  color: #b3b3b3;
  font-size: 20px;
  padding: 36px 0;
  letter-spacing: 2px;
}
.task-info-header {
  display: flex;
  justify-content: flex-start;
  gap: 36px;
  font-size: 16px;
  color: #000;
  font-weight: 600;
  margin-bottom: 18px;
  letter-spacing: 1px;
}
.task-info-header .deadline {
  color: #000;
}
.statistic-row {
  display: flex;
  gap: 32px;
  margin-bottom: 8px;
}
.statistic-card {
  background: linear-gradient(135deg, #e3f0ff 60%, #fafdff 100%);
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(64,158,255,0.08);
  padding: 18px 36px;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s;
}
.statistic-card:hover {
  box-shadow: 0 4px 16px rgba(64,158,255,0.15);
}
.stat-title {
  font-size: 15px;
  color: #888;
  margin-bottom: 8px;
  font-weight: 500;
}
.stat-value {
  font-size: 32px;
  color: #409eff;
  font-weight: 900;
  letter-spacing: 2px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>