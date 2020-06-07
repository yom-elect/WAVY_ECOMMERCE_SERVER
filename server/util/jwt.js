const jwt = require("jsonwebtoken");
const SHA256 = require("crypto-js/sha256");

require("dotenv").config();

const jwtToken = (id) => {
  return jwt.sign(id, process.env.SECRET);
};

const jwtVerify = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

const cryptoToken = () => {
  return SHA256().toString();
};

module.exports = { jwtToken, jwtVerify, cryptoToken };
