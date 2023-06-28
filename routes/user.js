const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deactivateUser,
  activateUser,
} = require('../controllers/userController');
const { validateSchema } = require('../middlewares');
const {
  getUserByIdSchema,
  getAllUsersSchema,
  updateUserByIdSchema,
} = require('../controllers/userController/schema');
const router = express.Router();

router
  .route('/')
  .get(authenticate, validateSchema(getAllUsersSchema), getAllUsers);

router
  .route('/:id')
  .get(authenticate, validateSchema(getUserByIdSchema), getUserById)
  .patch(authenticate, validateSchema(updateUserByIdSchema), updateUserById);

router.patch('/deactivate/:id', authenticate, deactivateUser);
router.patch('/activate/:id', authenticate, activateUser);

module.exports = { userRoutes: router };
