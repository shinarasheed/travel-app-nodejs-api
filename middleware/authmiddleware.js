// const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// authentication middleware
authenticate = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //const and let are block scope
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No token authorization denied', 401));
  }
  //why use promisify here
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //check if user still exist
  let user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('user no longer exist', 401));
  }

  //check if user has changed their password
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'user recently changed their password please login again',
        401
      )
    );
  }

  //grant access to protected route
  req.user = user;
  next();
});

//authorization middleware
restrictTo = (...roles) => {
  return (req, res, next) => {
    //...roles is the array of roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission perform this action', 403)
      );
    }
    next();
  };
};

module.exports = {
  authenticate,
  restrictTo,
};
