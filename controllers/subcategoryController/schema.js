const Joi = require('joi');

const createSubcategorySchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({
    name: Joi.string().required(),
    categoryId: Joi.number().required(),
  }),
  pathParameters: Joi.object({}),
};

const getAllSubcategoriesSchema = {
  queryStringParameters: Joi.object({
    categoryId: Joi.number().required(),
  }),
  body: Joi.object({}),
  pathParameters: Joi.object({}),
};

const updateSubcategoryByIdSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({
    name: Joi.string(),
  }),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  createSubcategorySchema,
  getAllSubcategoriesSchema,
  updateSubcategoryByIdSchema,
};
