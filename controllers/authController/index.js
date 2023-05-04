const User = require('../../models/userModel');
const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync.js');
const jwt = require('jsonwebtoken');

const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_TOKEN_KEY, {
    expiresIn: '5000000',
  });
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new AppError('User does not exist', 404));

  if (!(await user.comparePasswords(password, user.password)))
    return next(new AppError('Invalid email/password', 400));

  const token = generateToken({
    id: user._id,
    email: user.email,
  });

  return res.status(200).json({
    token: token,
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

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
  });

  const token = generateToken({
    id: createdUser._id,
    email: createdUser.email,
  });

  return res.status(201).json({
    token,
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, updatedPassword, updatedPasswordConfirm } = req.body;

  if (currentPassword === updatedPassword)
    return next(
      new AppError('Current and Updated passwords cannot be the same', 400)
    );

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePasswords(currentPassword, user.password)))
    return next(new AppError(`Incorrect password`, 401));

  user.password = updatedPassword;
  user.passwordConfirm = updatedPasswordConfirm;

  await user.save();

  return res.status(200).json({ message: 'success' });
});

module.exports = { login, signup, changePassword };
