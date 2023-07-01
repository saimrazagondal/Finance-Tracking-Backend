const sequelize = require('../../db/client');
const AppError = require('../../utils/CustomError');
const { ROLES } = require('../../utils/constants');

exports.checkTransactionExists = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  if (!user)
    return next(new AppError('Unauthorized. Please log in to continue', 401));

  // const trans = await Transaction.findByPk(id);
  const [trans] = await sequelize.query(
    `
    SELECT
      t.*,
      s."name" as "subcategory",
      c."name" as "category",
      c.id as "categoryId"
    FROM transactions t
    LEFT JOIN subcategories s ON t."subcategoryId" = s.id
    LEFT JOIN categories c ON	c.id = s."categoryId"\
    WHERE t.id = $1
  `,
    {
      bind: [id],
    }
  );

  if (trans?.length === 0)
    return next(new AppError(`Transaction not found`, 404));

  // Non admin user can only access their own transactions
  if (user.role !== ROLES.ADMIN && trans[0].userId !== user.id)
    return next(
      new AppError(`You do not have access to this transaction.`, 404)
    );

  req.transaction = trans[0];
  next();
};
