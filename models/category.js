const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');

const Category = sequelize.define(
  'categories',
  {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    tableName: 'categories',
  }
);

module.exports = Category;
