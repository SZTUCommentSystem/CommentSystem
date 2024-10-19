<script lang="ts" setup>
import { ref } from 'vue';

// 标签
const tags = ref(['标签一', '标签二', '标签三']);
const handleCloseTag = (tag: string) => {
    tags.value.splice(tags.value.indexOf(tag), 1);
};

// 选择时间
const date = ref('');
</script>

<template>
    <div class="create-wrapper">
        <h2 style="margin-bottom: 10px;">新建作业</h2>
        <div class="create-title">
            <p>标题：</p>
            <input type="text" placeholder="请输入作业标题" />
        </div>
        <div class="create-title">
            <p>描述（可选）：</p>
            <input type="text" placeholder="请输入作业简介" />
        </div>
        <div class="create-title">
            <p>请选择本次作业的题目：</p>
            <el-button type="primary" plain>去题库选择</el-button>
        </div>
        <div class="create-title">
            <p>根据选择的题目得到的标签为：</p>
            <div class="problem-tag">
                <el-tag v-for="tag in tags" :key="tag" closable @close="handleCloseTag(tag)">
                    {{ tag }}
                </el-tag>
            </div>
        </div>
        <div class="create-title">
            <p>请选择本次作业的截止时间：</p>
            <div class="block">
                <el-date-picker v-model="date" type="datetimerange" start-placeholder="Start date"
                    end-placeholder="End date" format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd"
                    time-format="A hh:mm:ss" />
            </div>
        </div>
        <div class="button_submit">
            <el-button type="primary">提交</el-button>
            <router-link to="/home/task">
                <el-button>取消</el-button>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.create-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.create-title {
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

.problem-tag {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.block {
    margin-top: 10px;
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
</style>