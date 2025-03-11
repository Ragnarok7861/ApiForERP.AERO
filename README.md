# ApiForERP.AERO
Проект представляет собой RESTful API для управления файлами и пользователями. Включает в себя функциональность для аутентификации, работы с файлами (загрузка, удаление, получение и обновление) и управления токенами.

Описание
API предоставляет следующие возможности:

Регистрация и аутентификация пользователей.
Работа с токенами: создание, обновление и выход из системы.
Загрузка, удаление, обновление и скачивание файлов.
Поддержка пагинации для вывода списка файлов.

Технологии
Node.js — серверная платформа.
Express — для маршрутизации.
Sequelize ORM — для работы с базой данных (MySQL).
JSON Web Tokens (JWT) — для аутентификации и работы с токенами.
Multer — для обработки multipart/form-data (файлы).
dotenv — для работы с переменными окружения.

Установка
Клонируйте репозиторий:

git clone https://github.com/yourusername/ApiForERP-AERO.git

Перейдите в директорию проекта:

cd ApiForERP-AERO

Установите зависимости:

npm install


Создайте файл .env в корне проекта и добавьте необходимые переменные:

DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret


Запуск проекта
Запустите проект:

npm run dev

Проект будет доступен по адресу: http://localhost:3000

Использование API
Регистрация пользователя
POST /api/users/signup

Тело запроса:
{
  "email": "user@example.com",
  "password": "your_password"
}

Ответ:

{
  "message": "Пользователь успешно зарегистрирован"
}

Вход в систему
POST /api/users/signin

Тело запроса:

{
  "email": "user@example.com",
  "password": "your_password"
}

Ответ:
{
  "accessToken": "your_access_token",
  "refreshToken": "your_refresh_token"
}

Обновление токенов
POST /api/users/signin/new_token

Тело запроса:
{
  "refreshToken": "your_refresh_token"
}

Ответ:
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJ1c2VyMTE0MTJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDE2Njg2MTMsImV4cCI6MTc0MTY2OTIxM30.mGZu5UID6XCUyaexe_q6rALsCZj1MA1eUT4lHprlYO0",
    "newRefreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJ1c2VyMTE0MTJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDE2Njg2MTMsImV4cCI6MTc0MjI3MzQxM30.tbtpYjbsugQu2plbMplXppuZLdn3LLyikLXChEaL1_U"
}


Загрузка файла
POST /api/files/upload

Тело запроса: загрузите файл в формате multipart/form-data.

Ответ:
{
  "message": "Файл успешно загружен"
}

Скачивание файла
GET /api/files/download/:id

Ответ:

Файл будет скачан по указанному ID.
Получение списка файлов
GET /api/files/list?page=1&list_size=10

Ответ:
{
  "files": [
    {
      "id": 1,
      "name": "file1.jpg",
      "size": 123456,
      "mimeType": "image/jpeg",
      "uploadDate": "2025-03-01"
    },
    ...
  ]
}

Удаление файла
DELETE /api/files/delete/:id

Ответ:
{
  "message": "Файл успешно удален"
}
