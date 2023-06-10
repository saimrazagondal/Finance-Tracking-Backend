'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');

const Roles = sequelize.define(
  'roles',
  {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    tableName: 'roles',
  }
);

module.exports = Roles;
