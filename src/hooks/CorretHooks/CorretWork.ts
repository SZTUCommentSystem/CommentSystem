import { reactive } from 'vue';
import testImage from "@/assets/测试1.png";
import testImage2 from "@/assets/测试2.png";

export default function CorrectWork() {
    //////////////// 批改
    // 图片删除
    const deleteImgShow = reactive<boolean[]>([]);
    const deleteImg = (index: number) => {
        newImgs.splice(index, 1);
    }


    // 图片处理
    const newImgs = reactive<string[]>([]);
    const cropperObj = reactive({
        cVisible: false, // 显示切图弹框
        ctitle: "", // 弹框标题
        previewsImgUrl: [testImage, testImage2], //图片地址
        // 开启剪切弹框
        openCropperView: () => {
            cropperObj.ctitle = "图片处理"
            cropperObj.cVisible = true
        },
        // 关闭弹框所触发的事件
        closeCropperView: (data: any) => {
            cropperObj.cVisible = false
        },
        // 获取处理完的图片
        getNewImg: (val: any) => {
            const serverUrl = 'http://localhost:3000';
            newImgs.push(serverUrl + val);
            deleteImgShow.push(false);
        }
    })


    // 处理文件上传，这个函数还没用到
    // const handleFileUpload = (event) => {
    //     const files = event.target.files;
    //     for (let i = 0; i < files.length; i++) {
    //         const file = files[i];
    //         const imageUrl = URL.createObjectURL(file);
    //         images.value.push(imageUrl);
    //     }
    // };

    return {
        deleteImgShow,
        deleteImg,
        newImgs,
        cropperObj
    }
}