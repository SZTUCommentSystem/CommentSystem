<template>
    <el-dialog 
        :title="title" 
        :modelValue="dialogVisible" 
        :show-close="true" 
        :close-on-click-modal="false"
        :close-on-press-escape="false" 
        :before-close="closeDialog" 
        destroy-on-close width="60%"
    >
        <div class="drawing-container">
            <!-- 切换页面 -->
            <el-button class="prev" @click="loadPrevImage">&lt;</el-button>
            <el-button class="next" @click="loadNextImage">&gt;</el-button>
            <!-- 绘图组件容器DOM -->
            <div id="tui-image-editor"></div>
            <el-button class="save" type="primary" @click="save">保存</el-button>
        </div>

    </el-dialog>
</template>
<script setup>
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import ImageEditor from 'tui-image-editor'

import { ref, onMounted, nextTick, defineProps, defineEmits } from 'vue'

import { ElMessage } from 'element-plus'
// 中文菜单
const locale_zh = {
    ZoomIn: '放大',
    ZoomOut: '缩小',
    Hand: '手掌',
    History: '历史',
    Resize: '调整宽高',
    Crop: '裁剪',
    DeleteAll: '全部删除',
    Delete: '删除',
    Undo: '撤销',
    Redo: '反撤销',
    Reset: '重置',
    Flip: '镜像',
    Rotate: '旋转',
    Draw: '画',
    Shape: '形状标注',
    Icon: '图标标注',
    Text: '文字标注',
    Mask: '遮罩',
    Filter: '滤镜',
    Bold: '加粗',
    Italic: '斜体',
    Underline: '下划线',
    Left: '左对齐',
    Center: '居中',
    Right: '右对齐',
    Color: '颜色',
    'Text size': '字体大小',
    Custom: '自定义',
    Square: '正方形',
    Apply: '应用',
    Cancel: '取消',
    'Flip X': 'X 轴',
    'Flip Y': 'Y 轴',
    Range: '区间',
    Stroke: '描边',
    Fill: '填充',
    Circle: '圆',
    Triangle: '三角',
    Rectangle: '矩形',
    Free: '曲线',
    Straight: '直线',
    Arrow: '箭头',
    'Arrow-2': '箭头2',
    'Arrow-3': '箭头3',
    'Star-1': '星星1',
    'Star-2': '星星2',
    Polygon: '多边形',
    Location: '定位',
    Heart: '心形',
    Bubble: '气泡',
    'Custom icon': '自定义图标',
    'Load Mask Image': '加载蒙层图片',
    Grayscale: '灰度',
    Blur: '模糊',
    Sharpen: '锐化',
    Emboss: '浮雕',
    'Remove White': '除去白色',
    Distance: '距离',
    Brightness: '亮度',
    Noise: '噪音',
    'Color Filter': '彩色滤镜',
    Sepia: '棕色',
    Sepia2: '棕色2',
    Invert: '负片',
    Pixelate: '像素化',
    Threshold: '阈值',
    Tint: '色调',
    Multiply: '正片叠底',
    Blend: '混合色',
    Width: '宽度',
    Height: '高度',
    'Lock Aspect Ratio': '锁定宽高比例'
}

// 画布组件自定义样式
const customTheme = {
    "common.bi.image": "", // 左上角logo图片
    "common.bisize.width": "0px",
    "common.bisize.height": "0px",
    "common.backgroundImage": "none",
    "common.backgroundColor": "#f3f4f6",
    "common.border": "1px solid #333",

    // header
    "header.backgroundImage": "none",
    "header.backgroundColor": "#f3f4f6",
    "header.border": "0px",

    // load button
    "loadButton.backgroundColor": "#fff",
    "loadButton.border": "1px solid #ddd",
    "loadButton.color": "#222",
    "loadButton.fontFamily": "NotoSans, sans-serif",
    "loadButton.fontSize": "12px",
    "loadButton.display": "none", // 可以直接隐藏掉

    // download button
    "downloadButton.backgroundColor": "#fdba3b",
    "downloadButton.border": "1px solid #fdba3b",
    "downloadButton.color": "#fff",
    "downloadButton.fontFamily": "NotoSans, sans-serif",
    "downloadButton.fontSize": "12px",
    "downloadButton.display": "none", // 可以直接隐藏掉

    // icons default
    "menu.normalIcon.color": "#8a8a8a",
    "menu.activeIcon.color": "#555555",
    "menu.disabledIcon.color": "#ccc",
    "menu.hoverIcon.color": "#e9e9e9",
    "submenu.normalIcon.color": "#8a8a8a",
    "submenu.activeIcon.color": "#e9e9e9",

    "menu.iconSize.width": "24px",
    "menu.iconSize.height": "24px",
    "submenu.iconSize.width": "32px",
    "submenu.iconSize.height": "32px",

    // submenu primary color
    "submenu.backgroundColor": "#1e1e1e",
    "submenu.partition.color": "#858585",

    // submenu labels
    "submenu.normalLabel.color": "#858585",
    "submenu.normalLabel.fontWeight": "lighter",
    "submenu.activeLabel.color": "#fff",
    "submenu.activeLabel.fontWeight": "lighter",

    // checkbox style
    "checkbox.border": "1px solid #ccc",
    "checkbox.backgroundColor": "#fff",

    // rango style
    "range.pointer.color": "#fff",
    "range.bar.color": "#666",
    "range.subbar.color": "#d1d1d1",

    "range.disabledPointer.color": "#414141",
    "range.disabledBar.color": "#282828",
    "range.disabledSubbar.color": "#414141",

    "range.value.color": "#fff",
    "range.value.fontWeight": "lighter",
    "range.value.fontSize": "11px",
    "range.value.border": "1px solid #353535",
    "range.value.backgroundColor": "#151515",
    "range.title.color": "#fff",
    "range.title.fontWeight": "lighter",

    // colorpicker style
    "colorpicker.button.border": "1px solid #1e1e1e",
    "colorpicker.title.color": "#fff",
};

