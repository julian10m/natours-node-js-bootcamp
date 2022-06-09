const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
// prettier-ignore
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
