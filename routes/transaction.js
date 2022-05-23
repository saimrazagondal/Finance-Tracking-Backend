const express = require('express');
const {
  getAllTransactions,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
  getTransactionById,
} = require('../controllers/transactionController');
const router = express.Router();

router.route('/').get(getAllTransactions).post(createTransaction);

router
  .route('/:id')
  .get(getTransactionById)
  .patch(updateTransactionById)
  .delete(deleteTransactionById);

module.exports = { transactionRoutes: router };
