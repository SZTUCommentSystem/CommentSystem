import { computed, ref } from 'vue';

import type { Student } from '@/components/TaskCondition/index.vue';

export default function useStudentList(studentListProp: Student[]) {
    // 分页相关
    const pageSize = ref(20);
    const pageNum = ref(1);

    // 搜索相关
    const searchNameQuery = ref('');
    const searchStudentIdQuery = ref('');

    // 过滤搜索
    const filteredStudent = computed(() => {
        return studentListProp.filter(student => {
            // 确保字段为字符串
            const name = typeof student.studentName === 'string' ? student.studentName : String(student.studentName ?? '');
            const no = typeof student.studentNo === 'string' ? student.studentNo : String(student.studentNo ?? '');
            const matchesSearchName = name.includes(searchNameQuery.value);
            const matchesSearchId = no.includes(searchStudentIdQuery.value);
            return matchesSearchName && matchesSearchId;
        });
    });

    // 当前页显示
    const displayStudent = computed(() => {
        const start = (pageNum.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return filteredStudent.value.slice(start, end);
    });

    // 分页事件
    const handleSizeChange = (val: number) => {
        pageSize.value = val;
    };
    const handleCurrentChange = (val: number) => {
        pageNum.value = val;
        window.scrollTo(0, 0);
    };

    return {
        displayStudent,
        handleSizeChange,
        handleCurrentChange,
        searchNameQuery,
        searchStudentIdQuery,
        filteredStudent,
        pageNum,
        pageSize
    };
}