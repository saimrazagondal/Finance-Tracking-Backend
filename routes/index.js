const { transactionRoutes } = require('./transaction');
const { userRoutes } = require('./user');
const { authRoutes } = require('./auth');
const { categoryRoutes } = require('./category');
const { subcategoryRoutes } = require('./subcategory');

module.exports = {
  transactionRoutes,
  userRoutes,
  authRoutes,
  categoryRoutes,
  subcategoryRoutes,
};
