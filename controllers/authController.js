const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { signToken, createAndSendToken } = require('../utils/generateToken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

signup = catchAsync(async (req, res) => {
  //WE INITIALLY SAID THIS HAVE SECURITY ISSUES
  const newUser = await User.create(req.body);

  //WHEN AND WHY DID WE REMOVE THIS LINE
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   confirmPassword: req.body.confirmPassword,
  //   role: req.body.role,
  // });
  createAndSendToken(newUser, 201, res);
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
  createAndSendToken(user, 200, res);
});

forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }
  //Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email

  //reset url
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}. \nIf you didn't forget your password please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Invalid after 10min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again', 500)
    );
  }
});

resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //find a user with that token and whose token has not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  //if token has not expired, add there is a user, set the new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //log the user in and send JWT
  createAndSendToken(user, 200, res);
});

updatePassword = catchAsync(async (req, res, next) => {
  const { password, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  //compare the passwords
  const isMatch = await user.comparePassword(password, user.password);
  if (!isMatch) {
    return next(new AppError('password do not match existing password', 400));
  }

  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  await user.save();
  createAndSendToken(user, 201, res);
});

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
};
