const { Joi, celebrate } = require("celebrate");
const { URL_REGEXP } = require("../constants");

module.exports.validateMovieData = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().required().pattern(URL_REGEXP),
    trailerLink: Joi.string().required().pattern(URL_REGEXP),
    thumbnail: Joi.string().required().pattern(URL_REGEXP),
    movieId: Joi.number().required(),
  }),
});

module.exports.validateMovieById = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});
