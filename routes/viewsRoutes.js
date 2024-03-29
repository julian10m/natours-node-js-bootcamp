const express = require('express');
const viewsController = require('./../controllers/viewsController')
const authController = require('../controllers/authController');
const bookingsController = require('../controllers/bookingsController');

const router = express.Router();

router.get('/',
    bookingsController.createBookingCheckout,
    authController.isLoggedIn,
    viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get('/my-bookings', authController.protect, viewsController.getMyBookings);
router.post('/submit-user-data', authController.protect, viewsController.updateUser);

module.exports = router;