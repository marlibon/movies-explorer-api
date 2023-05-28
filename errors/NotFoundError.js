const http2 = require('http2');

const {
  HTTP_STATUS_NOT_FOUND, // 404
} = http2.constants;

class NotFoundError extends Error {
  constructor(message = 'Данные не найдены') {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}
module.exports = {
  NotFoundError,
};
