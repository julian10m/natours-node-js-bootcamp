const express = require('express');
const bookingsController = require('../controllers/bookingsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingsController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));
router
    .route('/')
    .get(bookingsController.getAllBookings)
    .post(bookingsController.createBooking);

router
    .route('/:id')
    .get(bookingsController.getBookingById)
    .patch(bookingsController.updateBooking)
    .delete(bookingsController.deleteBooking);
module.exports = router;
