const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// prettier-ignore
router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(authController.protect, 
        authController.restrictTo('user'),
        reviewsController.createReview);
// prettier-ignore
router
  .route('/:id')
  .delete(reviewsController.deleteReview)
module.exports = router;
