require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root', // можно указать значения по умолчанию
    password: process.env.DB_PASSWORD || '',  // пустое значение если нет переменной окружения
    database: process.env.DB_NAME || 'database_development',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    logging: false, 
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
