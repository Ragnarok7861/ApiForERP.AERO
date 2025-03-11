const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Token } = require('../models');  // Модели User и Token

// Регистрация нового пользователя
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Пытаемся зарегистрировать пользователя:', { email });

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("Пользователь с таким email уже существует");
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Пароль хеширован:', hashedPassword);

    // Создаем нового пользователя
    const user = await User.create({ email, password: hashedPassword });
    console.log('Пользователь создан:', user);

    // Генерация токенов
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    console.log("Данные для токенов: ", { id: user.id, email: user.email });
    console.log("Сгенерированные токены: ", { accessToken, refreshToken });

    // Сохраняем refresh token в базе данных
    await Token.create({ userId: user.id, refreshToken, isActive: true });
    console.log('Refresh token сохранен в базе данных');

    return res.status(201).json({ message: 'Пользователь успешно зарегистрирован', accessToken, refreshToken });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    return res.status(500).json({ message: 'Ошибка при регистрации пользователя', error });
  }
};

// Вход в систему
exports.signin = async (req, res) => {
  const { email, password, deviceId, deviceInfo } = req.body;

  try {
    console.log('Попытка входа с email:', email);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("Пользователь не найден");
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Проверяем правильность пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Неверный пароль");
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    // Генерация токенов
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    console.log("Данные для токенов: ", { id: user.id, email: user.email });
    console.log("Сгенерированные токены: ", { accessToken, refreshToken });

    // Сохраняем refresh token для устройства
    await Token.create({
      userId: user.id,
      refreshToken,
      deviceId,
      deviceInfo,
      isActive: true
    });

    return res.status(200).json({ message: 'Вход успешен', accessToken, refreshToken });
  } catch (error) {
    console.error('Ошибка при входе в систему:', error);
    return res.status(500).json({ message: 'Ошибка при входе в систему', error });
  }
};

// Обновление токенов
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    console.log('Получен refreshToken:', refreshToken);

    // Проверяем и декодируем refreshToken
    console.log('Используем секретный ключ для проверки:', process.env.JWT_REFRESH_SECRET);
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log('Токен успешно декодирован:', decoded);

    if (!decoded || !decoded.id) {
      console.log('Ошибка в токене: отсутствует id');
      return res.status(401).json({ message: 'Неверный токен' });
    }

    // Создаем новые токены
    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const newRefreshToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    console.log('Сгенерированы новые токены: accessToken, newRefreshToken');

    return res.status(200).json({ accessToken, newRefreshToken });
  } catch (error) {
    console.error('Ошибка при обновлении токенов:', error);
    return res.status(500).json({ message: 'Ошибка при обновлении токенов' });
  }
};

// Выход из системы
exports.logout = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Получаем refresh token из заголовка
  
  if (!token) {
    return res.status(400).json({ message: 'Refresh token не предоставлен' });
  }

  try {
    // Декодируем токен с использованием секретного ключа для refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    // Логика выхода (например, деактивация токена в базе данных)
    // Например, вы можете найти токен в базе данных и обновить его статус на неактивный
    
    await Token.update(
      { isActive: false },
      { where: { refreshToken: token } }
    );
    
    return res.status(200).json({ message: 'Выход выполнен успешно' });
  } catch (error) {
    console.error('Ошибка при выходе:', error);
    return res.status(500).json({ message: 'Ошибка при выходе' });
  }
};


// Получение информации о пользователе
exports.getInfo = async (req, res) => {
  try {
    console.log('Запрос информации о пользователе:', req.user);  // Логируем req.user

    if (!req.user) {
      return res.status(401).json({ message: 'Токен не был расшифрован, пользователь не найден' });
    }

    // Находим пользователя по ID из токена
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.status(200).json({ message: 'Информация о пользователе', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Ошибка при получении информации о пользователе:', error);  // Логируем ошибку
    return res.status(500).json({ message: 'Ошибка при получении информации о пользователе', error });
  }
};

