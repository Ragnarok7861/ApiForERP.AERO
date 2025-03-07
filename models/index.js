const { Sequelize } = require('sequelize');
const config = require('../config/config.js'); // Импортируем конфигурацию

// Создаем подключение Sequelize
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect,
  dialectOptions: config.development.dialectOptions,
  logging: config.development.logging,
});

// Импортируем модели после создания `sequelize`
const User = require('./user.js')(sequelize);
const File = require('./file.js')(sequelize);
const Token = require('./token.js')(sequelize);

// Функция для проверки подключения
async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к базе данных успешно!');
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
  }
}

// Синхронизация моделей
async function syncModels() {
  try {
    await sequelize.sync({ force: false });  // Не удаляем таблицы, если они существуют
    console.log('✅ Таблицы успешно созданы или обновлены');
  } catch (error) {
    console.error('❌ Ошибка синхронизации моделей с базой данных:', error);
  }
}

// Экспортируем sequelize и функцию authenticate
module.exports = { sequelize, authenticate, syncModels };
