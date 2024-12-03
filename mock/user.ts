import { id } from "element-plus/es/locales.mjs";

function createUserList() {
    return [
        {
            userId: 1,
            // avatar: '../src/assets/image/man.png',   // 头像
            username: 'admin',   // 用户名
            password: '111111',   // 用户密码
            roles: [
                {
                    id: 1,
                    name: '工程设计',
                    people: 14, // 人数
                }
            ], //课程
            token: 'Admin Token',
        },
        {
            userId: 2,
            // avatar: '../src/assets/image/man.png',   // 头像
            username: 'system',   // 用户名
            password: '111111',   // 用户密码
            roles: [
                {
                    id: 1,
                    name: '工程力学',
                    people: 13, // 人数
                }
            ],
            token: 'System Token',
        },
    ]
}

export default [
    // 用户登录假接口
    {
        url: '/api/user/login',    // 请求地址
        method: 'post',
        response: ({ body }) => {

            // 获取请求体鞋带过来的用户名与密码
            const { username, password } = body;

            // 调用获取用户信息的函数，用于判断是否有此用户
            const checkUser = createUserList().find(
                (item) => item.username === username && item.password === password,
            )

            // 返回失败信息
            if (!checkUser) {
                return { code: 201, data: { message: ' 账号或密码不正确 ' } }
            }

            // 返回成功信息
            const { token } = checkUser
            return { code: 200, data: { checkUser } }

        },
    },

    // 获取用户信息假接口
    {
        url: '/api/user/info',    // 请求地址
        method: 'get',
        response: (request) => {

            // 获取请求头携带的 token
            const token = request.headers.token;

            // 查看用户信息是否包含有次token用户
            const checkUser = createUserList().find((item) => item.token === token)

            // 返回失败信息
            if (!checkUser) {
                return { code: 201, data: { message: ' 获取用户信息失败 ' } }
            }

            // 返回成功信息
            return { code: 200, data: { checkUser } }

        },
    },

]