const Transaction = require('../../models/transactions');
const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync');

const getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await Transaction.findAll({
    where: { userId: req?.user?.id },
    order: [['createdAt', 'ASC']],
  });

  res.status(200).json({
    data: { results: transactions.length, transactions },
  });
});

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

const getTransactionById = catchAsync(async (req, res) => {
  res.status(200).json({
    data: req.transaction,
  });
});

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
