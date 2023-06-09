const {
  TRANSACTION_TYPES: { INCOME, EXPENSE },
} = require('../utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Amount is required' },
        },
      },
      transactionType: {
        type: Sequelize.ENUM(INCOME, EXPENSE),
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
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
      description: {
        type: Sequelize.STRING,
        validate: {
          len: {
            args: [, 200],
            msg: 'Description cannot be more than 200 characters long',
          },
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  },
};
