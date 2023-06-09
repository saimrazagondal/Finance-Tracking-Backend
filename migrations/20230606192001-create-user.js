'use strict';

const { USER_STATUSES } = require('../utils/constants');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Email is required' },
          isEmail: { msg: 'Invalid email' },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Password is required' },
          len: {
            args: 6,
            msg: 'Password must be at least 6 characters long',
          },
        },
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passwordChangedAt: { type: Sequelize.DATE },
      status: {
        type: Sequelize.ENUM(USER_STATUSES.ACTIVE, USER_STATUSES.INACTIVE),
        allowNull: false,
        defaultValue: USER_STATUSES.ACTIVE,
        validate: {
          isIn: {
            args: [[USER_STATUSES.ACTIVE, USER_STATUSES.INACTIVE]],
            msg: 'Invalid value for status',
          },
        },
      },
      deactivatedAt: { type: Sequelize.DATE },
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
    await queryInterface.dropTable('user');
  },
};
