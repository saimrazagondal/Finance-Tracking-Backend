const express = require('express');
const {
  createCategory,
  getCategories,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/categoryController');
const { validateSchema, authenticate } = require('../middlewares');
const {
  createCategorySchema,
  getAllCategoriesSchema,
  updateCategoryByIdSchema,
  deleteCategoryByIdSchema,
} = require('../controllers/categoryController/schema');

const router = express.Router();

router
  .route('/')
  .get(authenticate, validateSchema(getAllCategoriesSchema), getCategories)
  .post(authenticate, validateSchema(createCategorySchema), createCategory);

router
  .route('/:id')
  .patch(
    authenticate,
    validateSchema(updateCategoryByIdSchema),
    updateCategoryById
  )
  .delete(
    authenticate,
    validateSchema(deleteCategoryByIdSchema),
    deleteCategoryById
  );

module.exports = { categoryRouter: router };
