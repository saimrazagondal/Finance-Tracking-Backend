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

const checkAccessToUserAndFetch = async (
  requestedUserId,
  loggedInUser,
  roles = [ROLES.ADMIN]
) => {
  if (parseInt(requestedUserId) !== loggedInUser?.id) {
    if (!roles.includes(loggedInUser.role))
      throw new AppError(`You are not authorized to access this user`, 401);

    const user = await User.findOne({
      where: { id: requestedUserId, status: USER_STATUSES.ACTIVE },
      attributes: { exclude: SENSITIVE_USER_FIELDS },
    });

    if (!user)
      throw new AppError(`User does not exist or may be inactive`, 404);

    return user;
  }

  return loggedInUser;
};

/**
 * Get all details of user by user-id
 * Admin has access to all active users. Non-admin users can only fetch their own data
 * @param includeTransactions {boolean}: if true, include all transactions of user
 *
 */
exports.getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { includeTransactions } = req.query;

  let { user } = req;

  // Only admins are allowed to fetch data of other users
  user = await checkAccessToUserAndFetch(id, user, [ROLES.ADMIN]);

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
 * Non admin users can only update their own details
 */
exports.updateUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  let { user } = req;

  user = await checkAccessToUserAndFetch(id, user, [ROLES.ADMIN]);

  Object.entries(req.body).forEach(([key, value]) => {
    user[key] = value;
  });

  await user.save();

  return res.status(200).json({
    message: 'Updated successfully!',
  });
});

/**
 * Updates the status field of user from active to inactive
 * Users can only deactivate their own accounts
 * Admins have access to all users
 */
exports.deactivateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req;

  // Non-admin user is only authorized to update their own details
  user = await checkAccessToUserAndFetch(id, user, [ROLES.ADMIN]);

  // change status from active to inactive
  user.status = USER_STATUSES.INACTIVE;
  user.deactivatedAt = Date.now();

  await user.save();

  return res.status(200).json({ message: 'User Deactivated!' });
});

/**
 * Only admin users can activate user
 *
 */
exports.activateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let { user } = req;

  if (user.role !== ROLES.ADMIN)
    return next(
      new AppError(
        `Please contact an admin to get your account re-activated`,
        401
      )
    );

  // reactivate user
  await User.update(
    { status: USER_STATUSES.ACTIVE, deactivatedAt: null },
    { where: { id } }
  );

  return res.status(200).json({ message: 'User successfully activated' });
});
