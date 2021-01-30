const express = require('express');
const reviewController = require('../controllers/reviewController');
// const { authenticate, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(reviewController.createReview)
  .get(reviewController.getAllReview);

module.exports = router;
