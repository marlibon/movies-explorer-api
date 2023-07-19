const Category = require("../models/category");
const { HTTP_STATUS_CREATED } = require("../utils/handleErrors");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ConflictError } = require("../errors/ConflictError");

// получение всех категорий
module.exports.getCategories = (req, res, next) => {
  const owner = req.user._id;
  Category.find({ owner })
    .then((categories) => res.send(categories))
    .catch(next);
};

// создание категории
module.exports.createCategory = (req, res, next) => {
  const { title, image } = req.body;
  Category.create({ title, image })
    .then((user) => generateTokenAndSendResponse(res, user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Такая категория уже существует"));
      } else {
        next(err)
      }
    }
    )
};

// редактирование категории
module.exports.editCategory = (req, res, next) => {
  const { title, image } = req.body;
  Category.findByIdAndUpdate(req.params.id, { title, image }, {
    new: true,
    runValidators: true,
  })
    .then((category) => {
      if (category) {
        res.send(category);
      } else {
        notFoundErrorThrow();
      }
    })
    .catch(next);
};

// удаление категории

module.exports.deleteCategory = (req, res, next) => {
  Category.findById(req.params.id)
    .then((deletedCard) => {
      if (!deletedCard) {
        notFoundErrorThrow();
      }
      return deletedCard
        .deleteOne()
        .then((card) => {
          if (card) {
            res.send(card);
          } else {
            notFoundErrorThrow();
          }
        })
        .catch(next);
    })
    .catch(next);
};
