const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { auth } = require("../../middleware/auth");
const { User } = require("../../models/users");
const { Product } = require("../../models/products");

router.post("/add_to_cart", auth, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (user) {
      let duplicate = false;
      user.cart.forEach((element) => {
        if (element.id == req.query.productId) {
          duplicate = true;
        }
      });
      if (duplicate) {
        const result = await User.findOneAndUpdate(
          {
            _id: req.user._id,
            "cart.id": mongoose.Types.ObjectId(req.query.productId),
          },
          {
            $inc: { "cart.$.quantity": 1 },
          },
          { useFindAndModify: false, new: true }
        );
        if (result) {
          res.status(200).json(result.cart);
        }
      } else {
        const result = await User.findOneAndUpdate(
          {
            _id: req.user._id,
          },
          {
            $push: {
              cart: {
                id: mongoose.Types.ObjectId(req.query.productId),
                quantity: 1,
                date: Date.now(),
              },
            },
          },
          { useFindAndModify: false, new: true }
        );
        if (result) {
          res.status(200).json(result.cart);
        }
      }
    }
  } catch (err) {
    return res.json({ success: false, err });
  }
});

router.get("/removeFromCart", auth, async (req, res) => {
  const result = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        cart: {
          id: mongoose.Types.ObjectId(req.query.id),
        },
      },
    },
    { useFindAndModify: false, new: true, safe: true }
  );
  if (result) {
    let cart = result.cart;
    let array = cart.map((item) => {
      return mongoose.Types.ObjectId(item.id);
    });

    const reqData = await Product.find({ _id: { $in: array } })
      .populate("brand")
      .populate("wood")
      .exec();
    // console.log(reqData);
    if (reqData) {
      return res.status(200).json({
        cartDetail: reqData,
        cart,
      });
    }
  }
});

module.exports = router;
