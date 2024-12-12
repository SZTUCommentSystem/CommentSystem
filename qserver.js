import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const app = express();
const port = 3000;

// 获取当前文件的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 使用 CORS 中间件
app.use(cors());

// 设置存储引擎
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// 初始化上传
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 限制文件大小为10MB
}).single('avatarfile');

// 处理图片上传请求
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ url: fullUrl });
    });
});

// 提供静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});