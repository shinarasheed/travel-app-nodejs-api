const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

signup = catchAsync(async (req, res) => {
  //anyone can register as an admin
  // const newUser = await User.create(req.body); bad for security
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({ status: 'success', token, data: { user: newUser } });
});

module.exports = { signup };
