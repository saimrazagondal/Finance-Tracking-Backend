const Transaction = require('../../models/transactions');
const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync');

/**
 * TODO
 * If admin: fetch all transactions in db
 * Admin can fetch transactions by user id
 * If user: fetch only self transactions
 */
const getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await Transaction.findAll({
    where: { userId: req?.user?.id },
    order: [['createdAt', 'ASC']],
  });

  res.status(200).json({
    data: { results: transactions.length, transactions },
  });
});

// TODO
// User and Admin can create transaction for themselves only
// Should we allow admins to create transactions for other users??
const createTransaction = catchAsync(async (req, res) => {
  const { amount, transactionType, description, date } = req.body;

  const newTrans = await Transaction.create({
    amount,
    transactionType,
    description,
    date,
    userId: req.user.id,
  });

  res.status(201).json({
    data: { transaction: newTrans, message: 'Transaction added successfully' },
  });
});

/**
 * TODO
 * Admin has all access
 * User can fetch transaction only if it belongs to them
 */
const getTransactionById = catchAsync(async (req, res) => {
  res.status(200).json({
    data: req.transaction,
  });
});

/**
 * TODO
 * Admin has all access
 * User can update transaction only if it belongs to them
 * Should we allow admins to update transactions of other users??
 */
const updateTransactionById = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Object.entries(req.body).forEach(([key, value]) => {
  //   req.transaction[key] = value;
  // });

  // await req.transaction.save();

  const updated = await Transaction.update(
    { ...req.body },
    { where: { id }, returning: true, plain: true }
  );

  res.status(200).json({
    message: 'Transaction updated successfully!',
    transaction: updated?.[1]?.dataValues,
    // transaction: req.transaction,
  });
});

/**
 * TODO
 * Admin has all access
 * User can delete transaction only if it belongs to them
 * Should we allow admins to delete transactions of other users??
 */
const deleteTransactionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // check that only the logged in user can delete their id
  if (req.transaction?.userId !== req.user?.id)
    return next(
      new AppError(`You are not authorized to delete this transaction`, 401)
    );

  // delete transaction
  await Transaction.destroy({ where: { id } });

  res.status(200).json({
    message: 'Transaction deleted successfully!',
  });
});

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
};
