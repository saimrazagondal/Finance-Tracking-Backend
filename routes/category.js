const express = require('express');
const {
  createCategory,
  getCategories,
} = require('../controllers/categoryController');
const { validateSchema, authenticate } = require('../middlewares');
const {
  createCategorySchema,
  getAllCategoriesSchema,
} = require('../controllers/categoryController/schema');

const router = express.Router();

router
  .route('/')
  .get(authenticate, validateSchema(getAllCategoriesSchema), getCategories)
  .post(authenticate, validateSchema(createCategorySchema), createCategory);

module.exports = { categoryRouter: router };
