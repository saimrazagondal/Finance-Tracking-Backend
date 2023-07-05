const Joi = require('joi');

const createCategorySchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({
    name: Joi.string().required(),
    userId: Joi.number(),
  }),
  pathParameters: Joi.object({}),
};

const getAllCategoriesSchema = {
  queryStringParameters: Joi.object({
    includeGlobal: Joi.boolean(),
  }),
  body: Joi.object({}),
  pathParameters: Joi.object({}),
};

module.exports = {
  createCategorySchema,
  getAllCategoriesSchema,
};
