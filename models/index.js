'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();  // Загружаем переменные окружения из .env

// Настройка пути и имени файла
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

// Инициализация экземпляра Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Функция для проверки подключения к базе данных
const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');
  } catch (error) {
    console.error('Невозможно подключиться к базе данных:', error);
  }
};

// Функция для синхронизации моделей с базой данных
const syncModels = async () => {
  try {
    await sequelize.sync({ force: false });  // Синхронизируем модели с базой данных
    console.log('Модели успешно синхронизированы с базой данных.');
  } catch (error) {
    console.error('Ошибка при синхронизации моделей:', error);
  }
};

// Динамическая загрузка моделей
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Создание ассоциаций между моделями (если они есть)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Экспортируем sequelize и все модели
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.authenticate = authenticate;  // Добавляем функцию authenticate для использования в app.js
db.syncModels = syncModels;      // Добавляем функцию syncModels для использования в app.js

module.exports = db;
