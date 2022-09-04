const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/logout', authController.logout);
router.get('/me', usersController.getMe, usersController.getUserById);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', usersController.uploadUserPhoto, usersController.updateMe);
router.delete('/deleteMe', usersController.deleteMe);

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);
// prettier-ignore
router
  .route('/:id')
  .get(usersController.getUserById)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
