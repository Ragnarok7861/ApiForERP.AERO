const express = require('express');
const app = express();
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes'); // Подключаем маршруты для работы с файлами
const authRoutes = require('./routes/authRoutes'); // Подключаем маршруты для аутентификации
const authMiddleware = require('./middleware/authMiddleware'); // Подключаем middleware для проверки токенов
const { sequelize } = require('./models'); // Подключаем sequelize для работы с базой данных

// Настройки middleware
app.use(cors()); // Разрешаем CORS
app.use(express.json()); // Для парсинга JSON данных

// Применяем маршруты
app.use('/api/files', fileRoutes); // Маршруты для файлов
app.use('/api/users', authRoutes); // Маршруты для аутентификации

// Стартуем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Сервер запущен на порту ${PORT}`);

  try {
    await sequelize.authenticate(); // Проверяем подключение к базе данных
    console.log('Соединение с базой данных установлено успешно.');
  } catch (error) {
    console.error('Не удалось подключиться к базе данных:', error);
  }
});
