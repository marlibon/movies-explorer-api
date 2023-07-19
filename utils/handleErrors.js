const mongoose = require("mongoose");
const http2 = require("http2");
const { ForbiddenError } = require("../errors/ForbiddenError"); // 403
const { NotFoundError } = require("../errors/NotFoundError"); // 404
const { UnauthorizedError } = require("../errors/UnauthorizedError"); // 401
const { ConflictError } = require("../errors/ConflictError"); // 409

const {
  HTTP_STATUS_CREATED, // 201
  HTTP_STATUS_BAD_REQUEST, // 400
  HTTP_STATUS_CONFLICT, // 409
  HTTP_STATUS_INTERNAL_SERVER_ERROR, // 500
} = http2.constants;
const { CastError, ValidationError } = mongoose.Error;

function handleErrors (error, response) {
  console.log(error);
  if (error.code === 11000) {
    return response.status(HTTP_STATUS_CONFLICT).send({
      message:
        "Ошибка добавления. Данные должны быть уникальными, в базе уже есть добавляемая информация",
    });
  }
  if (
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError ||
    error instanceof ConflictError ||
    error instanceof ForbiddenError
  ) {
    const { message } = error;
    return response.status(error.statusCode).send({ message });
  }
  if (error instanceof CastError || error instanceof ValidationError) {
    return response
      .status(HTTP_STATUS_BAD_REQUEST)
      .send({ message: "Переданы некорректные данные" });
  }
  return response
    .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: "На сервере произошла ошибка" });
}

module.exports = {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  handleErrors,
  NotFoundError,
  UnauthorizedError,
};
