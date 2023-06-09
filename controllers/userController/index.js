const Transaction = require('../../models/transactions');
const User = require('../../models/user');

const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync');
const {
  USER_STATUSES,
  SENSITIVE_USER_FIELDS,
} = require('../../utils/constants');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: SENSITIVE_USER_FIELDS },
    where: { status: USER_STATUSES.ACTIVE },
  });

  if (users.length === 0) return next(new AppError(`No record found`, 404));

  return res.status(200).json({
    data: {
      results: users.length,
      users,
    },
  });
});

/**
 * Get all details of user by user-id
 * @param includeTransactions {boolean}: if true, include all transactions of user
 *
 */
exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { includeTransactions } = req.query;

  // User is only authorized to fetch his own details
  if (parseInt(id) !== req.user.id)
    return next(
      new AppError(`You are not authorized to access this user`, 401)
    );

  // Include all transactions for user
  if (includeTransactions) {
    req.user.transactions = await Transaction.findAll({
      where: {
        userId: id,
      },
    });
  }

  return res.status(200).json({
    data: { user: req.user },
  });
});

/**
 * Update details of a user
 * Currently supports updating firstName and lastName only
 *
 */
exports.updateUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // User is only authorized to update his own details
  if (parseInt(id) !== req.user.id)
    return next(
      new AppError(`You are not authorized to update this user`, 401)
    );

  await User.update({ ...req.body }, { where: { id } });

  return res.status(200).json({
    message: 'Updated successfully!',
  });
});

/**
 * Updates the status field of user from active to inactive
 * Users can only deactivate their own accounts
 *
 */
exports.deactivateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // User is only authorized to update his own details
  if (parseInt(id) !== req.user.id)
    return next(new AppError(`Unauthorized`, 401));

  // change status from active to inactive
  await User.update(
    {
      status: USER_STATUSES.INACTIVE,
      deactivatedAt: Date.now(),
    },
    { where: { id } }
  );

  return res.status(200).json({ message: 'User Deactivated!' });
});
