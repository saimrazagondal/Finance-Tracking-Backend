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

const getCategoryByIdSchema = {
  queryStringParameters: Joi.object({
    includeSubcategories: Joi.boolean().default(false),
  }),
  body: Joi.object({}),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

const updateCategoryByIdSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({
    name: Joi.string(),
  }),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

const deleteCategoryByIdSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({}),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  createCategorySchema,
  getAllCategoriesSchema,
  updateCategoryByIdSchema,
  deleteCategoryByIdSchema,
  getCategoryByIdSchema,
};
