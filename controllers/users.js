const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HTTP_STATUS_CREATED, NotFoundError } = require("../utils/handleErrors");
const { JWT_SECRET } = require("../config");

module.exports.getCurrentUserData = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError("Пользователь не найден");
      }
    })
    .catch(next);
};

module.exports.getUserDataById = (req, res, next) => {
  const _id = req.params.userId;
  User.findById({ _id })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError("Пользователь не найден");
      }
    })
    .catch(next);
};

const generateTokenAndSendResponse = (res, user) => {
  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  const resp = {
    token,
    name: user.name,
    email: user.email,
    _id: user._id,
  };
  res
    .cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7дней
      sameSite: true,
      httpOnly: true,
    })
    .status(HTTP_STATUS_CREATED)
    .send(resp);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name })
        .then((user) => generateTokenAndSendResponse(res, user))
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => generateTokenAndSendResponse(res, user))
    .catch(next);
};

module.exports.logout = (_, res) => {
  res.clearCookie("token").send({ message: "Вы вышли из профиля" });
};
// функция для обновления данных пользователя
const updateUser = (req, res, next, updateData) => {
  User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError("Пользователь не найден");
      }
    })
    .catch(next);
};

// декоратор для обновления имени и описания пользователя
module.exports.updateUserData = (req, res, next) => {
  const { name, email } = req.body;
  updateUser(req, res, next, { name, email });
};
