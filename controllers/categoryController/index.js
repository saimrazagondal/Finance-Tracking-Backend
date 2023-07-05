const { catchAsync } = require('../../utils/catchAsync');
const Category = require('../../models/category');
const AppError = require('../../utils/CustomError');
const { ROLES } = require('../../utils/constants');
const sequelize = require('../../db/client');

/**
 * admins can add categories against any user
 * Non admin users can only add categories against themselves
 * Categories must be unique for every user
 */
exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  let { userId } = req.body;

  const { user: loggedInUser } = req;

  if (!userId) userId = loggedInUser.id;

  if (
    loggedInUser.role !== ROLES.ADMIN &&
    parseInt(userId) !== parseInt(loggedInUser.id)
  ) {
    return next(new AppError(`Not authorized to access this user`, 401));
  }

  const newCategory = await Category.create({
    name,
    userId,
  });

  res
    .status(200)
    .json({ message: 'Category added successfully!', category: newCategory });
});

/**
 * return all custom categories of logged in user
 * if includeDefault true, return default + custom categories
 */
exports.getCategories = catchAsync(async (req, res, next) => {
  const { includeGlobal } = req.query;

  let query = `SELECT * FROM categories c WHERE c."userId" = $1`;
  let orderBy = `ORDER BY c."createdAt" ASC;`;

  if (includeGlobal === 'true') query += ` OR c."userId" IS NULL`;

  const [results] = await sequelize.query(`${query} ${orderBy}`, {
    bind: [req.user.id],
  });

  res.status(200).json({ total: results.length, data: results });
});
