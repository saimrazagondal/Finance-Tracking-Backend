const sequelize = require('../../db/client');
const Transaction = require('../../models/transactions');
const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync');
const { generateGetAllTransactionsQuery } = require('./helpers');

/**
 * @param {number} userId if not empty, only transactions of given id will be returned if user has access
 * admin has access to all transactions
 * user can only access their own transactions
 */
// TODO Add pagination
exports.getAllTransactions = catchAsync(async (req, res) => {
  const { userId } = req.query;

  const { query, params } = generateGetAllTransactionsQuery(
    req.user.role,
    userId,
    req.user.id
  );

  const [results] = await sequelize.query(query, { bind: params });

  res.status(200).json({
    data: { results: results.length, transactions: results },
  });
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  const { amount, transactionType, description, date, subcategoryId } =
    req.body;

  if (!subcategoryId)
    return next(new AppError(`subcategoryId is required`, 400));

  const newTrans = await Transaction.create({
    amount,
    transactionType,
    description,
    date: date || Date.now(),
    userId: req.user.id,
    subcategoryId,
  });

  res.status(201).json({
    data: { transaction: newTrans, message: 'Transaction added successfully' },
  });
});

/**
 * Non admin user can only access their own transactions
 *
 */
exports.getTransactionById = catchAsync(async (req, res) => {
  res.status(200).json({
    data: req.transaction,
  });
});

/**
 * Admins can update any transaction
 * Non Admin users can only update their own transactions
 *
 */
exports.updateTransactionById = catchAsync(async (req, res) => {
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
 * Admin can delete any transaction
 * Non admin users can delete only their own transactions
 *
 */
exports.deleteTransactionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // delete transaction
  await Transaction.destroy({ where: { id } });

  res.status(200).json({
    message: 'Transaction deleted successfully!',
  });
});
