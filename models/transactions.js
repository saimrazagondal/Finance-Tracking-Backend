const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');
const {
  TRANSACTION_TYPES: { INCOME, EXPENSE },
} = require('../utils/constants');

const Transaction = sequelize.define(
  'transactions',
  {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Amount is required' },
      },
    },
    transactionType: {
      type: DataTypes.ENUM(INCOME, EXPENSE),
      allowNull: false,
      validate: {
        notNull: { msg: 'Transaction Type is required' },
        isIn: {
          args: [[INCOME, EXPENSE]],
          msg: 'Invalid transaction type',
        },
      },
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [, 200],
          msg: 'Description cannot be more than 200 characters long',
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    tableName: 'transactions',
  }
);

module.exports = Transaction;
