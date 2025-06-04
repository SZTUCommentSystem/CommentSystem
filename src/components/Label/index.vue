<script setup lang="ts">
import {nextTick,ref} from "vue";
import { ElInput } from "element-plus";
import type { InputInstance, TagProps } from "element-plus";
import { labelListAPI } from "@/api/LabelAPI";

const inputValue=ref('')
const dynamicTags=ref(['Tag1','Tag2','Tag3','Tag4','Tag5','Tag6','Tag7'])
const inputVisble=ref(false)
const InputRef=ref<InputInstance>()
//删除指定元素
const handleClose =(tag:string)=>{
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag),1)
}
const showInput =()=>{
  inputVisble.value=true
  nextTick(()=>{
    InputRef.value!.input!.focus()
  })
}
const handleInputConfirm =()=>{
  if(InputRef.value){
    dynamicTags.value.push(inputValue.value)
  }
  inputVisble.value=false
  inputValue.value=''
}

type Item = { type: TagProps['type']; label: string }

const items = ref<Array<Item>>([
  { type: 'primary', label: 'Tag 1' },
  { type: 'success', label: 'Tag 2' },
  { type: 'info', label: 'Tag 3' },
  { type: 'warning', label: 'Tag 4' },
  { type: 'danger', label: 'Tag 5' },
])
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
</script>

<template>
  <div class="flex-container  bg-white p-4 ">
    <div class="flex discribe-container mb-3">
      <span>
        选择标签章节：
      </span>
      <el-cascader :options="options" clearable />


    </div>
    <div class="flex tag-container">
      <el-tag
          v-for="(tag,index) in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          size="large"
          class="me-2"
          effect="light"
          :type="items[index%5]?.type"
      >
        {{tag}}
      </el-tag>
      <el-input
          v-if="inputVisble"
          ref="InputRef"
          v-model="inputValue"
          class="w-25 "
          size="default"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag "  size="default" @click="showInput" >
        +新增标签
      </el-button>
    </div>


  </div>
</template>

<style scoped>
.flex-container{
  display: flex;
  flex-direction: column; /* 使子元素竖直排列 */
  gap: 10px; /* 设置元素之间的间距 */
}
</style>