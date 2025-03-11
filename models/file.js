module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // автоматически увеличиваемый идентификатор
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,  // Обязательное поле для связи с пользователем
        references: {
          model: 'Users',  // Ссылка на таблицу Users
          key: 'id',
        },
        onDelete: 'CASCADE',  // При удалении пользователя все его файлы будут удалены
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,  // Название файла обязательно
      },
      extension: {
        type: DataTypes.STRING,
        allowNull: false,  // Расширение файла обязательно
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,  // MIME тип файла обязателен
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,  // Размер файла обязателен
      },
      uploadDate: {
        type: DataTypes.DATE,
        allowNull: false,  // Дата загрузки файла обязательна
        defaultValue: DataTypes.NOW,  // Устанавливается текущая дата по умолчанию
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,  // Путь к файлу обязателен
      },
    }, {
      // Дополнительные опции модели
      tableName: 'Files',  // Имя таблицы в базе данных
      timestamps: true,  // Sequelize автоматически добавит createdAt и updatedAt
    });
  
    // Ассоциации
    File.associate = function (models) {
      // Один файл может принадлежать одному пользователю
      File.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return File;
  };
  