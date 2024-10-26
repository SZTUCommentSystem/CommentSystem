// 用于模拟题目列表数据 

import { de } from "element-plus/es/locales.mjs";

function QuestionList() {
    return [
        {
            id: 1,
            type: '编程题',
            title: '编程题1',
            description: '$$f(x) = \\frac{1}{2}x^2 + 2x + 1$$',
            tags: ['tag1', 'tag2'],
            displayComments: [
                '你在这个项目中展现了极高的专业水平。',
                '你的思考方式为大家打开了新的视野。'
            ]
        },
        {
            id: 2,
            type: '工程制图',
            title: '工程制图1',
            description: '$$A_1^2\n\\B_{12}$$',
            tags: ['tag1', 'tag2'],
            displayComments: [
                '你的创造力和想象力让人刮目相看。',
                '你的观点启发了同学们的思考，值得鼓励。'
            ]
        },
        {
            id: 3,
            type: '工程设计',
            title: '工程设计1',
            description: '## 1. 问题描述\n\n设计一个xxx',
            tags: ['tag1', 'tag2'],
            displayComments: [
                '感谢你在讨论中提供的深刻见解，真的很有帮助。',
                '在这一项目中，你的组织能力得到了充分体现。'
            ]
        },
    ]

}

export default [
    //请求列表假接口
    {
        url: '/api/home/questionList',
        type: 'get',
        response: config => {
            return {
                code: 200,
                data: QuestionList(),
                message: 'success'
            }
        }
    },
    //提交假接口
    {
        url: '/api/home/submitQuestion',
        type: 'post',
        response: config => {
            return {
                code: 200,
                data: null,
                message: 'success'
            }
        }
    },
    // 根据上传id获取题目详情
    {
        url: '/api/home/questionDetail',
        type: 'get',
        response: (config: { query: { id: number; }; }) => {
            const { id } = config.query;
            const questionList = QuestionList();
            const question = questionList.find(item => item.id == id);
            return {
                code: 200,
                data: question,
                message: 'success'
            }
        }
    }
]