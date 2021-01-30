const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

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

getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
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

//doing getAll for all the resources these way will actually put
//all the api features(sorting, filtering, limiting, paginating)
//into all the getAll routes even though we initially only did it for getAllTours
getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET Reviews on tours
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      // .sort()
      // .limit()
      .paginate();
    // const docs = await query;
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
