<script lang="ts" setup>
</script>

<template>
    <div class="create-wrapper">
        <h2 style="margin-bottom: 10px;">新建作业</h2>
        <div class="create_title">
            <p>标题：</p>
            <input type="text" placeholder="请输入作业标题" />
        </div>
        <div class="create_title">
            <p>描述：</p>
            <input type="text" placeholder="请输入作业简介" />
        </div>
        <div class="create_task">
            <p>作业列表：</p>
            <div class="task_list">
                <ul>
                    <i class="icon-del-list">x</i>
                    <li>
                        <div class="type1">
                            <p>题目：</p>
                            <input type="text" placeholder="请输入作业题目" />
                        </div>
                    </li>
                    <li>
                        <div class="type1">
                            <p>背景：</p>
                            <input type="text" placeholder="请输入作业背景" />
                        </div>
                    </li>
                    <li>
                        <div class="type2">
                            <div class="title">
                                <p>制图要求：</p>
                                <i class="icon-add">+</i>
                            </div>
                            <ul>
                                <li>
                                    <input type="text">
                                    <i class="icon-del">x</i>
                                </li>
                                <li>
                                    <input type="text">
                                    <i class="icon-del">x</i>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div class="type2">
                            <div class="title">
                                <p>视图方向：</p>
                                <i class="icon-add">+</i>
                            </div>
                            <ul>
                                <li>
                                    <input type="text">
                                    <i class="icon-del">x</i>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div class="type1">
                            <p>制图标准：</p>
                            <input type="text" placeholder="请输入制图标准" />
                        </div>
                    </li>
                    <li>
                        <div class="type2">
                            <div class="title">
                                <p>技术要求：</p>
                                <i class="icon-add">+</i>
                            </div>
                            <ul>
                                <li>
                                    <input type="text">
                                    <i class="icon-del">x</i>
                                </li>
                                <li>
                                    <input type="text">
                                    <i class="icon-del">x</i>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div class="type1">
                            <p>绘图工具和材料：</p>
                            <input type="text" placeholder="请输入绘图工具和材料" />
                        </div>
                    </li>
                    <li>
                        <div class="type2">
                            <div class="title">
                                <p>评分标准（请确保总评分相加为100%）：</p>
                                <i class="icon-add">+</i>
                            </div>
                            <ul>
                                <li>
                                    <input type="text">
                                    <i class="icon-del">x</i>
                                </li>
                                <li>
                                    <input type="text">
                                    <i class="icon-del">x</i>
                                </li>
                                <li>
                                    <input type="text">
                                    <i class="icon-del">x</i>
                                </li>
                                <li>
                                    <input type="text">
                                    <i class="icon-del">x</i>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div class="type1">
                            <p>注意事项：</p>
                            <input type="text" placeholder="请输入注意事项" />
                        </div>
                    </li>
                    <li>
                        <div class="upload-file">
                            <img src="@/assets/img/上传.png" alt="" style="height: 20px;">
                            上传文件
                        </div>
                    </li>
                </ul>
            </div>
            <div class="button_container">
                <el-button type="primary" style="margin-top: 10px;">添加题目</el-button>
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

.create_title,
.create_task {
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

.create_task {
    height: auto;
}

.task_list {
    width: 100%;
    height: auto;
    border: 1px solid #ccc;
    margin-top: 5px;
    padding: 10px;
    padding-left: 0;
    padding-right: 2rem;
    border-radius: 5px;
    background-color: #f9f9f9;

    ul {
        position: relative;

        .icon-del-list {
            position: absolute;
            font-size: 20px;
            top: -18px;
            right: -15px;
            cursor: pointer;
        }
    }

    li {
        margin-top: 10px;

        &:first-child {
            margin-top: 0;
        }
    }
}

.button_container {
    display: flex;
    align-self: flex-end;
    justify-content: flex-end;
    width: 100%;
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

.type1,
.type2 {
    p {
        font-weight: 600;
    }
}

.type2 {

    ul {
        display: flex;
        flex-direction: column;
        justify-content: center;

        li {
            list-style: auto;
            margin-left: 10px;

            input {
                height: 35px;
                width: 86%;
            }
        }
    }

    .icon-add {
        display: inline-block;
        width: 25px;
        height: 25px;
        text-align: center;
        border-radius: 50px;
        margin-top: 10px;
        margin-left: 220px;
        color: #fff;
        background-color: #409EFF;
        cursor: pointer;
    }

    .icon-del {
        vertical-align: text-bottom;
        margin-left: 10px;
        cursor: pointer;
        opacity: 0.3;
        transition: transform 0.3s, 0.3s ease;

        &:hover {
            opacity: 1;
        }
    }
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.upload-file {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 119px;
    height: 45px;
    border: 1px solid #ccc;
    cursor: pointer;
    background-color: #fff;

    img {
        margin-right: 10px;
    }
}
</style>