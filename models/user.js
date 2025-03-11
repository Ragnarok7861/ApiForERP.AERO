module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // автоматически увеличиваемый идентификатор
      },
      email: {
        type: DataTypes.STRING,
        unique: true,  // email уникален
        allowNull: false,  // обязательное поле
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,  // обязательное поле
      },
    }, {
      // Дополнительные опции модели
      tableName: 'Users',  // Имя таблицы в базе данных
      timestamps: true,  // Sequelize автоматически добавит createdAt и updatedAt
    });
  
    // Ассоциации (если нужно)
    User.associate = function (models) {
      // Можно добавить ассоциации с другими моделями
      // Например:
      // User.hasMany(models.File);  // Один пользователь может иметь несколько файлов
    };
  
    return User;
  };
  