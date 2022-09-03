const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/).at(0);
  const message = `Duplicate value: ${value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const fieldsErrorMsg = Object.values(err.errors)
    .map((val) => val.message)
    .join('. ');
  const message = `Invalid input data. ${fieldsErrorMsg}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please login again!', 401);

const handleJWTExpirationError = () =>
  new AppError('Your token has expired, please login again!', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Oops! ...something went wrong!',
      msg: err.message
    })
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error(err.name, 'ERROR', err);
      res.status(500).json({
        status: 'error',
        message: 'Oops! ...something went wrong!',
      });
    }
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Oops! ...something went wrong!',
      msg: err.isOperational ? err.message : 'Please try again later'
    })
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = Object.create(err);
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    } else if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (error.name === 'TokenExpiredError') {
      error = handleJWTExpirationError();
    }
    sendErrorProd(error, req, res);
  }
};
