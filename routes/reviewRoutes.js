const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authenticate, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(authenticate, restrictTo('user'), reviewController.createReview)
  .get(reviewController.getAllReview);

module.exports = router;
