const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be >= 1'],
      max: [5, 'Rating must be <= 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  //   .populate({
  //     path: 'tour',
  //     select: 'name',
  //     //   select: '-guides name',
  //   });
  next();
});

// We can use static methods, besides the typical instance ones
// that we use on objects (here representing a MongoDB doc)
reviewsSchema.statics.calcAverageRatings = async function (tourId) {
  // Since the method is static, then this keyword 
  // represents the Review model, on which we need to
  // call the aggregate method.
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewsSchema.index({ tour: 1, user: 1 }, { unique: true })

// Remeber that post middlewares do not get access to next()
// This is called when we create a new review.
reviewsSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.tour);
});

// We need to update the statistics also when
// updating and deleting reviews, which we still miss.

// This is a query middleware, hence the this keyword
// represents a query. We save the current document, i.e.,
// the review we are updating/deleting, into a variable
// named r in this case, so that we can pass it to the
// next middleware.

// reviewsSchema.pre(/^findOneAnd/, async function (next) {
// The clone() call below might not be needed... 
//   this.r = await this.clone().findOne();
//   next();
// });

// Note that we could not calculate the statistics in the
// previous middleware because the current document was
// not yet stored in the DB, and hence it would not be taken
// into account for the calculation, so we do it post saving.

// reviewsSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });

reviewsSchema.post(
  /^findOneAnd/,
  async (doc) => {
    if (doc)
      await doc.constructor.calcAverageRatings(doc.tour)
  }
);

const Review = mongoose.model('Review', reviewsSchema);
module.exports = Review;
