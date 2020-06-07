const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { jwtToken, jwtVerify, cryptoToken } = require("../util/jwt");
const SALT_I = 10;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  resetTokenExp: {
    type: Number,
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = bcrypt.genSaltSync(SALT_I);
      const hashedPassword = bcrypt.hashSync(this.password, salt);
      this.password = hashedPassword;
      next();
    } else {
      next();
    }
  } catch (err) {
    //console.log(err);
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (userPassword, cb) {
  try {
    const isMatch = await bcrypt.compareSync(userPassword, this.password);
    cb(null, isMatch);
  } catch (err) {
    return cb(err);
  }
};

userSchema.methods.generateResetToken = async function () {
  try {
    let user = this;
    const resetToken = cryptoToken();
    const today = moment().startOf("day").valueOf();
    const tomorrow = moment(today).endOf("day").valueOf();

    user.resetToken = resetToken;
    user.resetTokenExp = tomorrow;
    const result = await user.save();
    return result;
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.generateToken = async function () {
  try {
    let user = this;
    const token = jwtToken(user._id.toHexString());
    user.token = token;
    const result = await user.save();
    return result;
  } catch (err) {
    // console.log(err);
  }
};

userSchema.statics.findByToken = async function (token) {
  try {
    let user = this;
    const decode = jwtVerify(token);
    const resultUser = await user.findOne({ _id: decode, token: token });
    return { resultUser };
  } catch (err) {
    return {
      error: err,
    };
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
