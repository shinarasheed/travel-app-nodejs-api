const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkD);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.validateData, tourController.createTour);
router.route('/:id').get(tourController.getTour);

module.exports = router;
