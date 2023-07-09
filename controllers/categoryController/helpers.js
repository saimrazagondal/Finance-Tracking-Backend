const Category = require('../../models/category');
const AppError = require('../../utils/CustomError');
const { ROLES } = require('../../utils/constants');

// if allowGlobal is true,  grant access to global categories
exports.validateAccessToCategory = async (
  id,
  loggedInUser,
  allowGlobal = false
) => {
  const category = await Category.findByPk(id);

  if (!category) throw new AppError(`Category not found`, 404);

  if (!allowGlobal && category.userId === null)
    throw new AppError(`Not allowed`, 403);

  // If non-admin user tries to access a category that is not theirs, throw error
  if (loggedInUser.role !== ROLES.ADMIN && category.userId !== loggedInUser.id)
    if (!(allowGlobal && category.userId === null))
      throw new AppError(`Not allowed to access this category`, 401);

  return category;
};
