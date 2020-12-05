const { query } = require('express');
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
    //copy all the query and delete the fields you do not want to query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    console.log(JSON.parse(queryString));

    // { duration: { gte: '5' }, difficulty: 'easy' }

    const query = Tour.find(JSON.parse(queryString));

    //execute the query
    const tours = await query;

    // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });

    //we can do this too
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

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
    res.status(204).json({
      status: 'success',
      message: 'tour deleted',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
};
