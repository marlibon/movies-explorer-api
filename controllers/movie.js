const Movie = require("../models/movie");
const { HTTP_STATUS_CREATED } = require("../utils/handleErrors");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { NotFoundError } = require("../errors/NotFoundError");

// получение всех карточек
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate([{ path: "owner", model: "user" }])
    .then((cards) => res.send(cards))
    .catch(next);
};

// создание карточки
module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
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

  Movie.find({ owner, movieId })
    .then((findedCard) => {
      if (findedCard.length) {
        throw new ForbiddenError("этот фильм уже добавлен ранее");
      } else {
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
      }
    })
    .catch((err) => next(err));
};

// удаление карточки
module.exports.deleteMovie = (req, res, next) => {
  const _id = req.params.movieId;

  Movie.findOne({ _id })
    .populate([{ path: "owner", model: "user" }])
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка фильма не найдена");
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
