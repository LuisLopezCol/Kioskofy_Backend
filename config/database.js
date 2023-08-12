require("dotenv").config();

module.exports = {
  database: process.env.DATABASE_URL,
  jwtKey: process.env.JWT_KEY
};
