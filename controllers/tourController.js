const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

validateData = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'error',
      message: 'name and price is required',
    });
  }
  next();
};

//this is for the alias tour
aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

getAllTours = async (req, res) => {
  try {
    //execute the query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      // .sort()
      // .limit()
      .paginate();
    // const tours = await query;
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

getTour = async (req, res) => {
  try {
    const tour = await Tour.findById({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete({ _id: req.params.id });
    res.status(204).json({
      status: 'success',
      message: 'tour deleted',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

//we can get alot of insights from our data using aggregation pipeline
//stats for all the tours
getToursStart = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

module.exports = {
  validateData,
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getToursStart,
  getMonthlyPlan,
};
