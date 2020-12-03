const Tour = require('../models/tourModel');

exports.validateData = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'error',
      message: 'name and price is required',
    });
  }
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = Tour.findById({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      message: 'tour deleted',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};
