const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { authenticate, syncModels } = require('./models/index.js');  // Импортируем функцию синхронизации
const authRoutes = require('./routes/authRoutes');  // Подключаем маршруты для пользователей

dotenv.config();  // Загружаем переменные окружения из .env

const app = express();

// Middleware
app.use(cors()); // Разрешаем CORS
app.use(express.json()); // Парсим JSON из тела запроса
app.use(express.urlencoded({ extended: true })); // Парсим данные из формы

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'ERP Aero API успешно запущен!' });
});

// Подключаем маршруты для пользователей
app.use('/api/users', authRoutes);  // Все маршруты для пользователей начинаются с /api/users

// Запуск сервера
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Проверка соединения с БД и синхронизация моделей
    await authenticate();  // Проверка подключения к базе данных
    await syncModels();  // Синхронизация моделей с базой данных

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Ошибка при запуске сервера:', error);
  }
})();

