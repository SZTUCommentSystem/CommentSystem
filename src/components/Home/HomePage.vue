<script lang="ts" setup>
import { ref } from 'vue';

//圆环进度条
const submittedCount = 23;
const totalSubmitted = 54;
const correctedCount = 13;
const totalCorrected = 23;

const submittedPercentage = ((submittedCount / totalSubmitted) * 100).toFixed(2);
const correctedPercentage = ((correctedCount / totalCorrected) * 100).toFixed(2);

//便签
const textarea = ref('');

// 从本地存储中获取是否选择课程
const SelectClass = ref(localStorage.getItem('SelectClassName'));

</script>

<template>
    <div>
        <div class="header-container">
            <div class="home-header">
                <h1>专注提升，</h1>
                <h1>精准批改。</h1>
            </div>
        </div>
        <div v-if="SelectClass !== null">
            <div class="home-body-task">
                <div class="title">
                    <h1>课程情况</h1>
                </div>
                <div class="task-content">
                    <div class="task-title">
                        <h4>欢迎您，用户名老师，您当前选择的课程为：{{ SelectClass }}</h4>
                    </div>
                    <div class="task-info">
                        <div class="task-condition">
                            <div class="task-condition-left">
                                <p>距离最近发布的作业结束时间还有：<br><i>2小时14分钟</i></p>

                            </div>
                            <div class="task-condition-right">
                                <p>当前有 <i>0</i> 个作业未发布</p>
                                <p>当前有 <i>0</i> 个作业已发布</p>
                                <p>当前有 <i>0</i> 个作业已批改</p>
                            </div>
                        </div>
                        <div class="task-corret">
                            <div class="task-corret-left">
                                <div class="left">
                                    <div class="top">
                                        <el-button type="primary">发布通知</el-button>
                                    </div>
                                    <div class="bottom">
                                        <div class="circle">
                                            <svg viewBox="0 0 36 36" class="circular-chart blue">
                                                <path class="circle-bg" d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path class="circle" :stroke-dasharray="submittedPercentage + ', 100'"
                                                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <text x="18" y="20.35" class="percentage">{{ submittedPercentage
                                                    }}%</text>
                                            </svg>
                                        </div>
                                        <p>最近发布的作业提交数量为：<br><i>23 / 54</i></p>
                                    </div>

                                </div>
                                <div class="right">
                                    <div class="top">
                                        <el-button type="primary">前往批阅</el-button>
                                    </div>
                                    <div class="bottom">
                                        <div class="circle">
                                            <svg viewBox="0 0 36 36" class="circular-chart green">
                                                <path class="circle-bg" d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path class="circle" :stroke-dasharray="correctedPercentage + ', 100'"
                                                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <text x="18" y="20.35" class="percentage">{{ correctedPercentage
                                                    }}%</text>
                                            </svg>
                                        </div>
                                        <p>最近发布的作业批改数量为：<br><i>13 / 23</i></p>
                                    </div>
                                </div>
                            </div>
                            <div class="task-corret-right">
                                <div class="top">
                                    <div class="left">
                                        <img src="@/assets/img/便签.png" alt="">
                                        <p>便签</p>
                                    </div>
                                    <el-button type="primary">保存</el-button>
                                </div>
                                <div class="bottom">
                                    <el-input v-model="textarea" maxlength="30" style="width: 225px;height: 157px;"
                                        rows="7" show-word-limit type="textarea" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="home-body-question-container">
                <div class="home-body-question">
                    <div class="title">
                        <h1>学生提问</h1>
                    </div>
                    <p style="margin-left: 10vw;">当前有 <i style="font-size: 27px;">0</i> 个学生提问(注：本栏是根据学生提问列表展示前两个)</p>
                    <div class="question">
                        <div class="question-info">
                            <p>提问的作业题目是：<i>第三章第二次作业第一题</i></p>
                            <p>提问的学生是：<i>张学生</i></p>
                            <p>提问的问题是：<i>如果本题如此如此，在满足本题条件的情况下，那么这样设计应该也可以吧？</i></p>
                            <el-button type="primary">前往回答</el-button>
                        </div>
                        <div class="question-info">
                            <p>提问的作业题目是：<i>第三章第二次作业第一题</i></p>
                            <p>提问的学生是：<i>张学生</i></p>
                            <p>提问的问题是：<i>如果本题如此如此，在满足本题条件的情况下，那么这样设计应该也可以吧？</i></p>
                            <el-button type="primary">前往回答</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="home-body-library">
                <div class="title">
                    <h1>详情内容</h1>
                </div>
                <div class="info">
                    <ul>
                        <li>
                            <div class="top">
                                <img src="@/assets/img/指南.png" alt="">
                                <h4>指南</h4>
                                <p>我们的在线作业批改平台专为教师和学生设计，提供便捷的作业上传、自动批改和个性化反馈服务。</p>
                            </div>
                            <div class="bottom">查看详情</div>
                        </li>
                        <li>
                            <div class="top">
                                <img src="@/assets/img/交流.png" alt="">
                                <h4>交流</h4>
                                <p>教师便捷批改，学生即时反馈，促进高效教学互动。</p>
                            </div>
                            <div class="bottom">查看详情</div>
                        </li>
                        <li>
                            <div class="top">
                                <img src="@/assets/img/作业批改.png" alt="">
                                <h4>批改</h4>
                                <p>智能批改，即时反馈，提升学习效率，简化教学流程。</p>
                            </div>
                            <div class="bottom">查看详情</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="title">
                <h1>请选择课程</h1>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header-container {
    position: relative;
    width: 100%;
    height: 25em;
}

