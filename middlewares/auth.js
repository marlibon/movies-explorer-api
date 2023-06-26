const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

module.exports = (req, res, next) => {
  // console.log(req.cookies);
  const token = req.headers.authorization?.split(' ')[1]
  // const { token } = req.cookies;
  if (!token) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }
};
