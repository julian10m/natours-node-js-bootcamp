const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');
// Allows to get the params that were present in the
// URL before redirecting the endpoint to the one in 
// in this router.
const router = express.Router({ mergeParams: true });
router.use(authController.protect);

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewsController.setTourAndUserIds,
    reviewsController.createReview
  );

router
  .route('/:id')
  .get(reviewsController.getReviewById)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewsController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewsController.deleteReview
  );

module.exports = router;
