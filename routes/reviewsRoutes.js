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
        reviewsController.setTourAndUserIds,
        reviewsController.createReview);
// prettier-ignore
router
  .route('/:id')
  .get(reviewsController.getReviewById)
  .patch(reviewsController.updateReview)
  .delete(reviewsController.deleteReview)

module.exports = router;
