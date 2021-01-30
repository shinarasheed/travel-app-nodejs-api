const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authenticate, restrictTo } = require('../middleware/authMiddleware');

//merge params is awesome
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authenticate,
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview)
  .get(reviewController.getReview);

module.exports = router;
