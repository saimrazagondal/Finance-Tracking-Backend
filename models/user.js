const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');
const bcrypt = require('bcryptjs');
const { USER_STATUSES } = require('../utils/constants');
const { removeSensitiveUserData } = require('../utils/helpers');

// TODO Ask about added fields via migrations. How to add them here in advance
const User = sequelize.define(
  'user',
  {
    email: {
      // TODO Add unique check
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Email is required' },
        isEmail: { msg: 'Invalid email' },
      },
    },
    password: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordChangedAt: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM(USER_STATUSES.ACTIVE, USER_STATUSES.INACTIVE),
      allowNull: false,
      defaultValue: USER_STATUSES.ACTIVE,
      validate: {
        isIn: {
          args: [[USER_STATUSES.ACTIVE, USER_STATUSES.INACTIVE]],
          msg: 'Invalid value for status',
        },
      },
    },
    deactivatedAt: { type: DataTypes.DATE },
  },
  {
    tableName: 'user',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      afterCreate: (record) => {
        removeSensitiveUserData(record?.dataValues);
      },
      beforeUpdate: async (user, options) => {
        if (options.fields.includes('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

User.prototype.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Checks if password was changed after issuance of jwt token
User.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

module.exports = User;
