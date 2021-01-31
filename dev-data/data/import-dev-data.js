const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

mongoose
  .connect(process.env.DATABASE_LOCAl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to database successfully');
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//import data to db
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    await Tour.create(tours);

    console.log('data successfully loaded');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

//delete collection data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('data deleted successfully');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
