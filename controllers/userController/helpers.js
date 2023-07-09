const User = require('../../models/user');
const AppError = require('../../utils/CustomError');
const { ROLES } = require('../../utils/constants');

exports.checkAccessToUserAndFetch = async (
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
