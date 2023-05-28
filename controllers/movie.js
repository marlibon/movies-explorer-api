const Movie = require('../models/movie');
const {
  HTTP_STATUS_CREATED,
  handleErrors,
} = require('../utils/handleErrors');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');

// получение всех карточек
module.exports.getCards = (req, res, next) => {
  Movie.find({})
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' },
    ])
    .then((cards) => res.send(cards))
    .catch(next);
};

// создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  Movie.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch(next);
};

// удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const _id = req.params.cardId;

  Movie.findOne({ _id })
    .populate([
      { path: 'owner', model: 'user' },
    ])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка уже удалена');
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('У вас нет прав на удаление этой карточки');
      }
      return card.deleteOne()
        .then((deletedCard) => { res.send(deletedCard); });

    })
    .catch(next);
};

//вынесение общего кода постановки/удаления лайка в отдельную функцию
const updateLikes = (req, res, operation) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { [operation]: { likes: req.user._id } },
    { new: true }
  )
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' },
    ])
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => handleErrors(err, res));
};
// постановка лайка
module.exports.likeCard = (req, res) => {
  updateLikes(req, res, '$addToSet');
};

// удаление лайка
module.exports.dislikeCard = (req, res) => {
  updateLikes(req, res, '$pull');
};
