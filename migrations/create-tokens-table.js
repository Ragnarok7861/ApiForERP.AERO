module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // автоматически увеличиваемый идентификатор
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,  // Обязательное поле для связи с пользователем
        references: {
          model: 'Users',  // Ссылка на таблицу Users
          key: 'id',
        },
        onDelete: 'CASCADE',  // При удалении пользователя все токены пользователя будут удалены
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false,  // Refresh токен обязателен
      },
      deviceId: {
        type: Sequelize.STRING,
        allowNull: true,  // Уникальный идентификатор устройства, с которого был выдан токен
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // По умолчанию токен активен
      },
      deviceInfo: {
        type: Sequelize.STRING,
        allowNull: true,  // Информация о устройстве (не обязательное поле)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Устанавливается текущая дата по умолчанию
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Устанавливается текущая дата по умолчанию
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tokens');  // Удаление таблицы
  }
};
