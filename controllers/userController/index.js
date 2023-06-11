const Transaction = require('../../models/transactions');
const User = require('../../models/user');

const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync');
const {
  USER_STATUSES,
  SENSITIVE_USER_FIELDS,
  ROLES,
} = require('../../utils/constants');

/**
 * Fetch all users from database. Only allowed to admin users
 * @param includeInactive {boolean}: if true, include inactive users in response.
 *
 */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN)
    return next(new AppError(`Forbidden. Please login as an admin user.`, 403));

  const { includeInactive } = req.query;
  const whereClause = {};

  if (!includeInactive) whereClause.status = USER_STATUSES.ACTIVE;

  const users = await User.findAll({
    attributes: { exclude: SENSITIVE_USER_FIELDS },
    where: whereClause,
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
 * Admin has access to all active users. Non-admin users can only fetch their own data
 * @param includeTransactions {boolean}: if true, include all transactions of user
 *
 */
exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { includeTransactions } = req.query;

  let { user } = req;

  // Only admins are allowed to fetch data of other users
  if (parseInt(id) !== user.id) {
    if (user.role !== ROLES.ADMIN)
      return next(
        new AppError(`You are not authorized to access this user`, 401)
      );

    user = await User.findOne({
      where: { id, status: USER_STATUSES.ACTIVE },
      attributes: { exclude: SENSITIVE_USER_FIELDS },
    });

    if (!user)
      return next(new AppError(`User does not exist or may be inactive`, 404));
  }

  if (includeTransactions) {
    // Include all transactions for user
    user.dataValues.transactions = await Transaction.findAll({
      where: {
        userId: parseInt(id),
      },
    });
  }
  return res.status(200).json({
    data: { user },
  });
});

/**
 * Update details of a user
 * Currently supports updating firstName and lastName only
 *
 * TODO
 * Admin has all access
 * User can only update their own data
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
 * TODO
 * Admin has all access
 * User can only deactivate themselves
 * After 2 weeks of deactivation, user will be unable to access their account
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

// TODO Activate user
