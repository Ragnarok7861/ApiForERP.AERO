const multer = require('multer');
const path = require('path');

// Настроим хранилище для файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Папка для сохранения файлов
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // Сохраняем файл с оригинальным именем
  }
});

// Проверка файлов
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Максимальный размер файла 10MB
  fileFilter: (req, file, cb) => {
    // Разрешенные типы файлов
    const fileTypes = /jpeg|jpg|png|gif|pdf|docx|txt/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    console.log(`File name: ${file.originalname}`);
    console.log(`File extension: ${path.extname(file.originalname).toLowerCase()}`);
    console.log(`File MIME type: ${file.mimetype}`);
    console.log(`MIME check: ${mimetype}`);
    console.log(`Extension check: ${extname}`);

    // Дополнительная поддержка MIME типа для .docx и .txt
    const validDocxMimeTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/octet-stream'
    ];
    const isDocxValid = validDocxMimeTypes.includes(file.mimetype);
    const isTextFileValid = file.mimetype === 'text/plain';  // Допускаем .txt файлы

    if (extname && (mimetype || isDocxValid || isTextFileValid)) {
      return cb(null, true);  // Файл валидный
    } else {
      // Ошибка, если тип файла не поддерживается
      cb(new Error('Неверный тип файла. Поддерживаемые типы: jpeg, jpg, png, gif, pdf, docx, txt.'));
    }
  }
});

module.exports = upload;
