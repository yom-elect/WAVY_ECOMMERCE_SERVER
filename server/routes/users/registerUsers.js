import { Router } from "express";
import sendEmail from "../../util/mail";
const router = Router();

import { User } from "../../models/users";
import { auth } from "../../middleware/auth";

router.get("/register", (req, res, next) => {
  res.send("users endpoint");
});

router.post("/register", (req, res, next) => {
  const user = new User(req.body);

  user.save(async (err, doc) => {
    if (err) return res.json({ success: false, err });
    const mailFeedback = await sendEmail(
      doc.email,
      doc.eventNames,
      null,
      "welcome"
    );
    if (mailFeedback.messageId) {
      res.status(200).json({
        success: true,
        mail: true,
      });
    } else {
      res.status(200).json({
        success: true,
        mail: false,
      });
    }
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

export default router;
