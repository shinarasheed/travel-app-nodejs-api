const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');

createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

//this implementation is actually AWESOME
//because it can get all the reviews and all the reviews for a particular tour if there is a tourId
getAllReviews = catchAsync(async (req, res, next) => {
  let filterObj = {};
  if (req.params.tourId) filterObj = { tour: req.params.tourId };
  const reviews = await Review.find(filterObj);
  res.status(201).json({
    status: 'success',
    count: reviews.length,
    data: {
      reviews,
    },
  });
});

deleteReview = factory.deleteOne(Review);

module.exports = {
  createReview,
  getAllReviews,
  deleteReview,
};
