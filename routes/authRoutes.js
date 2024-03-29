const express = require('express');
const authController = require('../controllers/AuthController'); // Correct path to the AuthController file

const router = express.Router();

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for user logout
router.get('/logout', authController.logout);

// Route for email verification
router.get('/verify-email/:token', authController.verifyEmail);



module.exports = router;
