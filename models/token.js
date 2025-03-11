module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
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
        onDelete: 'CASCADE',  // При удалении пользователя все токены пользователя будут удалены
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,  // Refresh токен обязателен
      },
      deviceId: {
        type: DataTypes.STRING,
        allowNull: true,  // Уникальный идентификатор устройства
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Токен активен по умолчанию
      },
      deviceInfo: {
        type: DataTypes.STRING,
        allowNull: true,  // Информация о устройстве
      },
    }, {
      // Дополнительные опции модели
      tableName: 'Tokens',  // Имя таблицы в базе данных
      timestamps: true,  // Sequelize автоматически добавит createdAt и updatedAt
    });
  
    // Ассоциации
    Token.associate = function (models) {
      // Один токен принадлежит одному пользователю
      Token.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Token;
  };
  