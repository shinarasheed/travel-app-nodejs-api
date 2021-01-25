const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json({ status: 'success', count: users.length, data: { users } });
});
getUser = (req, res) => {};
createUser = (req, res) => {};
updateUser = (req, res) => {};
deleteUser = (req, res) => {};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
