// 用于模拟题目列表数据 

function QuestionList() {
    return [
        {
            id: 1,
            type: '编程题',
            title: '编程题1',
            tags: ['tag1', 'tag2'],
            imgs: [
                {
                    name: 'test1.jpg',
                    url: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
                },
                {
                    name: 'test2.jpg',
                    url: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
                }
            ],
            description: '$$f(x) = \\frac{1}{2}x^2 + 2x + 1$$',
            displayComments: [
                '你在这个项目中展现了极高的专业水平。',
                '你的思考方式为大家打开了新的视野。'
            ]
        },
        {
            id: 2,
            type: '工程制图',
            title: '工程制图1',
            tags: ['tag3', 'tag2'],
            imgs: [
                {
                    name: 'test3.jpg',
                    url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
                },
                {
                    name: 'test4.jpg',
                    url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
                }
            ],
            description: '$$A_1^2 \\ B_{12}$$',
            displayComments: [
                '你的创造力和想象力让人刮目相看。',
                '你的观点启发了同学们的思考，值得鼓励。'
            ]
        },
        {
            id: 3,
            type: '工程设计',
            title: '工程设计1',
            tags: ['tag1', 'tag6'],
            imgs: [
                {
                    name: 'test5.jpg',
                    url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
                },
                {
                    name: 'test6.jpg',
                    url: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
                }
            ],
            description: '## 1. 问题描述\n\n设计一个xxx',
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