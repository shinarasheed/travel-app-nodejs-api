const express = require('express');
const tourController = require('../controllers/tourController');
const { authenticate, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/top-5-cheap-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getToursStart);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authenticate, tourController.getAllTours)
  .post(tourController.validateData, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authenticate,
    restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
