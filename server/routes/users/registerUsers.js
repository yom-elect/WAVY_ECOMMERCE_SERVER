const express = require("express");
const router = express.Router();

const { User } = require("../../models/users");

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

module.exports = router;
