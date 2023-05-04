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
  date: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters long'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
