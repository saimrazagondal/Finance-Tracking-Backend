'use strict';

const { ROLES } = require('../utils/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'name',
      },
      defaultValue: ROLES.USER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'role');
  },
};
