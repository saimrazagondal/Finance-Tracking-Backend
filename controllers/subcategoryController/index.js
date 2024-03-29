const { catchAsync } = require('../../utils/catchAsync');
const AppError = require('../../utils/CustomError');
const { ROLES } = require('../../utils/constants');
const Category = require('../../models/category');
const SubCategory = require('../../models/subcategory');
const Transaction = require('../../models/transactions');
const { validateAccessToSubcategory } = require('./helpers');

const fetchCategoryById = async (id) => {
  const category = await Category.findByPk(id);

  // global categories (userId = null) cannot be edited
  if (!category) throw new AppError(`Category not found`, 400);

  return category;
};

/**
 * Admins can create subcategories in any category
 * Non admin user can create in only their own categories
 */
exports.createSubcategory = catchAsync(async (req, res, next) => {
  const { name, categoryId } = req.body;
  const loggedInUser = req.user;

  const category = await fetchCategoryById(categoryId);

  if (category.userId === null) return next(new AppError(`Not allowed`, 403));

  // Non admin users can only add sub categories against their own categories
  if (loggedInUser.role !== ROLES.ADMIN && category.userId !== loggedInUser.id)
    return next(new AppError(`You don't have access to this category`, 401));

  const result = await SubCategory.create({
    name,
    categoryId,
  });

  return res.status(200).json({ message: 'Subcategory created!', result });
});

/**
 * All users have access to subcategories of default categories
 * Non admin users can fetch subcategories only of their own categories
 * @param categoryId {number}
 * @returns list of subcategories
 */
exports.getAllSubcategories = catchAsync(async (req, res, next) => {
  const { categoryId } = req.query;

  const category = await fetchCategoryById(categoryId);

  /**
   * If category is not a default/global category (userId !== null) and,
   * if a non admin user tries to access a category that doesn't belong to them, throw err
   */
  if (
    category.userId &&
    req.user.role !== ROLES.ADMIN &&
    category.userId !== req.user.id
  )
    return next(new AppError(`You don't have access to this category`, 401));

  const subcategories = await SubCategory.findAll({
    where: { categoryId },
    order: [['createdAt', 'ASC']],
  });

  return res
    .status(200)
    .json({ total: subcategories.length, data: subcategories });
});

/**
 * @returns subcategory details, category id and category name
 *
 */
exports.getSubcategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const details = await validateAccessToSubcategory(id, req.user, true);

  return res.status(200).json({ data: details });
});

/**
 * Subcategories belonging to global/default categories cannot be edited
 * Non admin users can only edit subcategories that belong to their own categories
 * currently, only supports editing name on subcategory
 */
exports.updateSubcategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await validateAccessToSubcategory(id, req.user);

  await SubCategory.update({ name }, { where: { id: id } });

  return res.status(200).json({
    message: 'Updated successfully',
  });
});

/**
 * A subcategory is deleted only if:
 * - it is not belonging to a global category
 * - loggedInUser hs access to said subcategory
 * - no transactions are listed against said subcategory
 */
exports.deleteSubcategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const subcategoryDetails = await validateAccessToSubcategory(id, req.user);

  // check if transactions exist against this subcategory. If yes, throw error else delete
  const transactions = await Transaction.findAll({
    where: { subcategoryId: id, userId: subcategoryDetails.userId },
  });

  if (transactions?.length > 0)
    return next(
      new AppError(
        `Not allowed. You have transactions listed against this subcategory`,
        403
      )
    );

  await SubCategory.destroy({
    where: { id },
  });

  return res.status(200).json({ message: 'Subcategory Deleted Successfully' });
});
