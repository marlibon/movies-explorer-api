module.exports = {
  PORT: process.env.PORT || 3000,
  BASE_PATH: process.env.BASE_PATH || 'https://localhost.ru',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bitfilmsdb',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-code',
};