// props
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: "",
    },
    imgUrl: {
        type: Array,
        required: true,
    },

});
const emit = defineEmits(['uploadAndShowImg'])
const instance = ref(null)

// 关闭弹框
const closeDialog = () => {
    emit('closeCropperDialog')
}

const currentImageIndex = ref(0) // 当前图片索引
const init = () => {
    instance.value = new ImageEditor(document.querySelector('#tui-image-editor'), {
        includeUI: {
            loadImage: {
                path: props.imgUrl[currentImageIndex.value],
                name: 'image'
            },
            menu: ['resize', 'crop', 'rotate', 'draw', 'shape', 'icon', 'text', 'filter'], // 底部菜单按钮列表 隐藏镜像flip和遮罩mask
            initMenu: 'draw', // 默认打开的菜单项
            menuBarPosition: 'bottom', // 菜单所在的位置
            locale: locale_zh, // 本地化语言为中文
            theme: customTheme // 自定义样式
        },
        cssMaxWidth: 1000, // canvas 最大宽度
        cssMaxHeight: 1200 // canvas 最大高度
    })
    document.getElementsByClassName('tui-image-editor-main')[0].style.top = '45px' // 调整图片显示位置
    document.getElementsByClassName('tie-btn-reset tui-image-editor-item help')[0].style.display = 'none' // 隐藏顶部重置按钮
}

const loadNextImage = () => {
    currentImageIndex.value++;
    if (currentImageIndex.value >= props.imgUrl.length) {
        currentImageIndex.value = 0;
    }
    instance.value.loadImageFromURL(props.imgUrl[currentImageIndex.value], 'image').then(() => {
        console.log(`Loaded image: ${props.imgUrl[currentImageIndex.value]}`);
    }).catch(err => {
        console.error(`Failed to load image: ${props.imgUrl[currentImageIndex.value]}`, err);
    });
};

const loadPrevImage = () => {
    currentImageIndex.value--;
    if (currentImageIndex.value < 0) {
        currentImageIndex.value = props.imgUrl.length - 1;
    }
    instance.value.loadImageFromURL(props.imgUrl[currentImageIndex.value], 'image').then(() => {
        console.log(`Loaded image: ${props.imgUrl[currentImageIndex.value]}`);
    }).catch(err => {
        console.error(`Failed to load image: ${props.imgUrl[currentImageIndex.value]}`, err);
    });
};


// 保存图片，并上传
const save = () => {
    const base64String = instance.value.toDataURL()
    const data = window.atob(base64String.split(',')[1])
    const ia = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i)
    }
    const fileName = `sign_${Date.now()}.png`
    // 用 File 替换 Blob
    const file = new File([ia], fileName, { type: 'image/png' })
    const form = new FormData()
    form.append("file", file)

    // const res = uploadFileAPI(form);
    // debugger
    // if (res.code == 200) {
    //     emit('getNewImg', res.url);
    //     closeDialog()
    // } else {
    //     ElMessage.error('上传失败')
    // }
    emit('uploadAndShowImg', form)
}

onMounted(() => {
    nextTick(() => {
        init() // 页面创建完成后调用
    })
})
</script>

<style scoped>
.drawing-container {
    width: 100%;
    height: 80vh;
    position: relative;

    .save {
        position: absolute;
        right: 50px;
        top: 15px;
    }
}
</style>
