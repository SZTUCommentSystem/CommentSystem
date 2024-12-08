// 用于描述学生列表的数据结构

function StudentList() {
    return [
        {
            id: 1,
            name: '张三',
            class: '软件工程1班',
            studentId: '201800102312',
            status: '未提交',
            score: 0,
        },
        {
            id: 2,
            name: '李四',
            class: '软件工程2班',
            studentId: '201922522312',
            status: '已提交',
            score: 0,
        },
        {
            id: 3,
            name: '王五',
            class: '软件工程2班',
            studentId: '201922522312',
            status: '已批改',
            score: 100,
        },
    ]
}

interface Student {
    id: number;
    name: string;
    class: string;
    studentId: string;
    status: string;
    score: number;
}

interface ApiResponse<T> {
    code: number;
    data: T;
    message: string;
}

interface Config {
    query: {
        id: number;
    };
}

export default [
    // 获取学生列表假接口
    {
        url: '/api/home/studentList',
        method: 'get',
        response: (): ApiResponse<Student[]> => {
            return {
                code: 200,
                data: StudentList(),
                message: 'success'
            }
        }
    },
    // 获取单个学生信息
    {
        url: '/api/home/studentInfo',
        method: 'get',
        response: (config: Config): ApiResponse<Student | undefined> => {
            const { id } = config.query;
            const studentList: Student[] = StudentList();
            const student = studentList.find(item => item.id == id);
            return {
                code: 200,
                data: student,
                message: 'success'
            }
        }
    }
]