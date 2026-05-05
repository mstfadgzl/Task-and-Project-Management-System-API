const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const multer = require('multer');
const fs = require('fs');

// Multer Ayarları (Klasör yoksa oluştur)
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Görev işlemleri
router.get('/', taskController.getTasks);
router.patch('/:taskId/status', taskController.updateTaskStatus);
router.post('/:taskId/attachments', upload.single('file'), taskController.uploadAttachment);

module.exports = router;