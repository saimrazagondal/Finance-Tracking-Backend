/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'subcategories',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: { type: Sequelize.STRING, allowNull: false },
          categoryId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'categories',
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
        },
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE subcategories ADD CONSTRAINT name_categoryId_distinct_not_nulls UNIQUE NULLS NOT DISTINCT ("name", "categoryId");`,
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subcategories');
  },
};
