const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const Tour = require('../../models/tourModel');

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
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//import data to db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded');
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

//delete collection data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted successfully');
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
