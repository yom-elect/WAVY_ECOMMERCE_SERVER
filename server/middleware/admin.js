const admin = (req, res, next) => {
  if (req.user.role === 0) {
    return res.send("Not allowed check authorization");
  }
  next();
};

module.exports = { admin };
