const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Token = sequelize.define('Token', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deviceInfo: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
  });

  return Token;
};
