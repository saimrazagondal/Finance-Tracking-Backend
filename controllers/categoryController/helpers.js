const Category = require('../../models/category');
const AppError = require('../../utils/CustomError');
const { ROLES } = require('../../utils/constants');

exports.validateAccessToCategory = async (id, loggedInUser) => {
  const category = await Category.findByPk(id);

  if (!category || category.userId === null)
    throw new AppError(`Category not found`, 404);

  // If non-admin user tries to access a category that is not theirs, throw error
  if (loggedInUser.role !== ROLES.ADMIN && category.userId !== loggedInUser.id)
    throw new AppError(`Not allowed to access this category`, 401);

  return category;
};
