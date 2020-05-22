const express = require("express");
const router = express.Router();

const { auth } = require("./../../middleware/auth");
const { admin } = require("./../../middleware/admin");
const { Wood } = require("../../models/wood");

router.get("/woods", async (req, res, next) => {
  try {
    const woods = await Wood.find({});
    return res.status(200).send(woods);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post("/wood", auth, admin, async (req, res, next) => {
  try {
    const wood = new Wood(req.body);
    const result = await wood.save();
    return res.status(200).json({
      success: true,
      wood: result,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      err,
    });
  }
});

module.exports = router;
