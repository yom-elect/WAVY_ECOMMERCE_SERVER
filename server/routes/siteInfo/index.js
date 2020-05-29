const express = require("express");
const router = express.Router();

const { auth } = require("./../../middleware/auth");
const { admin } = require("./../../middleware/admin");
const { Site } = require("../../models/site");

router.get("/site_info", async (req, res, next) => {
  try {
    const site = await Site.find({});
    if (site) {
      res.status(200).send(site[0].siteInfo);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post("/site_info", auth, admin, async (req, res, next) => {
  try {
    const siteResult = await Site.findOneAndUpdate(
      { name: "Waves" },
      { $set: { siteInfo: req.body } },
      { new: true, useFindAndModify: false }
    );
    if (siteResult) {
      return res.status(200).json({
        success: true,
        siteInfo: siteResult.siteInfo,
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      err,
    });
  }
});

module.exports = router;
