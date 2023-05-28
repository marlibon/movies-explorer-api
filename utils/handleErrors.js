const mongoose = require('mongoose');
const http2 = require('http2');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const {
  HTTP_STATUS_CREATED, // 201
  HTTP_STATUS_BAD_REQUEST, // 400
  HTTP_STATUS_CONFLICT, // 409
  HTTP_STATUS_INTERNAL_SERVER_ERROR, // 500
} = http2.constants;
const { CastError, ValidationError } = mongoose.Error;

function handleErrors (error, response) {
  if (error.code === 11000) {
    return response.status(HTTP_STATUS_CONFLICT).send({ message: 'Пользователь с данным email уже существует' });
  }
  if (error instanceof NotFoundError
    || error instanceof UnauthorizedError
    || error instanceof ForbiddenError) {
    const { message } = error;
    return response.status(error.statusCode).send({ message });
  }
  if (error instanceof CastError || error instanceof ValidationError) {
    return response.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  }
  return response.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
}

module.exports = {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  handleErrors,
  NotFoundError,
  UnauthorizedError,
};
