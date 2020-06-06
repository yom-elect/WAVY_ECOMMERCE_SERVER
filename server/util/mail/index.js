const mailer = require("nodemailer");
const { getEmailData } = require("./generateEmailData");
require("dotenv").config();

const sendEmail = async (to, name, token, type, actionData = null) => {
  try {
    //Transport
    let transporter = mailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "waves.guitars.shop@gmail.com",
        pass: process.env.EMAIL_PW,
      },
    });

    let mailInfo = getEmailData(to, name, token, type, actionData);

    let info = await transporter.sendMail(mailInfo);

    //   console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    return info;
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
