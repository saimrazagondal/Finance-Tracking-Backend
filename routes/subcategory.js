const express = require('express');

const { validateSchema, authenticate } = require('../middlewares');
const {
  createSubcategorySchema,
  getAllSubcategoriesSchema,
  updateSubcategoryByIdSchema,
  deleteSubcategoryByIdSchema,
  getSubcategoryByIdSchema,
} = require('../controllers/subcategoryController/schema');
const {
  createSubcategory,
  getAllSubcategories,
  updateSubcategoryById,
  deleteSubcategoryById,
  getSubcategoryById,
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
  .get(
    authenticate,
    validateSchema(getSubcategoryByIdSchema),
    getSubcategoryById
  )
  .patch(
    authenticate,
    validateSchema(updateSubcategoryByIdSchema),
    updateSubcategoryById
  )
  .delete(
    authenticate,
    validateSchema(deleteSubcategoryByIdSchema),
    deleteSubcategoryById
  );

module.exports = { subcategoryRoutes: router };
