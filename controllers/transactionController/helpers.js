const { ROLES } = require('../../utils/constants');

/**
 *
 * @param {*} role
 * @param {*} requestedUserId
 * @param {*} loggedInUserId
 * @returns query string and parameter array
 *
 * if user is admin
 * if userId is not empty, add where clause for only requested user
 *
 * if user is not admin
 * if userId is not empty and requested id is not users own id, throw error
 * else add where clause with id as loggedInUserId
 *
 */
exports.generateGetAllTransactionsQuery = (
  role,
  requestedUserId,
  loggedInUserId
) => {
  const params = [];
  let orderBy = ` ORDER BY t."createdAt"`;

  let query = `
    SELECT
      t.*,
      s."name" as "subcategory",
      c."name" as "category",
      c.id as "categoryId"
    FROM transactions t
    LEFT JOIN subcategories s ON t."subcategoryId" = s.id
    LEFT JOIN categories c ON	c.id = s."categoryId"
  `;

  if (role === ROLES.ADMIN) {
    if (requestedUserId) {
      query += ` WHERE t."userId" = $1`;
      params.push(requestedUserId);
    }
  } else {
    if (
      requestedUserId &&
      parseInt(requestedUserId) !== parseInt(loggedInUserId)
    )
      throw new AppError(`You do not have access to this user`, 401);

    query += ` WHERE t."userId" = $1`;
    params.push(loggedInUserId);
  }

  query += orderBy;
  return {
    query,
    params,
  };
};
