const { CATEGORIES } = require('../utils/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'categories',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          userId: {
            type: Sequelize.INTEGER,
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
        },
        {
          transaction,
        }
      );

      await queryInterface.bulkInsert(
        'categories',
        Object.keys(CATEGORIES).map((category) => ({
          name: category,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE categories ADD CONSTRAINT name_userId_distinct_not_nulls UNIQUE NULLS NOT DISTINCT ("name", "userId");`,
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  },
};
