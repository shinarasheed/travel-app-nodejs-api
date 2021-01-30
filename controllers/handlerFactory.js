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

updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
};
