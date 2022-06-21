const express = require('express');
const toursController = require('../controllers/toursController');
const authController = require('../controllers/authController');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

// router.param('id', toursController.checkTourForId);

// prettier-ignore
router
  .route('/top-5-cheap')
  .get(toursController.aliasTopTours, 
       toursController.getAllTours);
// prettier-ignore
router
  .route('/tour-stats')
  .get(toursController.getTourStats);
// prettier-ignore
router
  .route('/monthly-plan/:year')
  .get(toursController.getMonthlyPlan);
// prettier-ignore
router
  .route('/')
  .get(authController.protect, toursController.getAllTours)
  .post(toursController.createTour);
// prettier-ignore
router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTour)
  .delete(authController.protect, 
          authController.restrictTo('admin', 'lead-guide'), 
          toursController.deleteTour);
// prettier-ignore
router
  .route('/:tourId/reviews')
  .post(authController.protect, 
        authController.restrictTo('user'), 
        reviewsController.createReview)
module.exports = router;
