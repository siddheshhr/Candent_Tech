/**
 * Authentication Routes
 * Defines API endpoints for user authentication and password management.
 * 
 * Routes:
 * - POST /signin           : User sign-in
 * - POST /signup           : User registration
 * - POST /google           : Google OAuth sign-in/signup
 * - POST /forgot-password  : Send password reset email
 * - GET  /reset-password/:id/:token : Verify password reset token
 * - POST /reset-password/:id/:token: Update password using reset token
 */
const express = require('express');
const router = express.Router();
const { signup, signin, google,forgotPassword,resetPassword,updatePassword } = require('../controller/auth_controller.js');

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/google', google);
router.post("/forgot-password", forgotPassword);
router.get('/reset-password/:id/:token', resetPassword);
router.post('/reset-password/:id/:token', updatePassword); 


module.exports = router;