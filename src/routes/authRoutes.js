const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

// Page routes
router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);
router.get('/reset', authController.getResetPage);
router.get('/home', authController.getHomePage);
router.get('/logout', authController.logout);

// API routes
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validate,
  authController.login
);

router.post(
  '/reset-password',
  [
    body('email').isEmail().normalizeEmail(),
    body('oldPassword').notEmpty(),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  validate,
  authController.resetPassword
);

module.exports = router;