const express = require("express");
const router = express.Router();

const { User } = require("../../models/users");
const { auth } = require("./../../middleware/auth");

router.get("/auth", auth, (req, res, next) => {
  res.status(200).json({
    isAdmin: req.user.role == 0 ? false : true,
    isAuth: true,
    userData: {
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      cart: req.user.cart,
      history: req.user.history,
    },
  });
});

router.get("/logout", auth, async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      { token: "" },
      { useFindAndModify: false }
    );
    if (user)
      return res.status(200).json({
        success: true,
      });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      err,
    });
  }
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email }, async (err, user) => {
    try {
      if (!user)
        return res.json({
          loginSuccess: false,
          message: "Auth failed, email not found",
        });

      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            message: "incorrect password",
          });
      });
      const result = await user.generateToken();
      if (result.email)
        return res.cookie("w_auth", result.token).status(200).json({
          loginSuccess: true,
        });
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
