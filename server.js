import express from 'express';
import multer from 'multer';
import { join, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// 获取当前模块的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 设置存储引擎
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = join(__dirname, 'uploads');
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// 初始化上传
const upload = multer({ storage: storage });

// 处理上传请求
app.post('/upload', upload.single('avatarfile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imgUrl = `/uploads/${req.file.filename}`;
    // console.log(`File uploaded to: ${imgUrl}`); // 添加日志
    res.json({ imgUrl: imgUrl });
});

// 提供静态文件服务
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});