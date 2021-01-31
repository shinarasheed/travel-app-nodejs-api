const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authenticate, restrictTo } = require('../middleware/authMiddleware');

//merge params is awesome
const router = express.Router({ mergeParams: true });

router.use(authenticate);

router
  .route('/')
  .post(
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .delete(restrictTo('user', 'admin'), reviewController.deleteReview)
  .patch(restrictTo('user', 'admin'), reviewController.updateReview)
  .get(reviewController.getReview);

module.exports = router;
