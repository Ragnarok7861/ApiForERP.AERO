const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { authenticate, syncModels } = require('./models/index.js');  // Импортируем функцию синхронизации

dotenv.config();  // Загружаем переменные окружения

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'ERP Aero API успешно запущен!' });
});

// Запуск сервера на порту из .env или 5000 по умолчанию
const PORT = process.env.PORT || 5000;

(async () => {
    try {
      await authenticate();
      await syncModels();
      app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на порту ${PORT}`);
      });
    } catch (error) {
      console.error('❌ Ошибка при запуске сервера:', error);
    }
  })();
  
