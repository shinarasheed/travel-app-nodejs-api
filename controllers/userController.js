const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

//this is for users
updateMe = catchAsync(async (req, res, next) => {
  //create error if user POST password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password',
        400
      )
    );
  }

  //just passing in req.body can cause security issues
  //because the user can then update their role
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

//this wont delete the user from the database
//this is a user function
deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

createUser = (req, res) => {
  res.status(204).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

getAllUsers = factory.getAll(User);
//this is only for admins
updateUser = factory.updateOne(User);

//this will delete the user from the database.//this is an admin function
deleteUser = factory.deleteOne(User);
getUser = factory.getOne(User);

module.exports = {
  getAllUsers,
  updateMe,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteMe,
};
