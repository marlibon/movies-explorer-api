const Movie = require("../models/movie");
const { HTTP_STATUS_CREATED, handleErrors } = require("../utils/handleErrors");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { NotFoundError } = require("../errors/NotFoundError");

// получение всех карточек
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate([{ path: "owner", model: "user" }])
    .then((cards) => res.send(cards))
    .catch(next);
};

// создание карточки
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    nameRU,
    nameEN,
    image,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    nameRU,
    nameEN,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner,
  })
    .then((card) => card.populate("owner"))
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch(next);
};

// удаление карточки
module.exports.deleteMovie = (req, res, next) => {
  const _id = req.params.movieId;

  Movie.findOne({ _id })
    .populate([{ path: "owner", model: "user" }])
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка фильма уже удалена");
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("У вас нет прав на удаление этого фильма");
      }
      return card.deleteOne().then((deletedCard) => {
        res.send(deletedCard);
      });
    })
    .catch(next);
};
