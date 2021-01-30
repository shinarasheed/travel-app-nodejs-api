const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

createReview = catchAsync(async (req, res, next) => {
  //we should just get the tour from the req.params.tourId
  //and the user from req.user.id na?
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({});
  res.status(201).json({
    status: 'success',
    count: reviews.length,
    data: {
      reviews,
    },
  });
});

module.exports = {
  createReview,
  getAllReview,
};
