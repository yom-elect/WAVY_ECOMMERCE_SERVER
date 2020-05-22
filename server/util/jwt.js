const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtToken = (id) => {
  return jwt.sign(id, process.env.SECRET);
};

const jwtVerify = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

module.exports = { jwtToken, jwtVerify };
