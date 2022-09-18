const mongoose = require('mongoose');

const bookingsSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A booking must be related to a given tour!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A booking must be related to a given user!']
    },
    price: {
        type: Number,
        required: [true, 'A booking must have a price']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

bookingsSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    });
    next();
});

const Booking = mongoose.model('Booking', bookingsSchema);
module.exports = Booking;