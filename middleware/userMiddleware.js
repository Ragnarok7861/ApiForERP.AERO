const { User } = require('../models');  // Импортируем модель User

module.exports.checkEmailExist = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    next();  // Продолжаем выполнение запроса
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при проверке email', error });
  }
};
