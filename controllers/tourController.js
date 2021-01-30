const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');

//this is for the alias tour
aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//awesome stuffs
getAllTours = factory.getAll(Tour);
createTour = factory.createOne(Tour);
updateTour = factory.updateOne(Tour);
deleteTour = factory.deleteOne(Tour);
getTour = factory.getOne(Tour, { path: 'reviews' });

//AGGREATION CREATES A NEW DOCUMENT FROM EXISTING DOCUMENTS BASED ON STAGES IN THE AGGREGATION PIPELINE
//we can get alot of insights from our data using aggregation pipeline
//stats for all the tours
getToursStart = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    {
      $group: {
        // _id:null,
        // _id: '$difficulty',
        // _id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },

    {
      $sort: { avgPrice: 1 },
    },

    //we can even match multiple times
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({ status: 'success', data: stats });
});

getMonthlyPlan = catchAsync(async (req, res, next) => {
  //get the year and convert it to a number
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    //add a new field, with name and the value

    {
      $addFields: { month: '$_id' },
    },

    //remove
    {
      $project: {
        _id: 0,
      },
    },

    //sort
    {
      $sort: { numToursStarts: -1 },
    },

    //limit
    {
      $limit: 12,
    },
  ]);
  // Hence, July is the busiest month

  res.status(200).json({ status: 'success', count: plan.length, data: plan });
});

module.exports = {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getToursStart,
  getMonthlyPlan,
};
