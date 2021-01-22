const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globallErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl} on this server`, 404));
});

// global error handling middlware
app.use(globallErrorHandler);

module.exports = app;
