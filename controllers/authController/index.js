const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync.js');
const jwt = require('jsonwebtoken');
const { USER_STATUSES } = require('../../utils/constants');
const User = require('../../models/user');
const { removeSensitiveUserData } = require('../../utils/helpers');

const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_TOKEN_KEY, {
    expiresIn: '5000000',
  });
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ where: { email } });

  if (!user) return next(new AppError('User does not exist', 404));

  // If user has been deactivated, reactivate user
  // TODO Check deactivatedAt to be les than 2 weeks
  if (user.status === USER_STATUSES.INACTIVE)
    await User.update(
      { status: USER_STATUSES.ACTIVE, deactivatedAt: null },
      { where: { email } }
    );

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

const signup = catchAsync(async (req, res) => {
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

const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, updatedPassword, updatedPasswordConfirm } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!(await user.comparePasswords(currentPassword, user.password)))
    return next(new AppError(`Incorrect password`, 401));

  if (currentPassword === updatedPassword)
    return next(
      new AppError('Current and Updated passwords cannot be the same', 400)
    );

  if (updatedPassword !== updatedPasswordConfirm)
    return next(new AppError(`Passwords do not match`, 400));

  user.password = updatedPassword;

  await user.save();

  return res.status(200).json({ message: 'success' });
});

module.exports = { login, signup, changePassword };
