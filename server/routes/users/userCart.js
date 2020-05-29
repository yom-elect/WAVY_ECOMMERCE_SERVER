const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const async = require("async");

const { auth } = require("../../middleware/auth");
const { User } = require("../../models/users");
const { Product } = require("../../models/products");
const { Payment } = require("../../models/payment");

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

router.post("/successfulPurchase", auth, async (req, res, next) => {
  const { cartDetail, paymentData } = req.body;
  let history = [];
  let transactionData = {};

  //user history
  cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.name,
      brand: item.brand.name,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: paymentData.paymentID,
    });
  });

  //PAYMENT DASH
  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    lastname: req.user.lastname,
    email: req.user.email,
  };
  transactionData.data = paymentData;
  transactionData.product = history;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { history: history }, $set: { cart: [] } },
      { useFindAndModify: false, new: true }
    );

    if (user) {
      const payment = new Payment(transactionData);
      const paymentResult = await payment.save();
      if (paymentResult) {
        let products = [];
        paymentResult.product.forEach((item) => {
          products.push({
            id: item.id,
            quantity: item.quantity,
          });
        });
        console.log(products);
        async.eachSeries(products, async (item, callback) => {
          const productResult = await Product.findOneAndUpdate(
            { _id: item.id },
            {
              $inc: {
                sold: item.quantity,
              },
            },
            { useFindAndModify: false, new: true },
            callback
          );
          if (productResult) {
            // console.log(productResult);
            res.status(200).json({
              success: true,
              cart: user.cart,
              cartDetail: [],
            });
          }
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      err,
    });
  }
});

module.exports = router;
