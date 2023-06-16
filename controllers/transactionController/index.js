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