.home-header {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 25em;
    background: url(@/assets/img/首页背景图.png) no-repeat center center;
    background-size: cover;
    z-index: 1;

    h1 {
        position: absolute;
        color: #fff;
        /* 宽度变大 */
        font-size: 64px;
        font-family: 'Arial', sans-serif;
        font-weight: bold;

        &:first-child {
            top: 1.5em;
            left: 4em;
        }

        &:last-child {
            top: 3.5em;
            left: 5em;
        }
    }
}

.title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    padding: 35px 0;

    h1 {
        font-size: 40px;
        font-weight: bold;
        margin: 0 20px;

        &::before,
        &::after {
            content: '';
            display: inline-block;
            height: 20px;
            width: 20px;
            background-image: url('@/assets/img/标题修饰.png');
            background-size: contain;
            background-repeat: no-repeat;
            margin: 0 40px;
        }
    }
}

.home-body-task {
    width: 100%;
    margin-bottom: 3em;

    .task-content {
        width: 100%;
        height: auto;

        .task-title {
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgb(0, 0, 0, 0.2);
            background-color: #fff;

            h4 {
                margin: 0;
            }
        }

        .task-info {
            display: flex;
            flex-direction: column;

            .task-corret {
                display: flex;
                justify-content: space-between
            }

            .task-corret-left {
                display: flex;
                justify-content: flex-start;
                margin-top: 1em;
                width: 78%;

                .left,
                .right {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgb(0, 0, 0, 0.2);
                    border-radius: 10px;
                    width: 50%;

                    .top,
                    .bottom {
                        display: flex;
                        align-items: center;

                        p {
                            font-size: 20px;
                            margin: 0 0 0 10px;

                            i {
                                font-size: 28px;
                                margin-left: 65px;
                            }
                        }
                    }

                    .top {
                        display: flex;
                        justify-content: end;
                        width: 100%;
                        height: 4em;
                        padding-right: 20px;
                        background-color: rgb(245, 246, 246);
                    }

                    .bottom {
                        padding: 10px;
                    }
                }

                .left {
                    margin-right: 10px;
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;

                    .top {
                        border-top-left-radius: 10px;
                    }
                }

                .right {
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;

                    .top {
                        border-top-right-radius: 10px;
                    }
                }
            }

            .task-corret-right {
                width: 20%;
                background-color: #fff;
                margin-top: 1em;
                box-shadow: 0 0 10px rgb(0, 0, 0, 0.2);
                border-radius: 10px;

                .top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 10px;
                    background-color: rgb(245, 246, 246);
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;

                    .left {
                        display: flex;
                        align-items: center;
                    }

                    img {
                        width: 35px;
                    }

                    p {
                        font-size: 20px;
                        margin: 0;
                    }

                    button {
                        margin-right: 10px;
                    }
                }

                .bottom {
                    width: 100%;
                    padding: 10px;
                }
            }

            .task-condition {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 15em;
                margin-top: 1em;
            }

            .task-condition-left {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                height: 100%;
                width: 45%;
                margin-right: 26px;
                box-shadow: 0 0 10px rgb(0, 0, 0, 0.2);
                border-radius: 10px;

                p {
                    font-size: 20px;

                    i {
                        margin-left: 2em;
                        font-size: 36px;
                    }
                }
            }

            .task-condition-right {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 55%;
                background-color: #fff;
                box-shadow: 0 0 10px rgb(0, 0, 0, 0.2);
                border-radius: 10px;

                p {
                    font-size: 20px;

                    i {
                        font-size: 36px;
                    }
                }
            }
        }
    }
}

.home-body-question-container {
    position: relative;
    width: 100%;
    height: 34em;

    .home-body-question {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 100vw;
        height: 33em;
        background-color: #fff;

        .question {
            display: flex;
            justify-content: space-around;
            width: 80%;
            margin: 0 auto;

            .question-info {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                width: 49%;
                height: 20em;
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 20px;
                padding-top: 30px;
                box-shadow: 0 0 10px rgb(0, 0, 0, 0.1);
                transition: box-shadow 0.3s;

                &:hover {
                    box-shadow: 0 0 10px rgb(0, 0, 0, 0.3);
                }

                i {
                    font-size: 20px;
                    font-weight: bold;
                }

                button {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                }
            }

        }
    }
}

.home-body-library {
    width: 100%;
    min-height: 20em;

    .info {
        margin-top: 10px;
    }

    ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0;

        li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 30%;
            height: 25em;
            background-color: #fff;
            box-shadow: 0 0 10px rgb(0, 0, 0, 0.2);
            border-radius: 10px;

            .top {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                width: 100%;
                height: 80%;

                img {
                    width: 100px;
                }

                h4 {
                    font-size: 20px;
                    margin: 2em 0 10px 0;
                }

                p {
                    margin: 0 47px;
                }
            }

            .bottom {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 20%;
                color: rgb(83, 160, 255);
                font-size: 20px;
                border-top: 1px solid #ccc;

                &:hover {
                    background-color: rgb(83, 160, 255);
                    color: #fff;
                    cursor: pointer;
                }
            }
        }
    }
}

/* 圆环样式 */
.circle {
    fill: none;
    stroke-width: 2.8;
    stroke-linecap: round;
    margin-left: 20px;
    animation: progress 1s ease-out forwards;
}

.circular-chart {
    display: block;
    margin: 10px auto;
    width: 115px;
}

.circle-bg {
    fill: none;
    stroke: #eee;
    stroke-width: 3.8;
}

@keyframes progress {
    0% {
        stroke-dasharray: 0 100;
    }
}

.circular-chart.blue .circle {
    stroke: #3b82f6;
    /* 蓝色 */
}

.circular-chart.green .circle {
    stroke: #10b981;
    /* 绿色 */
}

.percentage {
    fill: #666;
    font-size: 0.5em;
    text-anchor: middle;
}
</style>