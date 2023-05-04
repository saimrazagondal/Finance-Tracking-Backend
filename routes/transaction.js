const express = require('express');
const {
  getAllTransactions,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
  getTransactionById,
} = require('../controllers/transactionController');
const {
  createTransactionSchema,
  getTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
} = require('../controllers/transactionController/schema');
const { authenticate } = require('../middlewares/authenticate');
const { validateSchema } = require('../middlewares/validateSchema');
const { checkTransactionExists } = require('../middlewares/transaction');

const router = express.Router();

router
  .route('/')
  .get(authenticate, getAllTransactions)
  .post(
    authenticate,
    validateSchema(createTransactionSchema),
    createTransaction
  );

router
  .route('/:id')
  .get(
    authenticate,
    validateSchema(getTransactionSchema),
    checkTransactionExists,
    getTransactionById
  )
  .patch(
    authenticate,
    validateSchema(updateTransactionSchema),
    checkTransactionExists,
    updateTransactionById
  )
  .delete(
    authenticate,
    validateSchema(deleteTransactionSchema),
    checkTransactionExists,
    deleteTransactionById
  );

module.exports = { transactionRoutes: router };
