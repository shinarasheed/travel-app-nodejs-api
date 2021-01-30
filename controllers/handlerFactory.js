const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//this can delete one irrespective of the resource or Model/Collection
deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({ _id: req.params.id });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      message: null,
    });
  });

module.exports = {
  deleteOne,
};
