const { SENSITIVE_USER_FIELDS } = require('../constants');

/**
 * @param {*} userData
 * Removes all sensitive fields from userResponse
 */
module.exports = (userData) => {
  SENSITIVE_USER_FIELDS.forEach((el) => {
    delete userData?.[el];
  });

  return userData;
};
