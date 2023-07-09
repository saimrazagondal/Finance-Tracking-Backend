const sequelize = require('../../db/client');
const AppError = require('../../utils/CustomError');
const { ROLES } = require('../../utils/constants');

// if allowGlobal is true,  grant access to global categories
exports.validateAccessToSubcategory = async (
  id,
  loggedInUser,
  allowGlobal = false
) => {
  const [subcategory] = await sequelize.query(
    `
    SELECT
      s.*,
      c."userId",
      c."name" as categoryName
    FROM subcategories s
    JOIN categories c
    ON s."categoryId" = c.id
    WHERE s.id = $1;
  `,
    {
      bind: [id],
    }
  );

  if (subcategory?.length === 0)
    throw new AppError(`Subcategory not found`, 404);

  // subcategories of global/default categories cannot be edited
  if (!allowGlobal && subcategory?.[0]?.userId === null)
    throw new AppError(`Not allowed`, 403);

  // Non admin users can only edit subcategories that belong to their own categories
  if (
    loggedInUser.role !== ROLES.ADMIN &&
    subcategory?.[0]?.userId !== loggedInUser.id
  )
    if (!(allowGlobal && subcategory?.[0]?.userId === null)) {
      throw new AppError(`You do not have access to this subcategory`, 403);
    }

  return subcategory?.[0];
};
