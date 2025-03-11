module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Files', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // автоматически увеличиваемый идентификатор
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,  // обязательное поле для связи с пользователем
        references: {
          model: 'Users',  // Ссылка на таблицу Users
          key: 'id',
        },
        onDelete: 'CASCADE',  // При удалении пользователя все его файлы также удаляются
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,  // Название файла обязательно
      },
      extension: {
        type: Sequelize.STRING,
        allowNull: false,  // Расширение файла обязательно
      },
      mimeType: {
        type: Sequelize.STRING,
        allowNull: false,  // MIME тип файла обязателен
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,  // Размер файла обязателен
      },
      uploadDate: {
        type: Sequelize.DATE,
        allowNull: false,  // Дата загрузки файла обязательна
        defaultValue: Sequelize.NOW,  // Устанавливается текущая дата по умолчанию
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,  // Путь к файлу обязательно
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
    await queryInterface.dropTable('Files');  // Удаление таблицы
  }
};
