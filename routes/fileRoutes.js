// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');  // Для загрузки файлов
const fileController = require('../controllers/fileController');  // Контроллеры для работы с файлами
const { authenticateFileRoutes } = require('../middleware/authMiddleware');  // Middleware для авторизации файловых маршрутов

// Маршруты для файлов
router.post('/upload', authenticateFileRoutes, upload.single('file'), fileController.uploadFile);
router.get('/list', authenticateFileRoutes, fileController.getFiles);
router.delete('/delete/:id', authenticateFileRoutes, fileController.deleteFile);
router.get('/:id', authenticateFileRoutes, fileController.getFile);
router.get('/download/:id', authenticateFileRoutes, fileController.downloadFile);
router.put('/update/:id', authenticateFileRoutes, upload.single('file'), fileController.updateFile);

module.exports = router;
