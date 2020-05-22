const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { auth } = require("./../../middleware/auth");
const { admin } = require("./../../middleware/admin");
const { Product } = require("../../models/products");

router.get("/articles_by_id", async (req, res, next) => {
  let type = req.query.type;
  let items = req.query.id;
  if (type === "array") {
    let ids = req.query.id.split(",");
    items = [];
    items = ids.map((item) => mongoose.Types.ObjectId(item));
  }
  let articles = await Product.find({ _id: { $in: items } })
    .populate("brand")
    .populate("wood")
    .exec();
  return res.status(200).send(articles);
});

router.get("/articles", async (req, res, next) => {
  try {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    let articles = await Product.find()
      .populate("brand")
      .populate("wood")
      .sort([[sortBy, order]])
      .limit(limit)
      .exec();
    return res.status(200).send(articles);
  } catch (err) {
    return res.status(400).send(err);
  }
});
router.post("/article", auth, admin, async (req, res, next) => {
  try {
    let product = new Product(req.body);
    let result = await product.save();
    return res.status(200).json({
      success: true,
      article: result,
    });
  } catch (err) {
    return res.json({
      success: false,
      err,
    });
  }
});

module.exports = router;
