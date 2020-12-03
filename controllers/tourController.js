const Tour = require('../models/tourModel');

exports.checkD = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.validateData = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'error',
      message: 'name and price is required',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
};

exports.getTour = (req, res) => {};

exports.createTour = (req, res) => {
  const newTour = new Tour({
    name: 'forest hiker',
    rating: 4.1,
    price: 497,
  });

  newTour
    .save()
    .then((doc) => {
      console.log(doc);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
