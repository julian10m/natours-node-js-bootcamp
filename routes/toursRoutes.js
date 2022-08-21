const express = require('express');
const toursController = require('../controllers/toursController');
const authController = require('../controllers/authController');
const reviewsRouter = require('./reviewsRoutes');

const router = express.Router();

// router.param('id', toursController.checkTourForId);

// prettier-ignore
router.use('/:tourId/reviews', reviewsRouter);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(toursController.getToursWithin)

// prettier-ignore
router
  .route('/top-5-cheap')
  .get(toursController.aliasTopTours,
    toursController.getAllTours);
// prettier-ignore
router
  .route('/tour-stats')
  .get(toursController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    toursController.getMonthlyPlan
  );

router
  .route('/')
  .get(toursController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.createTour
  );
router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.deleteTour
  );

module.exports = router;
