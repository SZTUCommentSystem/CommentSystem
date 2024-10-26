import { reactive, computed, ref } from 'vue';

export default function StudentList() {
    const status = reactive({
        studentList: [
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
        ],
        pageSize: 20,
        pageNum: 1
    });

    //列表展示
    const handleSizeChange = (val: number) => {
        status.pageSize = val
    }
    const handleCurrentChange = (val: number) => {
        status.pageNum = val
        window.scrollTo(0, 0)
    }

    //过滤搜索数组
    const searchNameQuery = ref('');
    const searchStudentIdQuery = ref('');
    const filteredStudent = computed(() => {
        return status.studentList.filter(student => {
            const matchesSearchName = student.name.includes(searchNameQuery.value);
            const matchesSearchId = student.studentId.includes(searchStudentIdQuery.value);
            return matchesSearchName && matchesSearchId;
        });
    });

    //过滤班级数组
    const searchClassQuery = ref('');
    const filteredClass = computed(() => {
        return filteredStudent.value.filter(student => {
            const matchesSearchClass = searchClassQuery.value === '全部' ? true : student.class.includes(searchClassQuery.value);
            return matchesSearchClass;
        });
    });

    // 根据当前页码和每页显示数量计算当前显示的章节列表
    const displayStudent = computed(() => {
        const start = (status.pageNum - 1) * status.pageSize;
        const end = start + status.pageSize;
        return filteredClass.value.slice(start, end);
    });



    return { status, displayStudent, handleSizeChange, handleCurrentChange, searchNameQuery, searchStudentIdQuery, searchClassQuery, filteredStudent }
}