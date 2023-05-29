const bcrypt = require("bcryptjs");
const validator = require("validator");
const mongoose = require("mongoose");

const { UnauthorizedError } = require("../errors/UnauthorizedError");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: ({ value }) =>
          `${value} не является действительным адресом электронной почты!`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true } }
);

userSchema.statics.findUserByCredentials = async function asyncFunc (
  email,
  password
) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthorizedError("Неправильные почта или пароль");
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new UnauthorizedError("Неправильные почта или пароль");
  }
  return user;
};

module.exports = mongoose.model("user", userSchema);
