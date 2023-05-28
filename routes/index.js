const router = require('express').Router();
const { login, createUser, logout } = require('../controllers/users');
const { validateLogin, validateRegister } = require('../utils/validate/userValidate');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const auth = require('../middlewares/auth');

const {
  handleErrors,
  NotFoundError,
} = require('../utils/handleErrors');
router.get('/crash-test', (req, res) => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.post('/signin', validateLogin, login);
router.post('/signup', validateRegister, createUser);
router.get('/signout', logout);

router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('*', (req, res) => {
  const newError = new NotFoundError('По указанному вами адресу ничего не найдено');
  handleErrors(newError, res);
});
module.exports = router;
