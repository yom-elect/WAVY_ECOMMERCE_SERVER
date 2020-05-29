const express = require("express");
const router = express.Router();

const { User } = require("../../models/users");
const { auth } = require("../../middleware/auth");

router.get("/", (req, res, next) => {
  res.send("users endpoint");
});

router.post("/", (req, res, next) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      // userdata: doc,
    });
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

module.exports = router;
