const AppError = require('./CustomError');

const sendProductionError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({ message: 'Something went wrong' });
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    if (error.name === 'TokenExpiredError')
      error = new AppError(`Token has expired!`, 401);

    if (error.name === 'JsonWebTokenError')
      error = new AppError(`Invalid token`, 401);

    sendProductionError(error, res);
  }
};
