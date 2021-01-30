const Review = require('../models/reviewModel');
const factory = require('../controllers/handlerFactory');

//i love the middleware idea
//this enables us to use the factory function for createReview too
setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

createReview = factory.createOne(Review);

//this implementation is actually AWESOME
//because it can get all the reviews and all the reviews for a particular tour if there is a tourId
// getAllReviews = catchAsync(async (req, res, next) => {
//   let filterObj = {};
//   if (req.params.tourId) filterObj = { tour: req.params.tourId };
//   const reviews = await Review.find(filterObj);
//   res.status(201).json({
//     status: 'success',
//     count: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

getAllReviews = factory.getAll(Review);
deleteReview = factory.deleteOne(Review);
updateReview = factory.updateOne(Review);
getReview = factory.getOne(Review);

module.exports = {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
};
