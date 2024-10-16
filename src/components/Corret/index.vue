<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const srcList = [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]
</script>

<template>
    <div style="position: relative;">
        <div class="box">
            <p>您当前批改的学生信息</p>
            <p>学生姓名：{{ route.query.name }}</p>
            <p>学生班级：工程2班</p>
        </div>
        <div class="box">
            <p>题目描述</p>
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
            <p>学生答案</p>
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
            <p>批改作业+评语框</p>

        </div>
        <div class="box">
            <p>评分</p>
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
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #fff;
    cursor: pointer;
    border-radius: 100%;
}

.left-button {
    left: -70px;
}

.right-button {
    right: -70px;
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
</style>