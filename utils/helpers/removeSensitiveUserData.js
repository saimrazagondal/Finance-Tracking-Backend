const { SENSITIVE_USER_FIELDS } = require('../constants');

/**
 * @param {*} userData
 * Removes all sensitive fields from userResponse
 */
module.exports = (userData) => {
  const data = { ...userData };

  SENSITIVE_USER_FIELDS.forEach((el) => {
    delete data?.[el];
  });

  return data;
};
