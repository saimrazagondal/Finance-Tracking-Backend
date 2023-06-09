const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/CustomError');
const { catchAsync } = require('../utils/catchAsync');
const User = require('../models/user');
const { USER_STATUSES } = require('../utils/constants');
const { removeSensitiveUserData } = require('../utils/helpers');

exports.authenticate = catchAsync(async (req, res, next) => {
  // Check if token is present
  let token;

  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError(`Unauthorized`, 401));

  // Check if token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN_KEY);

  // Check if user exists
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: USER_STATUSES.ACTIVE,
    },
  });

  if (!user) return next(new AppError(`User does not exist`, 401));

  // Check if user has changed password since jwt has been issued
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new AppError(`User recently changed password! Please log in again.`, 401)
    );

  // Grant access
  req.user = removeSensitiveUserData(user.toJSON());
  next();
});
