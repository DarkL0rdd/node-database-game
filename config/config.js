require("dotenv").config();
const path = require("path");
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    "models-path": path.resolve("../src/models"),
    "migrations-path": path.resolve("../migrations"),
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    "models-path": path.resolve("../src/models"),
    "migrations-path": path.resolve("../migrations"),
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    "models-path": path.resolve("../src/models"),
    "migrations-path": path.resolve("../migrations"),
  },
};