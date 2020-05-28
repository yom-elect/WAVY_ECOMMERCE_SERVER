const { User } = require("../models/users");

const auth = async (req, res, next) => {
  try {
    let token = req.cookies.w_auth;
    const response = await User.findByToken(token);
    if (response.error) throw error;
    if (!response.resultUser)
      return res.json({
        isAuth: false,
        error: true,
      });
    req.token = token;
    req.user = response.resultUser;
    next();
  } catch (err) {
    return res.json({
      isAuth: false,
      error: true,
    });
  }
};

module.exports = { auth };
