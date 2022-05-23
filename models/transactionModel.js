const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  transactionType: {
    type: String,
    required: [true, 'Transaction Type is required'],
    enum: {
      values: ['Income', 'Expense'],
      message: 'Invalid transaction type',
    },
  },
  dateOccurred: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters long'],
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
