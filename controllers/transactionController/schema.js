const Joi = require('joi');

const createTransactionSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({
    amount: Joi.number().required(),
    transactionType: Joi.string().valid('Income', 'Expense').required(),
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
    transactionType: Joi.string().valid('Income', 'Expense'),
    date: Joi.date(),
    description: Joi.string().max(200),
  }),
  pathParameters: Joi.object({
    id: Joi.string().required(),
  }),
};

const deleteTransactionSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({}),
  pathParameters: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createTransactionSchema,
  getTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
};
