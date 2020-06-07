const { Router } = require("express");
const sendEmail = require("../../util/mail");
const router = Router();
const moment = require("moment");

const { User } = require("../../models/users");
const { auth } = require("../../middleware/auth");

router.get("/register", (req, res, next) => {
  res.send("users endpoint");
});

router.post("/register", (req, res, next) => {
  const user = new User(req.body);

  user.save(async (err, doc) => {
    if (err) return res.json({ success: false, err });
    const mailFeedback = await sendEmail(doc.email, doc.name, null, "welcome");
    if (mailFeedback.messageId) {
      res.status(200).json({
        success: true,
        mail: true,
      });
    } else {
      res.status(200).json({
        success: true,
        mail: false,
      });
    }
  });
});

router.post("/update_profile", auth, async (req, res, next) => {
  try {
    const userResult = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: req.body },
      { useFindAndModify: false, new: true }
    );
    if (userResult) {
      return res.status(200).send({
        success: true,
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      err,
    });
  }
});

router.post("/reset_user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const result = user.generateResetToken();
      const mailFeedback = await sendEmail(
        result.email,
        result.name,
        null,
        "reset_password",
        result
      );
      return res.json({ success: true });
    }
  } catch (err) {
    return res.json({ success: false, err });
  }
});

router.post("/reset_password", async (req, res) => {
  try {
    const today = moment().startOf("day").valueOf();
    const user = await User.findOne({
      resetToken: req.body.resetToken,
      resetTokenExp: {
        $gte: today,
      },
    });
    if (user) {
      user.password = req.body.password;
      user.resetToken = "";
      user.resetTokenExp = "";
      const resultUser = await user.save();
      if (resultUser) {
        return res.json({
          success: true,
        });
      }
    } else {
      return res.json({
        success: false,
        message: "Sorry token is expired , generate another",
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      err,
    });
  }
});

module.exports = router;
