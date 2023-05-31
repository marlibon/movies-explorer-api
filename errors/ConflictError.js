const http2 = require("http2");

const {
  HTTP_STATUS_CONFLICT, // 409
} = http2.constants;

class ConflictError extends Error {
  constructor(
    message = "Ошибка добавления. Данные должны быть уникальными, в базе уже есть добавляемая информация"
  ) {
    super(message);
    this.statusCode = HTTP_STATUS_CONFLICT;
  }
}
module.exports = {
  ConflictError,
};
