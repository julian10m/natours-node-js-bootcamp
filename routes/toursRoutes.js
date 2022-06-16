const express = require('express');
const toursController = require('../controllers/toursController');
const authController = require('../controllers/authController');

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
  .delete(toursController.deleteTour);

module.exports = router;
