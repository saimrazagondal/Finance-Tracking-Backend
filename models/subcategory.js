const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');

const SubCategory = sequelize.define(
  'subcategories',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
  },
  {
    tableName: 'subcategories',
  }
);

module.exports = SubCategory;
