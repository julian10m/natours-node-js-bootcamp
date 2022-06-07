const express = require('express');
const toursController = require('../controllers/toursController');

const router = express.Router();

router.param('id', toursController.checkTourForId);

// prettier-ignore
router
  .route('/')
  .get(toursController.getAllTours)
  .post(toursController.checkBody, 
        toursController.createTour);
// prettier-ignore
router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;
