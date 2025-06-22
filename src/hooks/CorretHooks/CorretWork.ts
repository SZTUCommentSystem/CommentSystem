import { reactive, computed } from 'vue';
import type { Ref } from 'vue';
import { uploadFileAPI } from '@/api/login'
import { ElMessage } from 'element-plus';

interface StudentTask {
  homeworkStudentId: number
  studentId: number
  infoState: string
  answerInfo: string
  answerUrls: string
  infoCorrect: string
  infoNum: number
}

export default function CorrectWork(submitStudentTask: Ref<StudentTask>) {
    // 图片删除
    const deleteImgShow = reactive<boolean[]>([]);
    const deleteImg = (index: number) => {
        newImgs.splice(index, 1);
        deleteImgShow.splice(index, 1);
    }

    // 图片处理
    const newImgs = reactive<string[]>([]);
    const previewsImgUrl = computed(() => {
        return submitStudentTask.value.answerUrls
            ? submitStudentTask.value.answerUrls.split(',')
            : [];
    });

    const cropperObj = reactive({
        cVisible: false, // 显示切图弹框
        ctitle: "", // 弹框标题
        get previewsImgUrl() {
            return previewsImgUrl.value;
        },
        // 开启剪切弹框
        openCropperView: () => {
            cropperObj.ctitle = "图片处理"
            cropperObj.cVisible = true
        },
        // 关闭弹框所触发的事件
        closeCropperView: () => {
            cropperObj.cVisible = false
        },
    })

    // 上传图片并展示
    const uploadAndShowImg = async (form: FormData) => {
        const res = await uploadFileAPI(form);
        if (res.data.code === 200) {
            ElMessage.success('批注成功')
            newImgs.push(res.data.url);
            deleteImgShow.push(false);
        } else {
            ElMessage.error('批注失败')
        }
        cropperObj.closeCropperView();
    }

    return {
        deleteImgShow,
        deleteImg,
        newImgs,
        cropperObj,
        uploadAndShowImg
    }
}