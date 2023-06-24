module.exports = {
  PORT: process.env.PORT || 3000,
  BASE_PATH: process.env.BASE_PATH || "https://localhost",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bitfilmsdb",
  JWT_SECRET: process.env.JWT_SECRET || "super-secret-code",
};
