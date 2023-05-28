const router = require('express').Router();
const {
  getCards, createCard, deleteCard
} = require('../controllers/movie');
const { validateMovieData, validateMovieById } = require('../utils/validate/movieValidate');

router.get('/', getCards);
router.post('/', validateMovieData, createCard);
router.delete('/:movieId', validateMovieById, deleteCard);

module.exports = router;
