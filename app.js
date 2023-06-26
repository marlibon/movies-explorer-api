// подключаем модуль для работы с путями файлов
const path = require("path");
// подключаем ExpressJS
const express = require("express");
// подключаем модуль для работы с переменными окружения
require("dotenv").config();

// создаем приложение
const app = express();
// подключаем Mongoose для работы с MongoDB
const mongoose = require("mongoose");
// подключаем модуль cors для обработки CORS-запросов
const cors = require("cors");
// подключаем модуль для работы с куками
const cookieParser = require("cookie-parser");
// подключаем модуль celebrate для валидации данных
const { errors } = require("celebrate");
// подключаем переменные окружения
const helmet = require("helmet");
const { PORT, BASE_PATH, MONGODB_URI } = require("./config");
// подключаем роуты
const routes = require("./routes/index");
// подключаем логгер запросов и ошибок
const { requestLogger, errorLogger } = require("./middlewares/logger");
// подключаем функцию для обработки ошибок
const { handleErrors } = require("./utils/handleErrors");
// подключаем модуль чтобы убрать лишнюю информацию в ответе сервера (с целью безопасности)
// подключаем настройки для rateLimiter (ограничение одинаковых запросов по времени)
const { limiter } = require("./utils/rateLimiter");
// распарсим данные, которые пришли
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаем логгер запросов
app.use(requestLogger);

// для ограничения большого числа запросов
app.use(limiter);

// для безопасности (отключает информацию о сервере)
app.use(helmet());

// опции для заголовков. Разрешаем доступ с любого места и определяем доступные методы + заголовки
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://marlibon.nomoredomains.rocks",
    "http://marlibon.nomoredomains.rocks",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(cors(corsOptions));
// подключаемся к БД
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

// настройка роутов
app.use(routes);

// подключаем логгер ошибок
app.use(errorLogger);

// обработка ошибок celebrate
app.use(errors());

// обработка ошибок в миддлвэр
app.use((err, req, res, next) => {
  handleErrors(err, res, next);
});

// выводим index.html при обращении через браузер
app.use(express.static(path.join(__dirname, "public")));

// вывод в консоль информации, куда подключаться
app.listen(PORT, () => {
  console.log("Ссылка на сервер:", `${BASE_PATH}: ${PORT}`);
});
