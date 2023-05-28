const http2 = require('http2');

const {
  HTTP_STATUS_FORBIDDEN, // 403
} = http2.constants;

class ForbiddenError extends Error {
  constructor(message = 'Ошибка доступа') {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}
module.exports = {
  ForbiddenError,
};
