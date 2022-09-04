const Tour = require('../model/tourModel');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
    const tours = await Tour.find();
    res.status(200).render('overview', { tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({ path: 'reviews', fields: 'review rating user' })
    if (!tour)
        return next(new AppError('There is no tour with that name.', 404));
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.getLoginForm = (req, res) =>
    res.status(200).render('login', { title: `Login` });

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account',
        user: req.user
    })
};

exports.updateUser = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });
    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    })
});