const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
    const tours = await Tour.find();
    res.status(200).render('overview', { tours });
});

exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The title of my Tour'
    });
}