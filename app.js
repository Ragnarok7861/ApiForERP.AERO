// Подключаем модули
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');

// Инициализация Express-приложения
const app = express();

// Middleware для обработки CORS и JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'ERP Aero API успешно запущен!' });
});

// Запуск сервера на порту из .env или 5000 по умолчанию
const PORT = process.env.PORT || 5000;
 app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`🚀 Сервер запущен на порту ${PORT}, соединение с БД успешно!`)
    } catch (error) {
        console.error('Ошибка подключения к БД:', error)
    }
    
  
});
