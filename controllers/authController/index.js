const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync.js');
const { USER_STATUSES, ROLES } = require('../../utils/constants');
const User = require('../../models/user');
const { removeSensitiveUserData, generateOtp } = require('../../utils/helpers');
const moment = require('moment');
const { generateToken } = require('./helpers');

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ where: { email } });

  if (!user) return next(new AppError('User does not exist', 404));

  // If user has been deactivated
  if (user.status === USER_STATUSES.INACTIVE) {
    // if deactivation date + 14 days is less than today i.e. in the past
    if (moment.utc(user.deactivatedAt).add(14, 'd') < moment.utc(Date.now())) {
      return res.status(404).json({
        message: 'User does not exist',
      });
    }

    // reactivate user
    await User.update(
      { status: USER_STATUSES.ACTIVE, deactivatedAt: null },
      { where: { email } }
    );
  }

  // Compare passwords
  if (!(await user.comparePasswords(password, user.password)))
    return next(new AppError('Invalid email/password', 400));

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  user = removeSensitiveUserData(user?.dataValues);

  return res.status(200).json({
    token: token,
    user,
  });
});

/**
 * default user will be created as USER role.
 * Admin users will be created from database manually
 */
exports.signup = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
  } = req.body;

  if (password !== passwordConfirm)
    return next(new AppError(`Passwords do not match`, 400));

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    passwordChangedAt,
    role: ROLES.USER,
  });

  const token = generateToken({
    id: createdUser.id,
    email: createdUser.email,
  });

  return res.status(201).json({
    token,
    user: createdUser,
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, updatedPassword, updatedPasswordConfirm } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!(await user.comparePasswords(currentPassword, user.password)))
    return next(new AppError(`Incorrect password`, 401));

  if (currentPassword === updatedPassword)
    return next(
      new AppError('New password cannot be same as old password', 400)
    );

  if (updatedPassword !== updatedPasswordConfirm)
    return next(new AppError(`Passwords do not match`, 400));

  user.password = updatedPassword;

  await user.save();

  return res.status(200).json({ message: 'success' });
});

// todo store otp in db along with expiration date
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) return next(new AppError(`User not found`, 404));
  const OTP = generateOtp(6);

  res.status(200).json({
    message: 'Please use the following OTP Code to change your password',
    data: { OTP },
  });
});

// TODO: verify otp, send email
