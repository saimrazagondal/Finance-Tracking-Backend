const Transaction = require('../../models/transactions');
const AppError = require('../../utils/CustomError');
const { ROLES } = require('../../utils/constants');

exports.checkTransactionExists = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  if (!user)
    return next(new AppError('Unauthorized. Please log in to continue', 401));

  const trans = await Transaction.findByPk(id);

  if (!trans) next(new AppError(`Transaction not found`, 404));

  // Non admin user can only access their own transactions
  if (user.role !== ROLES.ADMIN && trans.userId !== user.id)
    return next(
      new AppError(`You do not have access to this transaction.`, 404)
    );

  req.transaction = trans;
  next();
};
