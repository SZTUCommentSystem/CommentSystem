import { reactive, computed, ref, onMounted } from 'vue';
import { studentListAPI } from '@/api/TaskAPI/studentList';

export default function StudentList() {
    interface Student {
        id: number;
        name: string;
        class: string;
        studentId: string;
        status: string;
        score: number;
    }

    const status = reactive({
        studentList: [] as Student[],
        pageSize: 20,
        pageNum: 1
    });

    // 获取学生列表
    const getStudentList = async () => {
        try {
            const res = await studentListAPI();
            if (res.status === 200) {
                if (Array.isArray(res.data.data)) {
                    status.studentList = res.data.data;
                } else {
                    console.error('Expected an array but got:', res.data);
                }
            } else {
                console.error('Failed to fetch student list:', res.status);
            }
        } catch (error) {
            console.error('Error fetching student list:', error);
        }
    };


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


    onMounted(() => {
        getStudentList();
    })

    return { status, displayStudent, handleSizeChange, handleCurrentChange, searchNameQuery, searchStudentIdQuery, searchClassQuery, filteredStudent }
}