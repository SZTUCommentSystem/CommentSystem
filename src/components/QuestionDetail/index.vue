<script lang="ts" setup>
import { ref, reactive, onMounted, watch, defineComponent } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import type { UploadProps } from 'element-plus'
import { questionDetailAPI } from '@/api/QuestionAPI/questionList'
import EditorMarkdown from '@/components/Generic/Editor.vue'

const route = useRoute()
const questionDetail = reactive({
  title: '',
  type: '',
  tags: [] as string[],
  imgs: [],
  description: '',
  displayComments: [] as string[],
})

// 添加抽屉状态
const drawer1 = ref(false)
const drawer2 = ref(false)

const getDetail = async () => {
  try {
    const itemId = Number(route.query.itemId)
    if (isNaN(itemId)) {
      throw new Error('Invalid itemId')
    }
    const res = await questionDetailAPI(itemId)
    Object.assign(questionDetail, res.data.data) // 更新对象的属性
  } catch (error) {
    console.error('获取题目详情失败:', error)
  }
}

// 上传图片
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 批语
const handleCloseComment = (comment: string) => {
  questionDetail.displayComments.splice(questionDetail.displayComments.indexOf(comment), 1)
}

// 标签关闭
const handleCloseTag = (tag: string) => {
  questionDetail.tags.splice(questionDetail.tags.indexOf(tag), 1)
}
//选取标签添加
const addTag = (tag: string) => {
  if (!questionDetail.tags.includes(tag)) {
    questionDetail.tags.push(tag)
  }
}

//抽屉select临时数据
const options = [
  {
    value: 'guide',
    label: '章节一',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency',
          },
          {
            value: 'feedback',
            label: 'Feedback',
          },
          {
            value: 'efficiency',
            label: 'Efficiency',
          },
          {
            value: 'controllability',
            label: 'Controllability',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation',
          },
          {
            value: 'top nav',
            label: 'Top Navigation',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: '章节二',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout',
          },
          {
            value: 'color',
            label: 'Color',
          },
          {
            value: 'typography',
            label: 'Typography',
          },
          {
            value: 'icon',
            label: 'Icon',
          },
          {
            value: 'button',
            label: 'Button',
          },
        ],
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio',
          },
          {
            value: 'checkbox',
            label: 'Checkbox',
          },
          {
            value: 'input',
            label: 'Input',
          },
          {
            value: 'input-number',
            label: 'InputNumber',
          },
          {
            value: 'select',
            label: 'Select',
          },
          {
            value: 'cascader',
            label: 'Cascader',
          },
          {
            value: 'switch',
            label: 'Switch',
          },
          {
            value: 'slider',
            label: 'Slider',
          },
          {
            value: 'time-picker',
            label: 'TimePicker',
          },
          {
            value: 'date-picker',
            label: 'DatePicker',
          },
          {
            value: 'datetime-picker',
            label: 'DateTimePicker',
          },
          {
            value: 'upload',
            label: 'Upload',
          },
          {
            value: 'rate',
            label: 'Rate',
          },
          {
            value: 'form',
            label: 'Form',
          },
        ],
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          {
            value: 'table',
            label: 'Table',
          },
          {
            value: 'tag',
            label: 'Tag',
          },
          {
            value: 'progress',
            label: 'Progress',
          },
          {
            value: 'tree',
            label: 'Tree',
          },
          {
            value: 'pagination',
            label: 'Pagination',
          },
          {
            value: 'badge',
            label: 'Badge',
          },
        ],
      },
      {
        value: 'notice',
        label: 'Notice',
        children: [
          {
            value: 'alert',
            label: 'Alert',
          },
          {
            value: 'loading',
            label: 'Loading',
          },
          {
            value: 'message',
            label: 'Message',
          },
          {
            value: 'message-box',
            label: 'MessageBox',
          },
          {
            value: 'notification',
            label: 'Notification',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'Menu',
          },
          {
            value: 'tabs',
            label: 'Tabs',
          },
          {
            value: 'breadcrumb',
            label: 'Breadcrumb',
          },
          {
            value: 'dropdown',
            label: 'Dropdown',
          },
          {
            value: 'steps',
            label: 'Steps',
          },
        ],
      },
      {
        value: 'others',
        label: 'Others',
        children: [
          {
            value: 'dialog',
            label: 'Dialog',
          },
          {
            value: 'tooltip',
            label: 'Tooltip',
          },
          {
            value: 'popover',
            label: 'Popover',
          },
          {
            value: 'card',
            label: 'Card',
          },
          {
            value: 'carousel',
            label: 'Carousel',
          },
          {
            value: 'collapse',
            label: 'Collapse',
          },
        ],
      },
    ],
  },
  {
    value: 'resource',
    label: '章节三',
    children: [
      {
        value: 'axure',
        label: 'Axure Components',
      },
      {
        value: 'sketch',
        label: 'Sketch Templates',
      },
      {
        value: 'docs',
        label: 'Design Documentation',
      },
    ],
  },
]

onMounted(() => {
  getDetail()
})

