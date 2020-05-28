const express = require("express");
const router = express.Router();

const formidable = require("express-formidable");
const cloudinary = require("cloudinary").v2;

const { auth } = require("../../middleware/auth");
const { admin } = require("../../middleware/admin");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.get("/removeimage", auth, admin, (req, res, next) => {
  let image_id = req.query.public_id;
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.status(200).send("ok");
  });
});

router.post("/uploadimage", auth, admin, formidable(), (req, res, next) => {
  const img = JSON.stringify(req.files.file);
  cloudinary.uploader.upload(
    JSON.parse(img).path,
    {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    },
    (error, result) => {
      res.status(200).send({
        public_id: result.public_id,
        url: result.url,
      });
    }
  );
});

module.exports = router;
