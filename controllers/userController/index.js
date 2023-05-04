const Transaction = require('../../models/transactionModel');
const User = require('../../models/userModel');
const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

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

exports.updateUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  res.status(200).json({ message: 'Updated successfully!' });
});
