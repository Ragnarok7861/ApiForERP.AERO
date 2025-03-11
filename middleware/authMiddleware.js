const jwt = require('jsonwebtoken');

module.exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("Получен токен:", token);

  if (!token) {
    console.log("Токен не найден");
    return res.status(401).json({ message: 'Токен не найден' });
  }

  try {
    console.log("Используем секретный ключ для верификации:", process.env.JWT_REFRESH_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    console.log("Токен успешно декодирован:", decoded);

    if (!decoded || !decoded.id) {
      console.log("Ошибка: В декодированном токене нет id");
      return res.status(401).json({ message: 'Неверный токен, id отсутствует' });
    }

    req.user = decoded;
    console.log("Информация о пользователе в req.user:", req.user);

    next();  // Переходим к следующему обработчику
  } catch (error) {
    console.error("Ошибка при верификации токена:", error);
    return res.status(401).json({ message: 'Неверный токен' });
  }
};


module.exports.authenticateFileRoutes = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Токен не найден' });
  }

  try {
    // Декодируем токен с использованием JWT_SECRET для файловых маршрутов
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Для файлов используем JWT_SECRET
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Ошибка: Токен истек');
      return res.status(401).json({ message: 'Токен истек, пожалуйста, обновите токен' });
    }
    console.log('Ошибка при верификации токена для файловых маршрутов:', error);
    return res.status(401).json({ message: 'Неверный токен' });
  }
};