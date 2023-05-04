const Transaction = require('../../models/transactionModel');
const AppError = require('../../utils/CustomError');
const { catchAsync } = require('../../utils/catchAsync');

const getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await Transaction.find();
  // const transactions = await Transaction.find().populate('user');

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
    dateOccurred: date,
    user: req.user.id,
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

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  res.status(200).json({
    message: 'Transaction updated successfully!',
    transaction: updatedTransaction,
  });
});

const deleteTransactionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // check that only the logged in user can delete their id
  if (req.transaction?.user?.toString() !== req.user?._id.toString())
    return next(
      new AppError(`You are not authorized to delete this transaction`, 401)
    );

  // delete transaction
  await Transaction.deleteOne({ _id: id });

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
