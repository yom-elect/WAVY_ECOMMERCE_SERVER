const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const routes = require("./routes");
const app = express();
app.use(cookieParser());

const whitelist = ["http://localhost:3000"];
const corsOption = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOption));

require("dotenv").config();
const mongooseConnect = require("./util/database").mongooseConnect;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Models

app.use(routes);
const port = process.env.PORT || 3002;
mongooseConnect();

app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
