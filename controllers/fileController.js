const path = require('path');
const fs = require('fs');
const { File } = require('../models');  // Импортируем модель File

// Загрузка файла
exports.uploadFile = async (req, res) => {
  try {
    // Проверка наличия файла
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не был загружен' });
    }

    // Путь к файлу в хранилище
    const filePath = path.join(__dirname, '../uploads', req.file.filename);

    // Данные о файле
    const fileData = {
      userId: req.user.id,  // id пользователя, который загрузил файл
      name: req.file.originalname,
      extension: path.extname(req.file.originalname),
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: filePath,
    };

    // Сохранение данных о файле в базе данных
    const file = await File.create(fileData);

    return res.status(200).json({
      message: 'Файл успешно загружен',
      file,  // Возвращаем данные о файле
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    return res.status(500).json({ message: 'Ошибка при загрузке файла' });
  }
};

// Получение информации о файле
exports.getFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Находим файл по id
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: 'Файл не найден' });
    }

    return res.status(200).json({ message: 'Информация о файле', file });
  } catch (error) {
    console.error('Ошибка при получении информации о файле:', error);
    return res.status(500).json({ message: 'Ошибка при получении информации о файле' });
  }
};

// Получение списка файлов
exports.getFiles = async (req, res) => {
  try {
    const { page = 1, list_size = 10 } = req.query;  // Параметры пагинации
    const offset = (page - 1) * list_size;

    // Получаем список файлов с пагинацией
    const files = await File.findAll({
      where: { userId: req.user.id },
      limit: +list_size,
      offset,
    });

    return res.status(200).json({
      message: 'Список файлов',
      files,
    });
  } catch (error) {
    console.error('Ошибка при получении списка файлов:', error);
    return res.status(500).json({ message: 'Ошибка при получении списка файлов' });
  }
};

// Удаление файла
exports.deleteFile = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Находим файл по ID
      const file = await File.findByPk(id);
      
      if (!file) {
        return res.status(404).json({ message: 'Файл не найден' });
      }
  
      // Формируем путь к файлу
      const filePath = path.join(__dirname, '../uploads', file.name);
      console.log('Пытаемся удалить файл по пути:', filePath); // Логируем путь к файлу для отладки
  
      // Проверяем, существует ли файл по указанному пути
      if (fs.existsSync(filePath)) {
        // Удаляем файл с диска
        fs.unlinkSync(filePath);
        console.log('Файл успешно удален:', filePath);
      } else {
        console.log('Файл не найден для удаления:', filePath);
      }
  
      // Удаляем файл из базы данных
      await file.destroy();
  
      return res.status(200).json({ message: 'Файл успешно удален' });
  
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
      return res.status(500).json({ message: 'Ошибка при удалении файла' });
    }
  };

// Скачивание файла
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Находим файл по id
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: 'Файл не найден' });
    }

    // Скачиваем файл
    const filePath = path.join(__dirname, '../uploads', file.name);
    res.download(filePath, file.name);
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
    return res.status(500).json({ message: 'Ошибка при скачивании файла' });
  }
};

// Обновление файла
exports.updateFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Находим файл по id
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: 'Файл не найден' });
    }

    // Удаляем старый файл с диска
    const oldFilePath = path.join(__dirname, '../uploads', file.name);
    fs.unlinkSync(oldFilePath);

    // Заменяем файл на новый
    const updatedFile = req.file;

    // Обновляем запись в базе данных
    file.name = updatedFile.filename;
    file.originalName = updatedFile.originalname;
    file.extension = path.extname(updatedFile.originalname);
    file.mimeType = updatedFile.mimetype;
    file.size = updatedFile.size;
    file.path = path.join(__dirname, '../uploads', updatedFile.filename);

    await file.save();

    return res.status(200).json({ message: 'Файл обновлен', file });
  } catch (error) {
    console.error('Ошибка при обновлении файла:', error);
    return res.status(500).json({ message: 'Ошибка при обновлении файла' });
  }
};