// 监听路由参数变化
watch(
    () => route.query.itemId,
    (newItemId, oldItemId) => {
      if (newItemId !== oldItemId) {
        getDetail()
      }
    }
)
//临时批语数据
const tableData = ref([
  '你在这个项目中展现了极高的专业水平。',
  '你的创造力和想象力让人刮目相看。',
  '这次的工作展示了你出色的团队合作能力。',
  '很高兴看到你对这项工作的热情和投入。',
  '你的成果是对自己努力最好的证明。',
  '你的观点启发了同学们的思考，值得鼓励。',
  '你在作业中展现的细致程度非常令人印象深刻。',
  '你的积极态度对班级的气氛产生了良好的影响。',
  '在这一项目中，你的组织能力得到了充分体现。',
  '感谢你在讨论中提供的深刻见解，真的很有帮助。',
  '你在课题中展示了优秀的解决问题能力。',
  '你的努力为团队带来了积极的影响。',
  '你的工作质量超出了我们的预期。',
  '你的表现使得整个团队受益匪浅。',
  '你的思考方式为大家打开了新的视野。',
  '你在活动中的投入让人感到非常欣慰。',
]);
//抽屉添加批语
const handleRowClick = (row: string) => {
  if (!questionDetail.displayComments.includes(row)) {
    questionDetail.displayComments.push(row)
  }
}
</script>

<template>
  <div class="create-wrapper">
    <div class="header">
      <el-page-header @back="this.$router.push('/home/question')" content="题目详情" title="返回" />
    </div>

    <div class="create-title-top">
      <div class="left">
        <p>标题：</p>
        <input type="text" v-model="questionDetail.title" placeholder="请输入题目标题" />
      </div>
      <div class="right">
        <p>题目类型：</p>
        <input type="text" v-model="questionDetail.type" placeholder="请输入题目类型" />
      </div>
    </div>
    <div class="create-list">
      <p>题目标签：</p>
      <div class="tag">
        <el-tag v-for="tag in questionDetail.tags" :key="tag" type="primary" effect="plain" round size="large" closable
                @close="handleCloseTag(tag)">{{ tag }}</el-tag>
        <el-button type="primary" plain style="border-radius: 20px;" @click="drawer1=true">+ 添加</el-button>
        <el-drawer v-model="drawer1" title="题目标签选择">
          <div class="mb-4">
            <span>选择标签章节：</span>
            <el-cascader :options="options" clearable />
          </div>
          <div class="flex">
            <el-tag type="primary" class="me-2 tag-hover" size="large" @click="addTag('Tag 1')">Tag 1</el-tag>
            <el-tag type="success" class="me-2 tag-hover" size="large" @click="addTag('Tag 2')">Tag 2</el-tag>
            <el-tag type="info" class="me-2 tag-hover" size="large" @click="addTag('Tag 3')">Tag 3</el-tag>
            <el-tag type="warning" class="me-2 tag-hover" size="large" @click="addTag('Tag 4')">Tag 4</el-tag>
            <el-tag type="danger" class="me-2 tag-hover" size="large" @click="addTag('Tag 5')">Tag 5</el-tag>
          </div>
        </el-drawer>
      </div>
    </div>
    <div class="create-list">
      <p>作业相关图片：</p>
      <el-upload v-model:file-list="questionDetail.imgs"
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
    <div class="create-list">
      <p>题目描述（可选）：</p>
      <editor-markdown v-model="questionDetail.description"></editor-markdown>
    </div>
    <div class="create-list">
      <p>题目批语：</p>
      <el-tag v-for="comment in questionDetail.displayComments" :key="comment" effect="plain" closable
              @close="handleCloseComment" class="comment-tag">
        {{ comment }}
      </el-tag>
      <el-button type="primary" plain style="border-radius: 20px; margin-top: 10px;" @click="drawer2=true">+ 添加</el-button>
      <el-drawer v-model="drawer2" title="题目批语选择">
        <div class="mb-4">
          <span>选择批语章节：</span>
          <el-cascader :options="options" clearable />
        </div>
        <div class="flex">
          <el-table
              :data="tableData"
              style="width: 100%;cursor: pointer;"
              @row-click="handleRowClick">
            <el-table-column>
              <template #default="{ row }">
                <div class="list_item">{{ row }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </div>
    <div class="button_submit">
      <el-button type="primary">提交</el-button>
      <router-link to="/home/question">
        <el-button>取消</el-button>
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.create-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
}
.header {
  font-size: 20px;
  background-color: white;padding: 10px;
  width: 100%;
  margin-bottom: 10px
}
.create-title-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;


  .left,
  .right {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    background-color: #fff;
    width: 49%;
  }


  .right {
    width: 50%;
    margin-left: 10px;
  }

  p {
    margin: 0;
    font-size: 18px;
    margin-bottom: 10px;
  }

  input {
    display: inline-block;
    width: 100%;
    height: 45px;
    padding-left: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;

    &:focus {
      outline: none;
    }
  }
}

.create-list {
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

.create-list {
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

.tag {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tag-hover:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  cursor: pointer;
}
.comment-tag {
  font-size: 18px;
  margin: 10px 0;
  padding-bottom: 5px;
  color: #000;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #000;
}
</style>