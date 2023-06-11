const Joi = require('joi');

const getAllUsersSchema = {
  queryStringParameters: Joi.object({
    includeInactive: Joi.boolean().default(false),
  }),
  body: Joi.object({}),
  pathParameters: Joi.object({}),
};

const getUserByIdSchema = {
  queryStringParameters: Joi.object({
    includeTransactions: Joi.boolean().default(false),
  }),
  body: Joi.object({}),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

const updateUserByIdSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
  }),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

const deleteUserByIdSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({}),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  getUserByIdSchema,
  getAllUsersSchema,
  updateUserByIdSchema,
  deleteUserByIdSchema,
};
