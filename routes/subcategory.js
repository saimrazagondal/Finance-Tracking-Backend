const express = require('express');

const { validateSchema, authenticate } = require('../middlewares');
const {
  createSubcategorySchema,
  getAllSubcategoriesSchema,
  updateSubcategoryByIdSchema,
} = require('../controllers/subcategoryController/schema');
const {
  createSubcategory,
  getAllSubcategories,
  updateSubcategoryById,
} = require('../controllers/subcategoryController');

const router = express.Router();

router
  .route('/')
  .get(
    authenticate,
    validateSchema(getAllSubcategoriesSchema),
    getAllSubcategories
  )
  .post(
    authenticate,
    validateSchema(createSubcategorySchema),
    createSubcategory
  );

router
  .route('/:id')
  .patch(
    authenticate,
    validateSchema(updateSubcategoryByIdSchema),
    updateSubcategoryById
  );

module.exports = { subcategoryRoutes: router };
