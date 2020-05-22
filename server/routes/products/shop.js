const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Product } = require("../../models/products");

router.post("/shop", async (req, res, next) => {
  try {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let data = req.body.filters;
    let findArgs = {};

    for (let key in data) {
      if (data[key].length > 0) {
        if (key === "price") {
          findArgs[key] = {
            $gte: data[key][0],
            $lte: data[key][0],
          };
        } else {
          findArgs[key] = data[key];
        }
      }
    }
    findArgs["publish"] = true;

    const filteredProduct = await Product.find(findArgs)
      .populate("brand")
      .populate("wood")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec();

    res.status(200).json({
      size: filteredProduct.length,
      articles: filteredProduct,
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;
