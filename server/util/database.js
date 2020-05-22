const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);

mongoose.Promise = global.Promise;

const mongooseConnect = () => {
  mongoose
    .connect(process.env.DATABASE, { useNewUrlParser: true })
    .then((result) => {
      //console.log("connected")
    })
    .catch((err) => console.log(err));
};

exports.mongooseConnect = mongooseConnect;
