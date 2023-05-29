const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie
} = require('../controllers/movie');
const { validateMovieData, validateMovieById } = require('../utils/validate/movieValidate');

router.get('/', getMovies);
router.post('/', validateMovieData, createMovie);
router.delete('/:movieId', validateMovieById, deleteMovie);

module.exports = router;
