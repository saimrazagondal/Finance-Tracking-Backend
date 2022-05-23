const Transaction = require('../models/transactionModel');

const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find();

  res.status(200).json({
    results: transactions.length,
    data: transactions,
  });
};

const createTransaction = async (req, res) => {
  const { amount, transactionType, description, date } = req.body;

  const newTrans = await Transaction.create({
    amount,
    transactionType,
    description,
    dateOccurred: date,
  });

  res.status(201).json({
    data: { transaction: newTrans, message: 'Transaction added successfully' },
  });
};

const getTransactionById = async (req, res) => {
  const { id } = req.params;
  const fetched = await Transaction.findById(id);

  if (!fetched) throw new Error('No transaction found with given id');

  res.status(200).json({
    data: fetched,
  });
};

const updateTransactionById = (req, res) => {
  res.status(200).json({
    message: 'Transaction updated successfully!',
  });
};

const deleteTransactionById = (req, res) => {
  res.status(200).json({
    message: 'Transaction deleted successfully!',
  });
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
};
