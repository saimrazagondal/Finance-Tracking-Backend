const express = require('express');
const router = express.Router();

// Middlewares
const { validateSchema } = require('../middlewares');

// Controllers
const {
  login,
  signup,
  changePassword,
} = require('../controllers/authController');

// Schemas
const {
  loginSchema,
  signupSchema,
  changePasswordSchema,
} = require('../controllers/authController/schema');
const { authenticate } = require('../middlewares/authenticate');

router.post('/login', validateSchema(loginSchema), login);
router.post('/signup', validateSchema(signupSchema), signup);
router.post(
  '/change-password',
  authenticate,
  validateSchema(changePasswordSchema),
  changePassword
);

module.exports = { authRoutes: router };
