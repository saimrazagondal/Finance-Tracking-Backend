module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transactions', 'subcategoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'subcategories',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactions', 'subcategoryId');
  },
};
