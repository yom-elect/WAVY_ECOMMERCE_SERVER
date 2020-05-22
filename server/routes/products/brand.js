const express = require("express");
const router = express.Router();

const { auth } = require("./../../middleware/auth");
const { admin } = require("./../../middleware/admin");
const { Brand } = require("../../models/brand");

router.get("/brands", async (req, res, next) => {
  try {
    const brands = await Brand.find({});
    return res.status(200).send(brands);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post("/brand", auth, admin, async (req, res, next) => {
  try {
    const brand = new Brand(req.body);
    const result = await brand.save();
    return res.status(200).json({
      success: true,
      brand: result,
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
