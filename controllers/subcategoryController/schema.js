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

const getSubcategoryByIdSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({}),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
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

const deleteSubcategoryByIdSchema = {
  queryStringParameters: Joi.object({}),
  body: Joi.object({}),
  pathParameters: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  createSubcategorySchema,
  getAllSubcategoriesSchema,
  updateSubcategoryByIdSchema,
  deleteSubcategoryByIdSchema,
  getSubcategoryByIdSchema,
};
