const { Joi, celebrate } = require("celebrate");
const { URL_REGEXP } = require("../constants");

module.exports.validateCategoryData = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    image: Joi.string().required().pattern(URL_REGEXP),
  }),
});

module.exports.validateCategoryById = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});
