const jwt = require("jsonwebtoken");

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

exports.sendTokenResponse = (user, statusCode, res) => {
  const token = exports.generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};
