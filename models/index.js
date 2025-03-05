const { Sequelize } = require('sequelize');
const config = require('../config/config').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    dialectOptions: config.dialectOptions,
    logging: config.logging,
  }
);

// Проверка подключения к базе данных
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Подключение к базе данных успешно!');
  })
  .catch((err) => {
    console.error('❌ Ошибка подключения к базе данных:', err);
  });

module.exports = sequelize;
