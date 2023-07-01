const Transaction = require('../../models/transactions');
const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync');
const { ROLES } = require('../../utils/constants');

/**
 *
 * @param {*} role
 * @param {*} requestedUserId
 * @param {*} loggedInUserId
 * @returns object containing where statement or undefined
 *
 * if user is admin
 * if userId is not empty, return where statement for only requested user else return empty
 *
 * if user is not admin
 * if userId is not empty and requested id is not users own id, throw error
 * else return where statement with id as loggedInUserId
 *
 */
const generateWhereClause = (role, requestedUserId, loggedInUserId) => {
  if (role === ROLES.ADMIN) {
    if (requestedUserId) return { userId: requestedUserId };

    return;
  }

  if (requestedUserId && parseInt(requestedUserId) !== parseInt(loggedInUserId))
    throw new AppError(`You do not have access to this user`, 401);

  return { userId: loggedInUserId };
};

/**
 * @param {number} userId if not empty, only transactions of given id will be returned if user has access
 * admin has access to all transactions
 * user can only access their own transactions
 */
const getAllTransactions = catchAsync(async (req, res, next) => {
  const { userId } = req.query;
  let whereClause;

  whereClause = generateWhereClause(req.user.role, userId, req.user.id, next);

  const transactions = await Transaction.findAll({
    where: whereClause,
    order: [['createdAt', 'ASC']],
  });

  res.status(200).json({
    data: { results: transactions.length, transactions },
  });
});

const createTransaction = catchAsync(async (req, res, next) => {
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
const getTransactionById = catchAsync(async (req, res) => {
  res.status(200).json({
    data: req.transaction,
  });
});

/**
 * Admins can update any transaction
 * Non Admin users can only update their own transactions
 *
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
 * Admin can delete any transaction
 * Non admin users can delete only their own transactions
 *
 */
const deleteTransactionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

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
