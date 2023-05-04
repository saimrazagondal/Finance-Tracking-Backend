const Transaction = require('../../models/transactionModel');
const AppError = require('../../utils/CustomError');

exports.checkTransactionExists = async (req, res, next) => {
  const { id } = req.params;

  const trans = await Transaction.findById(id).lean();

  if (!trans) next(new AppError(`Transaction not found`, 404));

  req.transaction = trans;
  next();
};
