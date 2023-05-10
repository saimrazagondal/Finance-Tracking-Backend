const Transaction = require('../../models/transactionModel');
const User = require('../../models/userModel');
const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync');
const { USER_STATUSES } = require('../../utils/constants');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ status: USER_STATUSES.ACTIVE });

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
  if (id !== req.user.id)
    return next(
      new AppError(`You are not authorized to access this user`, 401)
    );

  // const user = req.user.toObject();
  const user = req.user.toJSON();

  // Include all transactions for user
  if (includeTransactions) {
    user.transactions = await Transaction.find({
      user: id,
    })
      .select('-user')
      .lean();
  }

  return res.status(200).json({
    data: { user },
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
  if (id !== req.user.id)
    return next(
      new AppError(`You are not authorized to update this user`, 401)
    );

  const updated = await User.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: 'Updated successfully!', updatedUser: updated });
});

/**
 * Updates the status field of user from active to inactive
 * Users can only deactivate their own accounts
 *
 */
exports.deactivateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // User is only authorized to update his own details
  if (id !== req.user.id) return next(new AppError(`Unauthorized`, 401));

  // change status from active to inactive
  await User.findByIdAndUpdate(id, {
    status: USER_STATUSES.INACTIVE,
    deactivatedAt: Date.now(),
  });

  return res.status(200).json({ message: 'User Deactivated!' });
});
