const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const signToken = require('../utils/generateToken');
const AppError = require('../utils/appError');

signup = catchAsync(async (req, res) => {
  //anyone can register as an admin
  // const newUser = await User.create(req.body); bad for security
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id);

  res.status(201).json({ status: 'success', token, data: { user: newUser } });
});

login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //we need to include the password
  const user = await User.findOne({ email }).select('+password');
  const isMatch = await user.comparePassword(password, user.password);

  if (!user || !isMatch) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);
  res.status(201).json({ status: 'success', token });
});

module.exports = { signup, login };
