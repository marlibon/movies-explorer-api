const http2 = require('http2');

const {
  HTTP_STATUS_UNAUTHORIZED, // 401
} = http2.constants;

class UnauthorizedError extends Error {
  constructor(message = 'Авторизация не удалась') {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}
module.exports = {
  UnauthorizedError,
};
