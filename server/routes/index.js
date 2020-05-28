const express = require("express");
const app = express();

app.use("/api/users/register", require("./users/registerUsers"));
app.use("/api/users", require("./users/authUsers"));
app.use("/api/users", require("./users/userImages"));
app.use("/api/users", require("./users/userCart"));

app.use("/api/product", require("./products/brand"));
app.use("/api/product", require("./products/wood"));
app.use("/api/product", require("./products/product"));
app.use("/api/product", require("./products/shop"));

module.exports = app;
