const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

//this is called on the model
reviewSchema.statics.calculateAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },

    {
      $group: {
        _id: '$tour',
        numberOfRating: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].numberOfRating,
    ratingsAverage: stats[0].averageRating,
  });
};

//post middleware does not get access to next. which makes sense
reviewSchema.post('save', function () {
  //this point to document
  this.constructor.calculateAverageRating(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
