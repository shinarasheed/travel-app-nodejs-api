const jwt = require('jsonwebtoken');

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({ status: 'success', token, data: { user } });
};

module.exports = {
  signToken,
  createAndSendToken,
};
