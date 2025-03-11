const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  // Подключаем контроллер
const authMiddleware = require('../middleware/authMiddleware');  // Подключаем middleware для аутентификации

// Регистрация нового пользователя
router.post('/signup', authController.signup);

// Вход в систему
router.post('/signin', authController.signin);

// Получение информации о пользователе
router.get('/info', authMiddleware.authenticate, authController.getInfo);

// Выход из системы
router.get('/logout', authMiddleware.authenticate, authController.logout);

router.post('/signin/new_token', authController.refreshToken);

module.exports = router;
