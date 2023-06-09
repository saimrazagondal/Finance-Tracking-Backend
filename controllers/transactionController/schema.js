const Joi = require('joi');
const {
  TRANSACTION_TYPES: { INCOME, EXPENSE },
} = require('../../utils/constants');

const createTransactionSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({
    amount: Joi.number().required(),
    transactionType: Joi.string().valid(INCOME, EXPENSE).required(),
    date: Joi.date(),
    description: Joi.string().max(200),
  }),
  pathParameters: Joi.object({}),
};

const getTransactionSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({}),
  pathParameters: Joi.object({
    id: Joi.string().required(),
  }),
};

const updateTransactionSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({
    amount: Joi.number(),
    transactionType: Joi.string().valid(INCOME, EXPENSE),
    date: Joi.date(),
    description: Joi.string().max(200),
  }),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

const deleteTransactionSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({}),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  createTransactionSchema,
  getTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
};
